package main

import (
	"archive/zip"
	"bytes"
	"encoding/json"
	"fmt"
	"image"

	// Dont delete these
	// look like they do nothing but they
	// register the decoders
	_ "image/jpeg"
	_ "image/png"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/crbroughton/image-converter/avif"
	"github.com/crbroughton/image-converter/utils"
	"github.com/crbroughton/image-converter/webp"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type ConversionOptions struct {
	Format   string  `json:"format"`
	Quality  float64 `json:"quality"`
	Lossless bool    `json:"lossless"`
}

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/convert", handleConvert).Methods("POST")
	r.HandleFunc("/health", handleHealth).Methods("GET")

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"POST", "GET", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Content-Length", "Accept-Encoding", "Authorization"},
		AllowCredentials: true,
	})

	srv := &http.Server{
		Handler:      c.Handler(r),
		Addr:         "0.0.0.0:8080",
		WriteTimeout: 300 * time.Second, // Long timeout for processing multiple images
		ReadTimeout:  300 * time.Second,
	}

	log.Println("Server starting on port 8080...")
	log.Fatal(srv.ListenAndServe())
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Image Converter API is running"))
}

// handleConvert processes the incoming images and returns a zip file
func handleConvert(w http.ResponseWriter, r *http.Request) {
	var one_hundred_mb int64 = 100 << 20
	if err := r.ParseMultipartForm(one_hundred_mb); err != nil {
		http.Error(w, "Unable to parse form: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Get conversion options
	optionsStr := r.FormValue("options")
	var options ConversionOptions
	if err := json.Unmarshal([]byte(optionsStr), &options); err != nil {
		http.Error(w, "Invalid options format: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Set defaults if needed
	if options.Format == "" {
		options.Format = "webp"
	}
	if options.Quality == 0 {
		options.Quality = 75
	}

	// Validate format
	if options.Format != "webp" && options.Format != "avif" {
		http.Error(w, "Format must be either 'webp' or 'avif'", http.StatusBadRequest)
		return
	}

	// Get file uploads
	files := r.MultipartForm.File["files"]
	if len(files) == 0 {
		http.Error(w, "No files uploaded", http.StatusBadRequest)
		return
	}

	// Create temporary directory for processing
	tempDir, err := os.MkdirTemp("", "image-convert-")
	if err != nil {
		http.Error(w, "Failed to create temporary directory: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer os.RemoveAll(tempDir) // Clean up when done

	// Process each file and collect results
	var convertedFiles []string
	for _, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			http.Error(w, "Failed to open uploaded file: "+err.Error(), http.StatusInternalServerError)
			return
		}
		defer file.Close()

		// Create output path
		fileName := utils.SanitiseFilename(fileHeader.Filename)
		baseName := strings.TrimSuffix(fileName, filepath.Ext(fileName))
		outputPath := filepath.Join(tempDir, baseName+"."+options.Format)

		// Process the file
		if err := processUploadedFile(file, outputPath, options); err != nil {
			http.Error(w, "Error processing file: "+err.Error(), http.StatusInternalServerError)
			return
		}

		convertedFiles = append(convertedFiles, outputPath)
	}

	// If no files were successfully converted
	if len(convertedFiles) == 0 {
		http.Error(w, "No files were successfully converted", http.StatusInternalServerError)
		return
	}

	// Create a zip file containing all converted images
	zipBuffer, err := createZipFromFiles(convertedFiles)
	if err != nil {
		http.Error(w, "Failed to create zip file: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Set response headers
	w.Header().Set("Content-Type", "application/zip")
	w.Header().Set("Content-Disposition", "attachment; filename=converted_images.zip")
	w.Header().Set("Content-Length", fmt.Sprintf("%d", zipBuffer.Len()))

	// Write zip data to response
	if _, err := io.Copy(w, zipBuffer); err != nil {
		log.Printf("Error sending response: %v", err)
	}
}

// processUploadedFile decodes and converts an uploaded image file
func processUploadedFile(file io.Reader, outputPath string, options ConversionOptions) error {
	// Decode the image
	img, _, err := image.Decode(file)
	if err != nil {
		return fmt.Errorf("failed to decode image: %w", err)
	}

	// Create output file
	output, err := os.Create(outputPath)
	if err != nil {
		return fmt.Errorf("failed to create output file: %w", err)
	}
	defer output.Close()

	// Convert based on selected format
	switch options.Format {
	case "webp":
		if err := webp.ConvertToWebP(img, output, options.Quality, options.Lossless); err != nil {
			return err
		}
	case "avif":
		if err := avif.ConvertToAVIF(img, output, options.Quality, options.Lossless); err != nil {
			return err
		}
	}

	return nil
}

// createZipFromFiles creates a zip file in memory from a list of file paths
func createZipFromFiles(files []string) (*bytes.Buffer, error) {
	buffer := new(bytes.Buffer)
	zipWriter := zip.NewWriter(buffer)
	defer zipWriter.Close()

	for _, file := range files {
		// Open the file for reading
		fileToZip, err := os.Open(file)
		if err != nil {
			return nil, fmt.Errorf("failed to open file %s: %w", file, err)
		}
		defer fileToZip.Close()

		// Get file info for header
		info, err := fileToZip.Stat()
		if err != nil {
			return nil, fmt.Errorf("failed to get file info: %w", err)
		}

		// Create header with file name only (not full path)
		header, err := zip.FileInfoHeader(info)
		if err != nil {
			return nil, fmt.Errorf("failed to create zip header: %w", err)
		}
		header.Name = filepath.Base(file)
		header.Method = zip.Deflate

		// Create writer for this file within the zip
		writer, err := zipWriter.CreateHeader(header)
		if err != nil {
			return nil, fmt.Errorf("failed to create zip file entry: %w", err)
		}

		// Copy file contents to zip
		if _, err = io.Copy(writer, fileToZip); err != nil {
			return nil, fmt.Errorf("failed to write file to zip: %w", err)
		}
	}

	// Make sure to close the zip writer before returning the buffer
	if err := zipWriter.Close(); err != nil {
		return nil, fmt.Errorf("failed to close zip writer: %w", err)
	}

	return buffer, nil
}
