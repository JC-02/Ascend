.PHONY: up down build logs help

help:
	@echo "Ascend AI - Development Commands"
	@echo ""
	@echo "Available targets:"
	@echo "  make up      - Start all services"
	@echo "  make down    - Stop all services"
	@echo "  make build   - Build and start all services"
	@echo "  make logs    - View logs from all services"

up:
	docker-compose up -d

down:
	docker-compose down

build:
	docker-compose up --build -d

logs:
	docker-compose logs -f
