# ============================================
# Ascend AI - Backend Core Configuration
# ============================================
# Pydantic Settings for environment variable management
# Follows CCS Section 8.3 (Secret Management)
# ============================================

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    All secrets MUST be loaded through this class per Directive 8.3.
    """

    # ============================================
    # Database Configuration
    # ============================================
    database_url: str = Field(..., validation_alias="DATABASE_URL")

    # ============================================
    # Redis Configuration
    # ============================================
    redis_url: str = Field(..., validation_alias="REDIS_URL")

    # ============================================
    # Authentication
    # ============================================
    nextauth_secret: str = Field(..., min_length=32, validation_alias="NEXTAUTH_SECRET")

    @field_validator("nextauth_secret")
    @classmethod
    def validate_nextauth_secret(cls, v: str) -> str:
        """Validate NEXTAUTH_SECRET is not using default value."""
        if len(v) < 32:
            raise ValueError("NEXTAUTH_SECRET must be at least 32 characters")
        if v == "your-secret-key-min-32-chars-CHANGE-THIS":
            raise ValueError(
                "NEXTAUTH_SECRET is using default value. "
                "Generate a secure secret with: openssl rand -base64 32"
            )
        return v

    # ============================================
    # MinIO / S3 Storage
    # ============================================
    s3_access_key_id: str = Field(..., validation_alias="S3_ACCESS_KEY_ID")
    s3_secret_access_key: str = Field(..., validation_alias="S3_SECRET_ACCESS_KEY")
    s3_endpoint_url: str = Field(..., validation_alias="S3_ENDPOINT_URL")
    s3_bucket_name: str = Field(..., validation_alias="S3_BUCKET_NAME")
    s3_region: str = Field(default="us-east-1", validation_alias="S3_REGION")

    # ============================================
    # LLM Provider Configuration
    # ============================================
    llm_provider: str = Field(default="local", validation_alias="LLM_PROVIDER")
    local_llm_api_base: str = Field(
        default="http://localhost:11434/v1", validation_alias="LOCAL_LLM_API_BASE"
    )
    local_llm_model: str = Field(default="llama3", validation_alias="LOCAL_LLM_MODEL")
    openai_api_key: str | None = Field(default=None, validation_alias="OPENAI_API_KEY")

    @field_validator("openai_api_key")
    @classmethod
    def validate_openai_api_key(cls, v: str | None) -> str | None:
        """Validate OpenAI API key format if provided."""
        if v and not v.startswith("sk-"):
            raise ValueError("Invalid OPENAI_API_KEY format (should start with 'sk-')")
        return v

    # ============================================
    # Whisper Transcription Service
    # ============================================
    whisper_service_url: str = Field(
        default="http://whisper-service:8080", validation_alias="WHISPER_SERVICE_URL"
    )
    whisper_model: str = Field(default="medium.en", validation_alias="WHISPER_MODEL")

    # ============================================
    # Celery Configuration
    # ============================================
    celery_broker_url: str = Field(..., validation_alias="CELERY_BROKER_URL")
    celery_result_backend: str = Field(..., validation_alias="CELERY_RESULT_BACKEND")

    # ============================================
    # CORS Configuration
    # ============================================
    cors_origins: list[str] = Field(
        default=["http://localhost:3000"], validation_alias="CORS_ORIGINS"
    )

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        """Parse comma-separated CORS origins from environment variable."""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    # ============================================
    # Application Settings
    # ============================================
    environment: str = Field(default="development", validation_alias="ENVIRONMENT")
    debug: bool = Field(default=True, validation_alias="DEBUG")
    log_level: str = Field(default="INFO", validation_alias="LOG_LEVEL")

    # ============================================
    # Pydantic Settings Configuration
    # ============================================
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


# ============================================
# Global Settings Instance
# ============================================
# This is the ONLY way to access configuration per Directive 8.3
settings = Settings()
