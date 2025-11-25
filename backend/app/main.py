# ============================================
# Ascend AI - FastAPI Application Entry Point
# ============================================
# Main application configuration and setup
# Follows CCS API contract specification
# ============================================

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1 import auth, resumes, sessions, users
from app.core.config import settings
from app.middleware.logging import RequestLoggingMiddleware
from app.middleware.rate_limit import RateLimitMiddleware

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


# ============================================
# Application Lifespan
# ============================================
@asynccontextmanager
async def lifespan(_app: FastAPI):
    """
    Application lifespan context manager.
    Handles startup and shutdown events.
    """
    # Startup
    logger.info("🚀 Starting Ascend AI Backend...")
    logger.info(f"   Environment: {settings.environment}")
    logger.info(f"   Debug Mode: {settings.debug}")
    logger.info(f"   LLM Provider: {settings.llm_provider}")

    # Validate configuration on startup
    try:
        _ = settings.database_url
        logger.info("✓ Configuration validated successfully")
    except Exception as e:
        logger.error(f"❌ CRITICAL ERROR: Invalid configuration:\n{e}")
        raise

    yield

    # Shutdown
    logger.info("👋 Shutting down Ascend AI Backend...")


# ============================================
# FastAPI Application Instance
# ============================================
app = FastAPI(
    title="Ascend AI API",
    version="1.0.0",
    description="Privacy-First AI Career Coaching Platform",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ============================================
# Middleware Configuration
# ============================================
# Order matters! Middleware is executed in reverse order of addition.
# Last added = First executed

# 1. CORS (first to execute, allows cross-origin requests)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Request Logging (logs all requests/responses)
app.add_middleware(RequestLoggingMiddleware)

# 3. Rate Limiting (protects against abuse)
app.add_middleware(RateLimitMiddleware)


# ============================================
# Global Exception Handler
# ============================================
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler for unhandled errors.
    Returns standardized error response per CCS API contract.

    Args:
        request: The incoming request that caused the exception
        exc: The exception that was raised

    Returns:
        JSONResponse with 500 status and error details
    """
    logger.error(
        f"Unhandled exception on {request.method} {request.url.path}: {exc}", exc_info=True
    )

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error",
            "error_type": "InternalServerError",
            "path": str(request.url.path),
        },
    )


# ============================================
# Health Check Endpoint
# ============================================
@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint for Docker and monitoring.

    Returns basic system status without database connection check.
    Used by Docker Compose health checks and load balancers.

    Returns:
        dict: Status information including environment and version
    """
    return {
        "status": "healthy",
        "service": "ascend-api",
        "environment": settings.environment,
        "version": "1.0.0",
    }


# ============================================
# API Routes Registration
# ============================================
# Register all API v1 routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(resumes.router, prefix="/api/v1")
app.include_router(sessions.router, prefix="/api/v1")


# ============================================
# Root Endpoint
# ============================================
@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint - API information.

    Returns:
        dict: Basic API information and links
    """
    return {"message": "Ascend AI API", "version": "1.0.0", "docs": "/docs", "health": "/health"}
