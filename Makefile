.PHONY: up down build logs init-minio migrate migrate-create migrate-down help test-services

help:
	@echo "Ascend AI - Development Commands"
	@echo ""
	@echo "Available targets:"
	@echo "  make up            - Start all services"
	@echo "  make down          - Stop all services"
	@echo "  make build         - Build and start all services"
	@echo "  make logs          - View logs from all services"
	@echo "  make init-minio    - Initialize MinIO bucket (run after first 'make up')"
	@echo "  make test-services - Test infrastructure services"
	@echo "  make migrate       - Run database migrations"
	@echo "  make migrate-create MSG=\"description\" - Create new migration"
	@echo "  make migrate-down  - Rollback last migration"

up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose up --build -d

logs:
	docker compose logs -f

init-minio:
	@echo "Initializing MinIO bucket..."
	@docker run --rm --network ascend_ascend-network \
		-e MINIO_ROOT_USER=minio_access_key \
		-e MINIO_ROOT_PASSWORD=minio_secret_key \
		minio/mc \
		sh -c "mc alias set myminio http://minio:9000 minio_access_key minio_secret_key && \
			   mc mb myminio/ascend-resumes --ignore-existing && \
			   mc anonymous set none myminio/ascend-resumes && \
			   echo 'MinIO bucket initialized successfully!'"

test-services:
	@echo "Testing PostgreSQL..."
	@docker compose exec postgres pg_isready -U postgres || echo "PostgreSQL not ready"
	@echo ""
	@echo "Testing Redis..."
	@docker compose exec redis redis-cli ping || echo "Redis not ready"
	@echo ""
	@echo "Testing MinIO..."
	@curl -s http://localhost:9000/minio/health/live || echo "MinIO not ready"
	@echo ""

migrate:
	@echo "Running database migrations..."
	docker compose exec backend alembic upgrade head

migrate-create:
	@echo "Creating new migration: $(MSG)"
	docker compose exec backend alembic revision --autogenerate -m "$(MSG)"

migrate-down:
	@echo "Rolling back last migration..."
	docker compose exec backend alembic downgrade -1
