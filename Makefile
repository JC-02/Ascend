.PHONY: up down build logs init-minio help

help:
	@echo "Ascend AI - Development Commands"
	@echo ""
	@echo "Available targets:"
	@echo "  make up         - Start all services"
	@echo "  make down       - Stop all services"
	@echo "  make build      - Build and start all services"
	@echo "  make logs       - View logs from all services"
	@echo "  make init-minio - Initialize MinIO bucket (run after first 'make up')"

up:
	docker-compose up -d

down:
	docker-compose down

build:
	docker-compose up --build -d

logs:
	docker-compose logs -f

init-minio:
	@echo "Initializing MinIO bucket..."
	@if command -v bash >/dev/null 2>&1; then \
		bash scripts/init-minio.sh; \
	else \
		powershell -ExecutionPolicy Bypass -File scripts/init-minio.ps1; \
	fi
