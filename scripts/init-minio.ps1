# ============================================
# MinIO Bucket Initialization Script (PowerShell)
# ============================================
# This script creates the required S3 bucket in MinIO
# if it doesn't already exist.
#
# Usage: .\scripts\init-minio.ps1
# ============================================

$ErrorActionPreference = "Stop"

# Load environment variables from .env file
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            Set-Item -Path "env:$name" -Value $value
        }
    }
} else {
    Write-Error ".env file not found"
    exit 1
}

# Default values if not set in .env
$MINIO_ENDPOINT = if ($env:S3_ENDPOINT_URL) { $env:S3_ENDPOINT_URL } else { "http://localhost:9000" }
$MINIO_ACCESS_KEY = if ($env:S3_ACCESS_KEY_ID) { $env:S3_ACCESS_KEY_ID } else { "minio_access_key" }
$MINIO_SECRET_KEY = if ($env:S3_SECRET_ACCESS_KEY) { $env:S3_SECRET_ACCESS_KEY } else { "minio_secret_key" }
$BUCKET_NAME = if ($env:S3_BUCKET_NAME) { $env:S3_BUCKET_NAME } else { "ascend-resumes" }

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "MinIO Bucket Initialization" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Endpoint: $MINIO_ENDPOINT"
Write-Host "Bucket: $BUCKET_NAME"
Write-Host ""

# Wait for MinIO to be ready
Write-Host "Waiting for MinIO to be ready..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0

while ($attempt -lt $maxAttempts) {
    try {
        $response = Invoke-WebRequest -Uri "$MINIO_ENDPOINT/minio/health/live" -Method Get -TimeoutSec 2 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "✓ MinIO is ready" -ForegroundColor Green
            break
        }
    } catch {
        # MinIO not ready yet
    }
    
    $attempt++
    Write-Host "  Attempt $attempt/$maxAttempts..."
    Start-Sleep -Seconds 2
}

if ($attempt -eq $maxAttempts) {
    Write-Error "MinIO did not become ready in time"
    exit 1
}

# Check if mc (MinIO Client) is installed
$mcPath = "mc.exe"
if (-not (Get-Command mc -ErrorAction SilentlyContinue)) {
    Write-Host ""
    Write-Host "Installing MinIO Client (mc)..." -ForegroundColor Yellow
    
    $mcUrl = "https://dl.min.io/client/mc/release/windows-amd64/mc.exe"
    $mcPath = "$env:TEMP\mc.exe"
    
    Invoke-WebRequest -Uri $mcUrl -OutFile $mcPath
    Write-Host "✓ MinIO Client downloaded to $mcPath" -ForegroundColor Green
} else {
    Write-Host "✓ MinIO Client already installed" -ForegroundColor Green
}

# Configure MinIO alias
Write-Host ""
Write-Host "Configuring MinIO alias..." -ForegroundColor Yellow
& $mcPath alias set local $MINIO_ENDPOINT $MINIO_ACCESS_KEY $MINIO_SECRET_KEY 2>&1 | Out-Null
Write-Host "✓ MinIO alias configured" -ForegroundColor Green

# Check if bucket exists
Write-Host ""
Write-Host "Checking if bucket '$BUCKET_NAME' exists..." -ForegroundColor Yellow
try {
    & $mcPath ls "local/$BUCKET_NAME" 2>&1 | Out-Null
    Write-Host "✓ Bucket '$BUCKET_NAME' already exists" -ForegroundColor Green
} catch {
    Write-Host "Creating bucket '$BUCKET_NAME'..." -ForegroundColor Yellow
    & $mcPath mb "local/$BUCKET_NAME"
    Write-Host "✓ Bucket '$BUCKET_NAME' created successfully" -ForegroundColor Green
}

# Set bucket policy to private (default)
Write-Host ""
Write-Host "Setting bucket policy..." -ForegroundColor Yellow
& $mcPath anonymous set none "local/$BUCKET_NAME" 2>&1 | Out-Null
Write-Host "✓ Bucket policy set to private" -ForegroundColor Green

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "✓ MinIO initialization complete!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Bucket '$BUCKET_NAME' is ready for use."
Write-Host "Access MinIO Console at: http://localhost:9001"
Write-Host "  Username: $MINIO_ACCESS_KEY"
Write-Host "  Password: $MINIO_SECRET_KEY"
Write-Host ""
