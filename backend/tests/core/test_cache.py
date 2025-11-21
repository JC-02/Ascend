# ============================================
# Ascend AI - Token Cache Tests
# ============================================
# Tests for Redis-based JWT token caching
# ============================================

import pytest
from unittest.mock import AsyncMock, patch
import json

from app.core.cache import TokenCache, token_cache


@pytest.mark.asyncio
async def test_token_cache_initialization():
    """Test that TokenCache initializes correctly."""
    cache = TokenCache()
    assert cache.redis_client is None
    assert cache._initialized is False


@pytest.mark.asyncio
async def test_get_user_from_cache_returns_none_when_no_redis():
    """Test that cache returns None when Redis is unavailable."""
    cache = TokenCache()
    cache._initialized = True
    cache.redis_client = None

    result = await cache.get_user_from_cache("fake-token")
    assert result is None


@pytest.mark.asyncio
async def test_cache_user_data_returns_false_when_no_redis():
    """Test that caching returns False when Redis is unavailable."""
    cache = TokenCache()
    cache._initialized = True
    cache.redis_client = None

    user_data = {"id": "123", "email": "test@example.com"}
    result = await cache.cache_user_data("fake-token", user_data)
    assert result is False


@pytest.mark.asyncio
async def test_cache_user_data_and_retrieval():
    """Test caching and retrieving user data."""
    cache = TokenCache()
    cache._initialized = True

    # Mock Redis client
    mock_redis = AsyncMock()
    mock_redis.ping = AsyncMock(return_value=True)
    mock_redis.setex = AsyncMock(return_value=True)

    user_data = {
        "id": "123",
        "email": "test@example.com",
        "name": "Test User"
    }

    # Mock get to return the cached data
    mock_redis.get = AsyncMock(return_value=json.dumps(user_data))

    cache.redis_client = mock_redis

    # Cache the data
    result = await cache.cache_user_data("fake-token", user_data, ttl_seconds=900)
    assert result is True

    # Retrieve the data
    cached_data = await cache.get_user_from_cache("fake-token")
    assert cached_data == user_data


@pytest.mark.asyncio
async def test_cache_returns_none_on_cache_miss():
    """Test that cache returns None when token is not cached."""
    cache = TokenCache()
    cache._initialized = True

    # Mock Redis client returning None (cache miss)
    mock_redis = AsyncMock()
    mock_redis.get = AsyncMock(return_value=None)
    cache.redis_client = mock_redis

    result = await cache.get_user_from_cache("unknown-token")
    assert result is None


@pytest.mark.asyncio
async def test_invalidate_token():
    """Test invalidating a cached token."""
    cache = TokenCache()
    cache._initialized = True

    # Mock Redis client
    mock_redis = AsyncMock()
    mock_redis.delete = AsyncMock(return_value=1)  # 1 key deleted
    cache.redis_client = mock_redis

    result = await cache.invalidate_token("fake-token")
    assert result is True

    # Test when key doesn't exist
    mock_redis.delete = AsyncMock(return_value=0)  # 0 keys deleted
    result = await cache.invalidate_token("unknown-token")
    assert result is False


@pytest.mark.asyncio
async def test_invalidate_user_tokens():
    """Test invalidating all tokens for a user."""
    cache = TokenCache()
    cache._initialized = True

    # Mock Redis client
    mock_redis = AsyncMock()

    # Mock scan_iter to return some keys
    async def mock_scan_iter(*args, **kwargs):
        keys = [
            "token_cache:user:123:token1",
            "token_cache:user:123:token2",
            "token_cache:user:123:token3"
        ]
        for key in keys:
            yield key

    mock_redis.scan_iter = mock_scan_iter
    mock_redis.delete = AsyncMock(return_value=3)  # 3 keys deleted

    cache.redis_client = mock_redis

    count = await cache.invalidate_user_tokens("123")
    assert count == 3


