package utils

import (
	"path/filepath"
	"strings"
)

// Removes potentially bad chars from file names
func SanitiseFilename(filename string) string {
	filename = filepath.Base(filename)
	replacer := strings.NewReplacer(
		"/", "_",
		"\\", "_",
		":", "_",
		"*", "_",
		"?", "_",
		"\"", "_",
		"<", "_",
		">", "_",
		"|", "_",
	)
	return replacer.Replace(filename)
}
