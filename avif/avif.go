package avif

import (
	"fmt"
	"image"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/Kagami/go-avif"
)

func ConvertToAVIF(img image.Image, output *os.File, quality float64, speed int, lossless bool) error {
	startTime := time.Now()
	fileName := filepath.Base(output.Name())

	log.Printf("Starting AVIF conversion for %s", fileName)
	log.Printf("Conversion parameters: quality=%d, speed=%d, lossless=%t", int(quality), speed, lossless)

	width, height := getImageDimensions(img)
	log.Printf("Image dimensions: %dx%d pixels", width, height)

	options := &avif.Options{
		Quality: int(quality), // AVIF quality is 0-63, no idea why this range /shrug
		Speed:   speed,
	}

	log.Printf("Encoding image to AVIF format...")
	encodeStart := time.Now()

	if err := avif.Encode(output, img, options); err != nil {
		log.Printf("ERROR: AVIF encoding failed for %s: %v", fileName, err)
		return fmt.Errorf("failed to encode to AVIF: %w", err)
	}

	// Get file info to determine size
	fileInfo, err := output.Stat()
	if err == nil {
		fileSizeKB := float64(fileInfo.Size()) / 1024.0
		log.Printf("Successfully encoded to AVIF: %s (%.2f KB)", fileName, fileSizeKB)
	} else {
		log.Printf("Successfully encoded to AVIF: %s (couldn't determine file size)", fileName)
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
