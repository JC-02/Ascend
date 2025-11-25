# ============================================
# Ascend AI - Rate Limiting Middleware
# ============================================
# Redis-based rate limiting to prevent abuse and brute force attacks
# Follows CCS security requirements
# ============================================

import logging
import time
from collections.abc import Callable

import redis.asyncio as aioredis
from fastapi import HTTPException, Request, Response, status
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import settings

logger = logging.getLogger(__name__)


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Redis-based rate limiting middleware.

    Features:
    - Configurable rate limits per endpoint pattern
    - IP-based rate limiting
    - Authentication endpoint protection (prevents brute force)
    - Sliding window rate limiting using Redis
    - Automatic cleanup of expired entries

    Rate Limits:
    - Authentication endpoints: 5 requests per minute
    - General API endpoints: 60 requests per minute
    - Health check: Unlimited

    Security Notes:
    - Protects against brute force authentication attacks
    - Prevents API abuse and DoS attempts
    - Uses Redis for distributed rate limiting across multiple instances
    """

    def __init__(self, app):
        """
        Initialize rate limiting middleware.

        Args:
            app: FastAPI application instance
        """
        super().__init__(app)
        self.redis_client: aioredis.Redis | None = None
        self._initialized = False

    async def _ensure_redis_connection(self):
        """
        Ensure Redis connection is established.
        Lazy initialization to avoid blocking app startup.
        """
        if not self._initialized:
            try:
                self.redis_client = aioredis.from_url(
                    settings.redis_url,
                    encoding="utf-8",
                    decode_responses=True,
                    socket_connect_timeout=5,
                    socket_timeout=5,
                )
                # Test connection
                await self.redis_client.ping()
                self._initialized = True
                logger.info("✓ Rate limiting initialized with Redis connection")
            except Exception as e:
                logger.error(f"❌ Failed to connect to Redis for rate limiting: {e}")
                self.redis_client = None
                self._initialized = True  # Mark as initialized to avoid retrying every request

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Apply rate limiting to incoming requests.

        Args:
            request: Incoming HTTP request
            call_next: Next middleware/endpoint in the chain

        Returns:
            Response: HTTP response or 429 Too Many Requests

        Raises:
            HTTPException: 429 if rate limit exceeded
        """
        # Ensure Redis connection
        await self._ensure_redis_connection()

        # Skip rate limiting if Redis is unavailable (fail open for availability)
        if not self.redis_client:
            logger.warning("Rate limiting disabled - Redis unavailable")
            return await call_next(request)

        # Get request metadata
        path = request.url.path
        method = request.method
        client_ip = self._get_client_ip(request)

        # Skip rate limiting for health checks
        if path in ["/health", "/", "/docs", "/redoc", "/openapi.json"]:
            return await call_next(request)

        # Determine rate limit based on endpoint
        limit, window = self._get_rate_limit(path, method)

        # Check rate limit
        try:
            allowed = await self._check_rate_limit(
                client_ip=client_ip, endpoint=f"{method}:{path}", limit=limit, window=window
            )

            if not allowed:
                # Log rate limit violation
                logger.warning(
                    f"[SECURITY] Rate limit exceeded - "
                    f"Client: {client_ip} - "
                    f"Endpoint: {method} {path} - "
                    f"Limit: {limit}/{window}s"
                )

                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Rate limit exceeded. Maximum {limit} requests per {window} seconds.",
                    headers={
                        "Retry-After": str(window),
                        "X-RateLimit-Limit": str(limit),
                        "X-RateLimit-Window": str(window),
                    },
                )

            # Process request
            response = await call_next(request)

            # Add rate limit headers to response
            remaining = await self._get_remaining_requests(
                client_ip=client_ip, endpoint=f"{method}:{path}", limit=limit, window=window
            )
            response.headers["X-RateLimit-Limit"] = str(limit)
            response.headers["X-RateLimit-Remaining"] = str(max(0, remaining))
            response.headers["X-RateLimit-Reset"] = str(int(time.time()) + window)

            return response

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Rate limiting error: {e}", exc_info=True)
            # Fail open - allow request if rate limiting fails
            return await call_next(request)

    def _get_rate_limit(self, path: str, _method: str) -> tuple[int, int]:
        """
        Get rate limit configuration for endpoint.

        Args:
            path: Request path
            method: HTTP method

        Returns:
            tuple[int, int]: (requests_limit, window_seconds)
        """
        # Authentication endpoints - strict limits to prevent brute force
        if "/api/v1/auth" in path:
            return (5, 60)  # 5 requests per minute

        # Protected API endpoints - moderate limits
        if path.startswith("/api/"):
            return (60, 60)  # 60 requests per minute

        # Default - generous limits
        return (100, 60)  # 100 requests per minute

    async def _check_rate_limit(
        self, client_ip: str, endpoint: str, limit: int, window: int
    ) -> bool:
        """
        Check if request is within rate limit using sliding window.

        Args:
            client_ip: Client IP address
            endpoint: Endpoint identifier
            limit: Maximum requests allowed
            window: Time window in seconds

        Returns:
            bool: True if allowed, False if rate limit exceeded
        """
        key = f"rate_limit:{client_ip}:{endpoint}"
        current_time = time.time()
        window_start = current_time - window

        # Use Redis pipeline for atomic operations
        pipe = self.redis_client.pipeline()

        # Remove old entries outside the window
        pipe.zremrangebyscore(key, 0, window_start)

        # Count requests in current window
        pipe.zcard(key)

        # Add current request
        pipe.zadd(key, {str(current_time): current_time})

        # Set expiry on the key
        pipe.expire(key, window)

        # Execute pipeline
        results = await pipe.execute()

        # Get count of requests in window (before adding current)
        count = results[1]

        # Allow if under limit
        return count < limit

    async def _get_remaining_requests(
        self, client_ip: str, endpoint: str, limit: int, window: int
    ) -> int:
        """
        Get remaining requests available in current window.

        Args:
            client_ip: Client IP address
            endpoint: Endpoint identifier
            limit: Maximum requests allowed
            window: Time window in seconds

        Returns:
            int: Number of remaining requests
        """
        key = f"rate_limit:{client_ip}:{endpoint}"
        current_time = time.time()
        window_start = current_time - window

        # Count requests in current window
        count = await self.redis_client.zcount(key, window_start, current_time)

        return max(0, limit - count)

    def _get_client_ip(self, request: Request) -> str:
        """
        Extract client IP address from request.

        Checks X-Forwarded-For header for proxy/load balancer setups,
        falls back to direct client IP.

        Args:
            request: FastAPI Request object

        Returns:
            str: Client IP address
        """
        # Check X-Forwarded-For header (for proxies/load balancers)
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            # Take the first IP in the chain
            return forwarded_for.split(",")[0].strip()

        # Fall back to direct client IP
        return request.client.host if request.client else "unknown"
