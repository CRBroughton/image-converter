package avif

import (
	"fmt"
	"image"
	"os"

	"github.com/Kagami/go-avif"
)

func ConvertToAVIF(img image.Image, output *os.File, quality float64, speed int, lossless bool) error {
	options := &avif.Options{
		Quality: int(quality), // AVIF quality is 0-63, no idea why this range /shrug
		Speed:   speed,
	}
	if err := avif.Encode(output, img, options); err != nil {
		return fmt.Errorf("failed to encode to AVIF: %w", err)
	}
	return nil
}
