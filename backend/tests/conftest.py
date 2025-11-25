# ============================================
# Ascend AI - Test Configuration & Fixtures
# ============================================
# Pytest configuration and shared fixtures
# Follows CCS Section 7.6 (Test Fixtures & Mocking)
# ============================================
import asyncio
import uuid
from collections.abc import AsyncGenerator, Generator
from datetime import datetime, timedelta

import pytest
from jose import jwt
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
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

@pytest.fixture(scope="session", autouse=True)
async def setup_test_database():
    """Set up test database with tables."""
    from app.db.session import engine
    from app.db.base import Base
    
    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    yield
    
    # Drop all tables after tests
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture(scope="function")
async def clear_rate_limits():
    """Clear rate limits before each test."""
    from app.core.cache import cache
    
    # Clear all rate limit keys
    await cache.clear_pattern("rate_limit:*")
    yield
    # Clear again after test
    await cache.clear_pattern("rate_limit:*")


@pytest.fixture(scope="function")
async def async_db_session(clear_rate_limits) -> AsyncGenerator[AsyncSession, None]:
    """
    Create a test database session.
    Each test gets a fresh session that's rolled back after the test.
    """
    from app.db.session import async_session_maker
    
    async with async_session_maker() as session:
        async with session.begin():
            yield session
            await session.rollback()


# ============================================
# User Fixtures
# ============================================
@pytest.fixture
def test_user_id() -> str:
    """Generate a unique user ID for each test."""
    return str(uuid.uuid4())


@pytest.fixture
async def test_user(async_db_session: AsyncSession, test_user_id: str) -> User:
    """Create a test user for authentication tests."""
    # Insert user using raw SQL
    await async_db_session.execute(
        text(
            """
            INSERT INTO users (id, email, name, avatar_url, oauth_provider, oauth_id, created_at, updated_at)
            VALUES (:id, :email, :name, :avatar_url, :oauth_provider, :oauth_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT (id) DO NOTHING
        """
        ),
        {
            "id": test_user_id,
            "email": f"test-{test_user_id}@example.com",
            "name": "Test User",
            "avatar_url": "https://example.com/avatar.jpg",
            "oauth_provider": "google",
            "oauth_id": f"oauth_{test_user_id}",
        },
    )
    await async_db_session.flush()
    
    # Fetch the user
    result = await async_db_session.execute(select(User).where(User.id == test_user_id))
    user = result.scalar_one()
    
    return user


@pytest.fixture
def test_user_data() -> dict:
    """Sample user data for testing."""
    return {
        "email": "test@example.com",
        "name": "Test User",
        "avatar_url": "https://example.com/avatar.jpg",
        "oauth_provider": "google",
        "oauth_id": "test_oauth_id",
    }


# ============================================
# JWT / Authentication Fixtures
# ============================================
@pytest.fixture
def valid_jwt_token(test_user_id: str) -> str:
    """Generate a valid JWT token for testing."""
    payload = {
        "sub": test_user_id,
        "exp": datetime.utcnow() + timedelta(hours=1),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, settings.nextauth_secret, algorithm="HS256")


@pytest.fixture
def expired_jwt_token(test_user_id: str) -> str:
    """Generate an expired JWT token for testing."""
    payload = {
        "sub": test_user_id,
        "exp": datetime.utcnow() - timedelta(hours=1),
        "iat": datetime.utcnow() - timedelta(hours=2),
    }
    return jwt.encode(payload, settings.nextauth_secret, algorithm="HS256")


@pytest.fixture
def invalid_jwt_token() -> str:
    """Generate an invalid JWT token (wrong secret)."""
    payload = {
        "sub": str(uuid.uuid4()),
        "exp": datetime.utcnow() + timedelta(hours=1),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, "wrong-secret", algorithm="HS256")


@pytest.fixture
def auth_headers(valid_jwt_token: str) -> dict:
    """Generate authentication headers with a valid token."""
    return {"Authorization": f"Bearer {valid_jwt_token}"}


@pytest.fixture
def malformed_jwt_token() -> str:
    """Generate a malformed JWT token."""
    return "not.a.valid.jwt.token"


# ============================================
# Mock LLM Fixtures (for future use)
# ============================================
@pytest.fixture
def mock_llm_response() -> dict:
    """Mock LLM API response."""
    return {
        "choices": [
            {
                "message": {
                    "content": "This is a mock response from the LLM.",
                    "role": "assistant",
                }
            }
        ]
    }


@pytest.fixture
def mock_whisper_response() -> dict:
    """Mock Whisper API response."""
    return {"text": "This is a mock transcription from Whisper."}
