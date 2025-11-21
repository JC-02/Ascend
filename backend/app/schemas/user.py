# ============================================
# Ascend AI - User Pydantic Schemas
# ============================================
# Data Transfer Objects for User-related API operations
# Follows PYDANTIC_SCHEMAS_SPECIFICATION from CCS
# ============================================

from datetime import datetime
from typing import Literal, Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field, ConfigDict, HttpUrl, field_serializer


class UserBase(BaseModel):
    """
    Base schema with common user fields.
    Used as a base for other user schemas.
    """
    email: EmailStr = Field(..., description="User's email address")
    name: Optional[str] = Field(None, description="User's display name", max_length=255)
    avatar_url: Optional[HttpUrl] = Field(None, description="URL to user's profile picture")


class UserCreate(UserBase):
    """
    Schema for creating a new user.
    Used during OAuth callback when a new user signs up.
    """
    oauth_provider: Literal["google", "github"] = Field(..., description="OAuth provider (google or github)")
    oauth_id: str = Field(..., description="Provider-specific user ID", max_length=255)

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": "user@example.com",
                "name": "John Doe",
                "avatar_url": "https://example.com/avatar.jpg",
                "oauth_provider": "google",
                "oauth_id": "1234567890"
            }
        }
    )


class UserResponse(UserBase):
    """
    Schema for returning user data to the client.
    Includes the UUID and timestamps.
    """
    id: UUID | str = Field(..., description="User's unique UUID")
    oauth_provider: Literal["google", "github"] = Field(..., description="OAuth provider (google or github)")
    created_at: datetime = Field(..., description="Timestamp when user was created")
    updated_at: datetime = Field(..., description="Timestamp when user was last updated")

    @field_serializer('id')
    def serialize_id(self, value: UUID | str) -> str:
        """Convert UUID to string for JSON serialization."""
        return str(value)

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "email": "user@example.com",
                "name": "John Doe",
                "avatar_url": "https://example.com/avatar.jpg",
                "oauth_provider": "google",
                "created_at": "2025-11-20T15:30:00Z",
                "updated_at": "2025-11-20T15:30:00Z"
            }
        }
    )


class TokenPayload(BaseModel):
    """
    Schema for JWT token payload.
    Used for encoding/decoding JWT tokens.
    """
    sub: str = Field(..., description="Subject - User ID (UUID)")
    exp: int = Field(..., description="Expiration timestamp")
    iat: int = Field(..., description="Issued at timestamp")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "sub": "550e8400-e29b-41d4-a716-446655440000",
                "exp": 1700000000,
                "iat": 1699990000
            }
        }
    )
