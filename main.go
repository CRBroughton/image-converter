package main

import (
	"log"
	"net/http"
	"time"

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
