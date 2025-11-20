# Ascend AI - Development Helper Script for Windows

param(
    [Parameter(Position=0)]
    [ValidateSet('up', 'down', 'build', 'logs', 'init-minio', 'test-services', 'migrate', 'migrate-create', 'migrate-down', 'help')]
    [string]$Command = 'help',
    
    [Parameter(Position=1)]
    [string]$Service = '',
    
    [string]$Msg = ''
)

function Show-Help {
    Write-Host "Ascend AI - Development Commands" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Available commands:" -ForegroundColor Yellow
    Write-Host "  .\dev.ps1 up              - Start all services"
    Write-Host "  .\dev.ps1 down            - Stop all services"
    Write-Host "  .\dev.ps1 build           - Build and start all services"
    Write-Host "  .\dev.ps1 logs [service]  - View logs from all services or specific service"
    Write-Host "  .\dev.ps1 init-minio      - Initialize MinIO bucket"
    Write-Host "  .\dev.ps1 test-services   - Test infrastructure services"
    Write-Host "  .\dev.ps1 migrate         - Run database migrations"
    Write-Host "  .\dev.ps1 migrate-create -Msg 'description' - Create new migration"
    Write-Host "  .\dev.ps1 migrate-down    - Rollback last migration"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  .\dev.ps1 build"
    Write-Host "  .\dev.ps1 logs backend"
    Write-Host "  .\dev.ps1 migrate-create -Msg 'Add user table'"
}

function Start-Services {
    Write-Host "Starting all services..." -ForegroundColor Cyan
    docker-compose up -d
}

function Stop-Services {
    Write-Host "Stopping all services..." -ForegroundColor Cyan
    docker-compose down
}

function Build-Services {
    Write-Host "Building and starting all services..." -ForegroundColor Cyan
    docker-compose up --build -d
    Write-Host ""
    Write-Host "Waiting for services to be healthy..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    docker-compose ps
}

function Show-Logs {
    if ($Service) {
        Write-Host "Showing logs for: $Service" -ForegroundColor Cyan
        docker-compose logs -f $Service
    } else {
        Write-Host "Showing logs for all services..." -ForegroundColor Cyan
        docker-compose logs -f
    }
}

function Initialize-MinIO {
    Write-Host "Initializing MinIO bucket..." -ForegroundColor Cyan
    
    Write-Host "Step 1: Setting MinIO alias..." -ForegroundColor Yellow
    docker run --rm --network ascend_ascend-network `
        minio/mc alias set myminio http://minio:9000 minio_access_key minio_secret_key
    
    Write-Host "Step 2: Creating bucket..." -ForegroundColor Yellow
    docker run --rm --network ascend_ascend-network `
        minio/mc mb myminio/ascend-resumes --ignore-existing
    
    Write-Host "Step 3: Setting bucket policy..." -ForegroundColor Yellow
    docker run --rm --network ascend_ascend-network `
        minio/mc anonymous set none myminio/ascend-resumes
    
    Write-Host ""
    Write-Host "MinIO bucket initialized successfully!" -ForegroundColor Green
}

function Test-Services {
    Write-Host "Testing Infrastructure Services" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "Testing PostgreSQL..." -ForegroundColor Cyan
    try {
        $pgResult = docker-compose exec -T postgres pg_isready -U postgres 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ PostgreSQL is ready" -ForegroundColor Green
        } else {
            Write-Host "✗ PostgreSQL is not ready" -ForegroundColor Red
        }
    } catch {
        Write-Host "✗ PostgreSQL test failed: $_" -ForegroundColor Red
    }
    Write-Host ""
    
    Write-Host "Testing Redis..." -ForegroundColor Cyan
    try {
        $redisResult = docker-compose exec -T redis redis-cli ping 2>&1
        if ($redisResult -match "PONG") {
            Write-Host "✓ Redis is ready" -ForegroundColor Green
        } else {
            Write-Host "✗ Redis is not ready" -ForegroundColor Red
        }
    } catch {
        Write-Host "✗ Redis test failed: $_" -ForegroundColor Red
    }
    Write-Host ""
    
    Write-Host "Testing MinIO..." -ForegroundColor Cyan
    try {
        $response = Invoke-WebRequest -Uri http://localhost:9000/minio/health/live -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
        Write-Host "✓ MinIO is healthy" -ForegroundColor Green
    } catch {
        Write-Host "✗ MinIO is not responding" -ForegroundColor Red
    }
    Write-Host ""
    
    Write-Host "Testing Backend API..." -ForegroundColor Cyan
    try {
        $response = Invoke-WebRequest -Uri http://localhost:8000/health -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
        Write-Host "✓ Backend is healthy" -ForegroundColor Green
        $content = $response.Content | ConvertFrom-Json
        Write-Host "  Status: $($content.status)" -ForegroundColor Gray
        Write-Host "  Environment: $($content.environment)" -ForegroundColor Gray
    } catch {
        Write-Host "✗ Backend is not responding" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
    
    Write-Host "================================" -ForegroundColor Cyan
}

function Run-Migration {
    Write-Host "Running database migrations..." -ForegroundColor Cyan
    docker-compose exec backend alembic upgrade head
}

function Create-Migration {
    if (-not $Msg) {
        Write-Host "Error: Migration message is required" -ForegroundColor Red
        Write-Host "Usage: .\dev.ps1 migrate-create -Msg 'description'" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "Creating new migration: $Msg" -ForegroundColor Cyan
    docker-compose exec backend alembic revision --autogenerate -m "$Msg"
}

function Rollback-Migration {
    Write-Host "Rolling back last migration..." -ForegroundColor Cyan
    docker-compose exec backend alembic downgrade -1
}

# Main switch
switch ($Command) {
    'up' { Start-Services }
    'down' { Stop-Services }
    'build' { Build-Services }
    'logs' { Show-Logs }
    'init-minio' { Initialize-MinIO }
    'test-services' { Test-Services }
    'migrate' { Run-Migration }
    'migrate-create' { Create-Migration }
    'migrate-down' { Rollback-Migration }
    'help' { Show-Help }
    default { Show-Help }
}