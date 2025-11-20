# ============================================
# Ascend AI - FastAPI Application
# ============================================
# Main application entry point
# Follows CCS specifications for FastAPI backend
# ============================================

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.core.config import settings


# ============================================
# Application Lifespan
# ============================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan context manager.
    Handles startup and shutdown events.
    """
    # Startup
    print("🚀 Starting Ascend AI Backend...")
    print(f"   Environment: {settings.environment}")
    print(f"   Debug Mode: {settings.debug}")
    print(f"   LLM Provider: {settings.llm_provider}")

    # Validate configuration on startup
    try:
        _ = settings.database_url
        print("✓ Configuration validated successfully")
    except ValidationError as e:
        print(f"❌ CRITICAL ERROR: Invalid configuration:\n{e}")
        raise

    yield

    # Shutdown
    print("👋 Shutting down Ascend AI Backend...")


# ============================================
# FastAPI Application Instance
# ============================================
app = FastAPI(
    title="Ascend AI API",
    description="Privacy-first AI career coaching platform",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ============================================
# CORS Middleware
# ============================================
# Configure CORS with explicit origins per Directive 8.6.1
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["Authorization", "Content-Type"],
    max_age=3600,
)


# ============================================
# Global Exception Handlers
# ============================================
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Handle Pydantic validation errors with user-friendly messages.
    Per Directive 9.8: Never show technical error messages to users.
    """
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Validation Error",
            "message": "The request data is invalid. Please check your input.",
            "details": exc.errors(),
        },
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler for all unhandled exceptions.
    Per Task 1.2.2 AC-4: Return standardized JSON error response.
    """
    # Log the error (in production, use proper logging)
    print(f"❌ Unhandled exception: {type(exc).__name__}: {str(exc)}")

    # Don't expose internal errors in production
    if settings.environment == "production":
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "Internal Server Error",
                "message": "An unexpected error occurred. Please try again later.",
            },
        )

    # In development, provide more details
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "message": str(exc),
            "type": type(exc).__name__,
        },
    )


# ============================================
# Health Check Endpoint
# ============================================
@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint for Docker health checks and monitoring.
    Returns 200 OK if the application is running.
    """
    return {
        "status": "healthy",
        "environment": settings.environment,
        "version": "0.1.0",
    }


# ============================================
# Root Endpoint
# ============================================
@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint with API information.
    """
    return {
        "message": "Welcome to Ascend AI API",
        "version": "0.1.0",
        "docs": "/docs",
        "health": "/health",
    }


# ============================================
# API Router Registration
# ============================================
# TODO: Register API routers here in future tasks
# from app.api.v1 import api_router
# app.include_router(api_router, prefix="/api/v1")
