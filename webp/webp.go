package webp

import (
	"fmt"
	"image"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/kolesa-team/go-webp/encoder"
	"github.com/kolesa-team/go-webp/webp"
)

func ConvertToWebP(img image.Image, output *os.File, quality float64, lossless bool) error {
	startTime := time.Now()
	fileName := filepath.Base(output.Name())

	log.Printf("Starting WebP conversion for %s", fileName)
	log.Printf("Conversion parameters: quality=%.2f, lossless=%t", quality, lossless)

	width, height := getImageDimensions(img)
	log.Printf("Image dimensions: %dx%d pixels", width, height)

	var options *encoder.Options
	var err error

	if lossless {
		// The compression factor (0-9) for lossless
		compressionFactor := 6
		log.Printf("Using lossless encoding with compression factor: %d", compressionFactor)

		options, err = encoder.NewLosslessEncoderOptions(encoder.PresetDefault, compressionFactor)
		if err != nil {
			log.Printf("ERROR: Failed to create lossless encoder options: %v", err)
			return fmt.Errorf("failed to create lossless encoder options: %w", err)
		}
	} else {
		log.Printf("Using lossy encoding with quality: %.2f", quality)

		options, err = encoder.NewLossyEncoderOptions(encoder.PresetDefault, float32(quality))
		if err != nil {
			log.Printf("ERROR: Failed to create lossy encoder options: %v", err)
			return fmt.Errorf("failed to create lossy encoder options: %w", err)
		}
	}

	log.Printf("Encoding image to WebP format...")
	encodeStart := time.Now()

	// Encode to WebP
	if err := webp.Encode(output, img, options); err != nil {
		log.Printf("ERROR: WebP encoding failed for %s: %v", fileName, err)
		return fmt.Errorf("failed to encode to WebP: %w", err)
	}

	// Get file info to determine size
	fileInfo, err := output.Stat()
	if err == nil {
		fileSizeKB := float64(fileInfo.Size()) / 1024.0
		log.Printf("Successfully encoded to WebP: %s (%.2f KB)", fileName, fileSizeKB)
	} else {
		log.Printf("Successfully encoded to WebP: %s (couldn't determine file size)", fileName)
	}

	encodeDuration := time.Since(encodeStart)
	totalDuration := time.Since(startTime)
	log.Printf("Encoding time: %v", encodeDuration)
	log.Printf("Total processing time: %v", totalDuration)

	return nil
}

// Helper function to get image dimensions
func getImageDimensions(img image.Image) (int, int) {
	bounds := img.Bounds()
	return bounds.Max.X, bounds.Max.Y
}