@pytest.mark.asyncio
async def test_invalidate_user_tokens_no_keys():
    """Test invalidating user tokens when no keys exist."""
    cache = TokenCache()
    cache._initialized = True

    # Mock Redis client with empty scan
    mock_redis = AsyncMock()

    async def mock_scan_iter(*args, **kwargs):
        return
        yield  # Make it a generator but yield nothing

    mock_redis.scan_iter = mock_scan_iter

    cache.redis_client = mock_redis

    count = await cache.invalidate_user_tokens("123")
    assert count == 0


def test_get_cache_key_is_consistent():
    """Test that cache key generation is consistent."""
    cache = TokenCache()

    token = "test-token-123"
    key1 = cache._get_cache_key(token)
    key2 = cache._get_cache_key(token)

    assert key1 == key2
    assert key1.startswith("token_cache:")


def test_get_cache_key_different_for_different_tokens():
    """Test that different tokens produce different cache keys."""
    cache = TokenCache()

    token1 = "test-token-123"
    token2 = "test-token-456"

    key1 = cache._get_cache_key(token1)
    key2 = cache._get_cache_key(token2)

    assert key1 != key2


@pytest.mark.asyncio
async def test_get_cache_stats_when_unavailable():
    """Test getting cache stats when Redis is unavailable."""
    cache = TokenCache()
    cache._initialized = True
    cache.redis_client = None

    stats = await cache.get_cache_stats()
    assert stats["status"] == "unavailable"


@pytest.mark.asyncio
async def test_get_cache_stats_when_available():
    """Test getting cache stats when Redis is available."""
    cache = TokenCache()
    cache._initialized = True

    # Mock Redis info response
    mock_redis = AsyncMock()
    mock_redis.info = AsyncMock(return_value={
        "keyspace_hits": 1000,
        "keyspace_misses": 100
    })
    cache.redis_client = mock_redis

    stats = await cache.get_cache_stats()

    assert stats["status"] == "available"
    assert stats["hits"] == 1000
    assert stats["misses"] == 100
    assert stats["total_requests"] == 1100
    # Hit rate should be 1000/1100 * 100 = 90.91%
    assert stats["hit_rate_percent"] == pytest.approx(90.91, rel=0.01)


@pytest.mark.asyncio
async def test_get_cache_stats_handles_zero_requests():
    """Test that cache stats handles zero requests correctly."""
    cache = TokenCache()
    cache._initialized = True

    # Mock Redis info with zero hits/misses
    mock_redis = AsyncMock()
    mock_redis.info = AsyncMock(return_value={
        "keyspace_hits": 0,
        "keyspace_misses": 0
    })
    cache.redis_client = mock_redis

    stats = await cache.get_cache_stats()

    assert stats["hit_rate_percent"] == 0


@pytest.mark.asyncio
async def test_cache_handles_serialization_error():
    """Test that cache handles JSON serialization errors gracefully."""
    cache = TokenCache()
    cache._initialized = True

    # Mock Redis client
    mock_redis = AsyncMock()
    mock_redis.setex = AsyncMock(side_effect=TypeError("Not JSON serializable"))
    cache.redis_client = mock_redis

    # Try to cache data with non-serializable object
    class NonSerializable:
        pass

    user_data = {"id": "123", "obj": NonSerializable()}

    result = await cache.cache_user_data("fake-token", user_data)
    assert result is False


@pytest.mark.asyncio
async def test_cache_handles_deserialization_error():
    """Test that cache handles JSON deserialization errors gracefully."""
    cache = TokenCache()
    cache._initialized = True

    # Mock Redis client returning invalid JSON
    mock_redis = AsyncMock()
    mock_redis.get = AsyncMock(return_value="not valid json {{{")
    cache.redis_client = mock_redis

    result = await cache.get_user_from_cache("fake-token")
    assert result is None


@pytest.mark.asyncio
async def test_ensure_connection_only_runs_once():
    """Test that Redis connection is only initialized once."""
    cache = TokenCache()

    with patch('app.core.cache.aioredis.from_url') as mock_from_url:
        mock_redis = AsyncMock()
        mock_redis.ping = AsyncMock(return_value=True)
        mock_from_url.return_value = mock_redis

        # Call twice
        await cache._ensure_connection()
        await cache._ensure_connection()

        # Should only be called once
        assert mock_from_url.call_count == 1
        assert cache._initialized is True
