package webp

import (
	"fmt"
	"image"
	"os"

	"github.com/kolesa-team/go-webp/encoder"
	"github.com/kolesa-team/go-webp/webp"
)

func ConvertToWebP(img image.Image, output *os.File, quality float64, lossless bool) error {
	var options *encoder.Options
	var err error

	if lossless {
		// The compression factor (0-9) for lossless
		compressionFactor := 6
		options, err = encoder.NewLosslessEncoderOptions(encoder.PresetDefault, compressionFactor)
		if err != nil {
			return fmt.Errorf("failed to create lossless encoder options: %w", err)
		}
	} else {
		options, err = encoder.NewLossyEncoderOptions(encoder.PresetDefault, float32(quality))
		if err != nil {
			return fmt.Errorf("failed to create lossy encoder options: %w", err)
		}
	}

	// Encode to WebP
	if err := webp.Encode(output, img, options); err != nil {
		return fmt.Errorf("failed to encode to WebP: %w", err)
	}

	return nil
}
