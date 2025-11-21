# ============================================
# Ascend AI - Test Configuration & Fixtures
# ============================================
# Pytest configuration and shared fixtures
# Follows CCS Section 7.6 (Test Fixtures & Mocking)
# ============================================

import asyncio
import uuid
from datetime import datetime, timedelta
from typing import AsyncGenerator, Generator

import pytest
from jose import jwt
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings
from app.db.base import Base
from app.db.models.user import User

# ============================================
# Pytest Configuration
# ============================================
pytest_plugins = []


@pytest.fixture(scope="session")
def event_loop() -> Generator:
    """
    Create an event loop for the test session.
    Required for async tests.
    """
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


# ============================================
# Database Fixtures
# ============================================
# NOTE: Using a simpler approach for tests that don't require full DB setup
# For Task 1.4.2, we're testing authentication logic which needs User model
# but doesn't require relationships to work (Recording, Resume, etc.)

@pytest.fixture(scope="function")
async def async_db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Create an async database session for testing.

    SIMPLIFIED VERSION: This fixture creates a minimal session for testing
    authentication logic without requiring all models to be complete.

    For Story 1.4 (Authentication), we only need:
    - User model to exist in database
    - No need for Recording, Feedback, or other models yet

    Usage:
        async def test_something(async_db_session: AsyncSession):
            user = User(...)
            async_db_session.add(user)
            await async_db_session.commit()
    """
    # Import only the models we need for this test
    # This avoids relationship resolution errors for models that don't exist yet
    from app.db.session import AsyncSessionLocal

    async with AsyncSessionLocal() as session:
        try:
            yield session
            # Note: Not rolling back so we can verify data persistence
            # Each test should clean up its own data or use unique IDs
        finally:
            await session.close()


# ============================================
# User Fixtures
# ============================================
@pytest.fixture
def test_user_id() -> str:
    """Generate a test user ID (UUID)."""
    return str(uuid.uuid4())


@pytest.fixture
async def test_user(async_db_session: AsyncSession, test_user_id: str) -> User:
    """
    Create and persist a test user in the database.

    Returns a User ORM object that can be used in tests.
    Per CCS Section 7.6, this is a reusable fixture for user-related tests.

    NOTE: Using text SQL to avoid triggering relationship resolution errors
    for models that don't exist yet (Recording, Feedback, etc.)

    Usage:
        async def test_user_endpoint(test_user: User):
            assert test_user.email == "test@example.com"
    """
    from sqlalchemy import text

    # Insert user directly with SQL to avoid relationship resolution
    await async_db_session.execute(
        text("""
            INSERT INTO users (id, email, name, avatar_url, oauth_provider, oauth_id, created_at, updated_at)
            VALUES (:id, :email, :name, :avatar_url, :provider, :oauth_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT (id) DO NOTHING
        """),
        {
            "id": test_user_id,
            "email": "test@example.com",
            "name": "Test User",
            "avatar_url": "https://example.com/avatar.jpg",
            "provider": "google",
            "oauth_id": "test_oauth_123",
        }
    )
    await async_db_session.commit()

    # Fetch the user using SQLAlchemy ORM
    user = await async_db_session.get(User, test_user_id)
    return user


@pytest.fixture
def test_user_data() -> dict:
    """
    Mock user data for testing (without database persistence).

    Returns a dictionary with user attributes that can be used
    to create User objects or test serialization.
    """
    return {
        "id": str(uuid.uuid4()),
        "email": "test@example.com",
        "name": "Test User",
        "avatar_url": "https://example.com/avatar.jpg",
        "oauth_provider": "google",
        "oauth_id": "test_oauth_123",
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
    }


# ============================================
# JWT / Authentication Fixtures
# ============================================
@pytest.fixture
def valid_jwt_token(test_user_id: str) -> str:
    """
    Generate a valid JWT token for testing authentication.

    Creates a JWT token signed with NEXTAUTH_SECRET that contains
    the test user's ID in the "sub" claim.

    Per CCS Section 7.6, this fixture enables testing of protected endpoints.

    Usage:
        def test_protected_endpoint(valid_jwt_token: str):
            headers = {"Authorization": f"Bearer {valid_jwt_token}"}
            response = client.get("/api/v1/protected", headers=headers)
            assert response.status_code == 200
    """
    payload = {
        "sub": test_user_id,  # User ID in subject claim
        "exp": datetime.utcnow() + timedelta(hours=1),  # Expires in 1 hour
        "iat": datetime.utcnow(),  # Issued now
    }
    token = jwt.encode(payload, settings.nextauth_secret, algorithm="HS256")
    return token


@pytest.fixture
def expired_jwt_token(test_user_id: str) -> str:
    """
    Generate an expired JWT token for testing error handling.

    Creates a JWT token that has already expired, useful for testing
    401 responses when tokens are no longer valid.

    Usage:
        def test_expired_token(expired_jwt_token: str):
            headers = {"Authorization": f"Bearer {expired_jwt_token}"}
            response = client.get("/api/v1/protected", headers=headers)
            assert response.status_code == 401
    """
    payload = {
        "sub": test_user_id,
        "exp": datetime.utcnow() - timedelta(hours=1),  # Expired 1 hour ago
        "iat": datetime.utcnow() - timedelta(hours=2),  # Issued 2 hours ago
    }
    token = jwt.encode(payload, settings.nextauth_secret, algorithm="HS256")
    return token


@pytest.fixture
def invalid_jwt_token() -> str:
    """
    Generate an invalid JWT token (wrong signature) for testing.

    Creates a JWT token signed with a different secret, which will
    fail signature verification.

    Usage:
        def test_invalid_token(invalid_jwt_token: str):
            headers = {"Authorization": f"Bearer {invalid_jwt_token}"}
            response = client.get("/api/v1/protected", headers=headers)
            assert response.status_code == 401
    """
    payload = {
        "sub": str(uuid.uuid4()),
        "exp": datetime.utcnow() + timedelta(hours=1),
        "iat": datetime.utcnow(),
    }
    # Sign with WRONG secret to simulate tampered token
    token = jwt.encode(payload, "wrong-secret-key-for-testing", algorithm="HS256")
    return token


@pytest.fixture
def auth_headers(valid_jwt_token: str) -> dict:
    """
    Generate HTTP headers with a valid Bearer token.

    Convenience fixture that creates properly formatted Authorization headers
    for authenticated API requests.

    Usage:
        def test_with_auth(auth_headers: dict):
            response = client.get("/api/v1/protected", headers=auth_headers)
            assert response.status_code == 200
    """
    return {"Authorization": f"Bearer {valid_jwt_token}"}


@pytest.fixture
def malformed_jwt_token() -> str:
    """
    Generate a malformed JWT token for testing error handling.

    Returns a string that looks like a token but is not valid JWT format.
    """
    return "this.is.not.a.valid.jwt.token"


# ============================================
# Mock LLM Fixtures (for future use)
# ============================================
@pytest.fixture
def mock_llm_response() -> dict:
    """
    Mock LLM API response for testing AI-related features.

    Per CCS Section 7.6, this fixture will be used in future tests
    for agent and LLM provider functionality.
    """
    return {
        "choices": [
            {
                "message": {
                    "role": "assistant",
                    "content": "This is a mock LLM response for testing.",
                }
            }
        ]
    }


@pytest.fixture
def mock_whisper_response() -> dict:
    """
    Mock Whisper transcription response for testing.

    Per CCS Section 7.6, this fixture will be used in future tests
    for audio transcription functionality.
    """
    return {
        "text": "This is a mock transcription of the audio.",
        "language": "en",
    }
