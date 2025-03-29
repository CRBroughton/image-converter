FROM golang:1.22

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libwebp-dev \
    libwebp7 \
    libaom-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY go.mod go.sum ./
RUN go mod tidy

RUN go get github.com/Kagami/go-avif
RUN go get github.com/gorilla/mux
RUN go get github.com/kolesa-team/go-webp/encoder
RUN go get github.com/kolesa-team/go-webp/webp
RUN go get github.com/rs/cors

COPY *.go ./

RUN go build -o image-converter .

EXPOSE 8080

CMD ["./image-converter"]