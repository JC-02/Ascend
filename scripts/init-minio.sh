#!/bin/bash
# ============================================
# MinIO Bucket Initialization Script
# ============================================
# This script creates the required S3 bucket in MinIO
# if it doesn't already exist.
#
# Usage: ./scripts/init-minio.sh
# ============================================

set -e  # Exit on error

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "Error: .env file not found"
    exit 1
fi

# Default values if not set in .env
MINIO_ENDPOINT=${S3_ENDPOINT_URL:-http://localhost:9000}
MINIO_ACCESS_KEY=${S3_ACCESS_KEY_ID:-minio_access_key}
MINIO_SECRET_KEY=${S3_SECRET_ACCESS_KEY:-minio_secret_key}
BUCKET_NAME=${S3_BUCKET_NAME:-ascend-resumes}

echo "============================================"
echo "MinIO Bucket Initialization"
echo "============================================"
echo "Endpoint: $MINIO_ENDPOINT"
echo "Bucket: $BUCKET_NAME"
echo ""

# Wait for MinIO to be ready
echo "Waiting for MinIO to be ready..."
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if curl -sf "$MINIO_ENDPOINT/minio/health/live" > /dev/null 2>&1; then
        echo "✓ MinIO is ready"
        break
    fi
    attempt=$((attempt + 1))
    echo "  Attempt $attempt/$max_attempts..."
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo "✗ Error: MinIO did not become ready in time"
    exit 1
fi

# Install mc (MinIO Client) if not already installed
if ! command -v mc &> /dev/null; then
    echo ""
    echo "Installing MinIO Client (mc)..."
    
    # Detect OS
    OS=$(uname -s)
    case "$OS" in
        Linux*)
            curl -o /tmp/mc https://dl.min.io/client/mc/release/linux-amd64/mc
            ;;
        Darwin*)
            curl -o /tmp/mc https://dl.min.io/client/mc/release/darwin-amd64/mc
            ;;
        *)
            echo "✗ Error: Unsupported OS: $OS"
            exit 1
            ;;
    esac
    
    chmod +x /tmp/mc
    MC_CMD="/tmp/mc"
    echo "✓ MinIO Client installed to /tmp/mc"
else
    MC_CMD="mc"
    echo "✓ MinIO Client already installed"
fi

# Configure MinIO alias
echo ""
echo "Configuring MinIO alias..."
$MC_CMD alias set local "$MINIO_ENDPOINT" "$MINIO_ACCESS_KEY" "$MINIO_SECRET_KEY" > /dev/null 2>&1
echo "✓ MinIO alias configured"

# Check if bucket exists
echo ""
echo "Checking if bucket '$BUCKET_NAME' exists..."
if $MC_CMD ls "local/$BUCKET_NAME" > /dev/null 2>&1; then
    echo "✓ Bucket '$BUCKET_NAME' already exists"
else
    echo "Creating bucket '$BUCKET_NAME'..."
    $MC_CMD mb "local/$BUCKET_NAME"
    echo "✓ Bucket '$BUCKET_NAME' created successfully"
fi

# Set bucket policy to private (default)
echo ""
echo "Setting bucket policy..."
$MC_CMD anonymous set none "local/$BUCKET_NAME" > /dev/null 2>&1
echo "✓ Bucket policy set to private"

echo ""
echo "============================================"
echo "✓ MinIO initialization complete!"
echo "============================================"
echo ""
echo "Bucket '$BUCKET_NAME' is ready for use."
echo "Access MinIO Console at: http://localhost:9001"
echo "  Username: $MINIO_ACCESS_KEY"
echo "  Password: $MINIO_SECRET_KEY"
echo ""
