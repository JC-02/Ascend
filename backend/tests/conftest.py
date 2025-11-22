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
import redis.asyncio as aioredis
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

@pytest.fixture(scope="session", autouse=True)
async def setup_test_database():
    """
    Setup test database.

    NOTE: For the MVP, we're using the main database which already has
    tables created via Alembic migrations. This fixture is just a placeholder
    for future test database setup if needed.

    In production, you would:
    1. Create a separate test database
    2. Run migrations on it
    3. Clean up after tests
    """
    # Database schema is already created via Alembic migrations
    # No additional setup needed for MVP
    yield

    # Optionally, clean up test data after all tests complete
    # For now, we'll keep test data for debugging


@pytest.fixture(scope="function")
async def clear_rate_limits():
    """
    Clear rate limiting keys from Redis before each test.

    This prevents rate limiting from blocking test execution.
    Tests run in quick succession and would otherwise hit rate limits.

    Usage:
        async def test_auth(clear_rate_limits):
            # Rate limits are cleared before this test runs
            ...
    """
    redis_client = None
    try:
        redis_client = await aioredis.from_url(
            settings.redis_url,
            encoding="utf-8",
            decode_responses=True,
        )
        # Clear all rate limit keys
        keys = await redis_client.keys("rate_limit:*")
        if keys:
            await redis_client.delete(*keys)
        yield
    except Exception as e:
        # If Redis is unavailable, just skip clearing
        # Tests will still run, just with rate limiting applied
        yield
    finally:
        if redis_client:
            await redis_client.aclose()


@pytest.fixture(scope="function")
async def async_db_session(clear_rate_limits) -> AsyncGenerator[AsyncSession, None]:
    """
    Create an async database session for testing with automatic cleanup.

    This fixture creates a session with transaction rollback to ensure
    test isolation. Each test gets a clean database state.

    For Story 1.4 (Authentication), we only need:
    - User model to exist in database
    - No need for Recording, Feedback, or other models yet

    Usage:
        async def test_something(async_db_session: AsyncSession):
            user = User(...)
            async_db_session.add(user)
            await async_db_session.commit()
    """
    from app.db.session import AsyncSessionLocal
    from sqlalchemy import text

    async with AsyncSessionLocal() as session:
        # Start a transaction
        async with session.begin():
            try:
                yield session
                # Rollback the transaction after the test
                await session.rollback()
            except Exception:
                # Ensure rollback on error
                await session.rollback()
                raise
            finally:
                # Clean up any test users that might have been created
                try:
                    await session.execute(
                        text("DELETE FROM users WHERE email LIKE 'test-%@example.com'")
                    )
                    await session.commit()
                except Exception:
                    pass
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
            assert test_user.email.startswith("test-")
    """
    from sqlalchemy import text

    # Use unique email per test to avoid conflicts
    test_email = f"test-{test_user_id}@example.com"

    # Insert user directly with SQL to avoid relationship resolution
    await async_db_session.execute(
        text("""
            INSERT INTO users (id, email, name, avatar_url, oauth_provider, oauth_id, created_at, updated_at)
            VALUES (:id, :email, :name, :avatar_url, :provider, :oauth_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT (id) DO NOTHING
        """),
        {
            "id": test_user_id,
            "email": test_email,
            "name": "Test User",
            "avatar_url": "https://example.com/avatar.jpg",
            "provider": "google",
            "oauth_id": f"oauth_{test_user_id}",
        }
    )
    await async_db_session.commit()

    # Fetch the user using SQLAlchemy ORM without loading relationships
    # This avoids relationship resolution errors for models that don't exist yet
    from sqlalchemy import select
    from sqlalchemy.orm import selectinload

    # Query without loading any relationships to avoid "Recording" not found error
    result = await async_db_session.execute(
        select(User).where(User.id == test_user_id)
    )
    user = result.scalar_one_or_none()

    assert user is not None, f"Failed to create or retrieve test user with ID {test_user_id}"
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
