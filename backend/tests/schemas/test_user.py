# ============================================
# Ascend AI - User Schema Tests
# ============================================
# Tests for user Pydantic schemas
# Story 1.4, Task 1.4.1
# ============================================

import pytest
from datetime import datetime
import uuid
from pydantic import ValidationError

from app.schemas import UserBase, UserCreate, UserResponse, TokenPayload


class TestUserBase:
    """Test suite for UserBase schema."""

    def test_user_base_valid(self):
        """Test UserBase with valid data."""
        user = UserBase(
            email="test@example.com",
            name="Test User",
            avatar_url="https://example.com/avatar.jpg"
        )
        assert user.email == "test@example.com"
        assert user.name == "Test User"
        assert str(user.avatar_url) == "https://example.com/avatar.jpg"

    def test_user_base_valid_without_optional_fields(self):
        """Test UserBase with only required fields."""
        user = UserBase(email="test@example.com")
        assert user.email == "test@example.com"
        assert user.name is None
        assert user.avatar_url is None

    def test_user_base_invalid_email(self):
        """Test UserBase with invalid email."""
        with pytest.raises(ValidationError):
            UserBase(email="invalid-email")

    def test_user_base_invalid_avatar_url(self):
        """Test UserBase with invalid avatar URL."""
        with pytest.raises(ValidationError):
            UserBase(
                email="test@example.com",
                avatar_url="not-a-valid-url"
            )


class TestUserCreate:
    """Test suite for UserCreate schema."""

    def test_user_create_valid(self):
        """Test UserCreate with valid data."""
        user = UserCreate(
            email="test@example.com",
            name="Test User",
            avatar_url="https://example.com/avatar.jpg",
            oauth_provider="google",
            oauth_id="123456"
        )
        assert user.email == "test@example.com"
        assert user.oauth_provider == "google"
        assert user.oauth_id == "123456"

    def test_user_create_missing_required_fields(self):
        """Test UserCreate without required OAuth fields."""
        with pytest.raises(ValidationError):
            UserCreate(email="test@example.com")

    def test_user_create_invalid_oauth_provider(self):
        """Test UserCreate with invalid OAuth provider (not google/github)."""
        with pytest.raises(ValidationError):
            UserCreate(
                email="test@example.com",
                oauth_provider="facebook",  # Only 'google' or 'github' allowed
                oauth_id="123456"
            )

    def test_user_create_valid_github_provider(self):
        """Test UserCreate with GitHub provider."""
        user = UserCreate(
            email="test@example.com",
            name="GitHub User",
            oauth_provider="github",
            oauth_id="gh123456"
        )
        assert user.oauth_provider == "github"


class TestUserResponse:
    """Test suite for UserResponse schema."""

    def test_user_response_valid(self):
        """Test UserResponse with valid data."""
        user_id = str(uuid.uuid4())
        now = datetime.now()

        user = UserResponse(
            id=user_id,
            email="test@example.com",
            name="Test User",
            avatar_url="https://example.com/avatar.jpg",
            oauth_provider="google",
            created_at=now,
            updated_at=now
        )

        assert user.id == user_id
        assert user.email == "test@example.com"
        assert user.oauth_provider == "google"
        assert user.created_at == now
        assert user.updated_at == now

    def test_user_response_from_dict(self):
        """Test UserResponse can be created from dict (ORM simulation)."""
        user_data = {
            "id": str(uuid.uuid4()),
            "email": "test@example.com",
            "name": "Test User",
            "avatar_url": "https://example.com/avatar.jpg",
            "oauth_provider": "github",
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }

        user = UserResponse(**user_data)
        assert user.email == user_data["email"]
        assert user.oauth_provider == "github"


class TestTokenPayload:
    """Test suite for TokenPayload schema."""

    def test_token_payload_valid(self):
        """Test TokenPayload with valid data."""
        user_id = str(uuid.uuid4())
        current_time = int(datetime.now().timestamp())

        token = TokenPayload(
            sub=user_id,
            exp=current_time + 3600,
            iat=current_time
        )

        assert token.sub == user_id
        assert token.exp == current_time + 3600
        assert token.iat == current_time

    def test_token_payload_missing_fields(self):
        """Test TokenPayload without required fields."""
        with pytest.raises(ValidationError):
            TokenPayload(sub=str(uuid.uuid4()))


class TestSchemaIntegration:
    """Test schema integration with ORM models."""

    def test_orm_to_response_conversion(self):
        """Test converting ORM-like object to UserResponse."""
        # Simulate ORM object with attributes
        class MockUser:
            def __init__(self):
                self.id = str(uuid.uuid4())
                self.email = "test@example.com"
                self.name = "Test User"
                self.avatar_url = "https://example.com/avatar.jpg"
                self.oauth_provider = "google"
                self.oauth_id = "123456"
                self.created_at = datetime.now()
                self.updated_at = datetime.now()

        mock_user = MockUser()
        user_response = UserResponse.model_validate(mock_user)

        assert user_response.id == mock_user.id
        assert user_response.email == mock_user.email
        assert user_response.name == mock_user.name
        assert user_response.oauth_provider == mock_user.oauth_provider
