# ============================================
# Ascend AI - Backend Dockerfile
# ============================================
# Multi-stage build for FastAPI application
# Follows CCS Section 8.6.4 container security
# ============================================

# ============================================
# Stage 1: Builder
# ============================================
FROM python:latest as builder

# Set working directory
WORKDIR /app

# Install system dependencies for building Python packages
RUN apt-get update && apt-get install -y \
    --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --user -r requirements.txt

# ============================================
# Stage 2: Runtime
# ============================================
FROM python:latest

# Set working directory
WORKDIR /app

# Install runtime dependencies only
RUN apt-get update && apt-get install -y \
    --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user per Directive 8.6.4
RUN groupadd --gid 1000 appuser && \
    useradd --uid 1000 --gid 1000 --create-home appuser

# Copy Python dependencies from builder
COPY --from=builder /root/.local /home/appuser/.local

# Make sure scripts in .local are usable
ENV PATH=/home/appuser/.local/bin:$PATH

# Copy application code
COPY --chown=appuser:appuser . .

# Set restrictive permissions on application code (read-only)
RUN chmod -R 555 /app

# Create writable directories for logs and temp files
RUN mkdir -p /app/logs /app/tmp && \
    chown -R appuser:appuser /app/logs /app/tmp && \
    chmod -R 755 /app/logs /app/tmp

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
# Note: This will be overridden by docker-compose for development
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
