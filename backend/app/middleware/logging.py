# ============================================
# Ascend AI - Request Logging Middleware
# ============================================
# Comprehensive request/response logging for security monitoring
# Follows CCS security and audit requirements
# ============================================

import logging
import time
import json
from typing import Callable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import Message

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware for logging all HTTP requests and responses.

    Features:
    - Logs request method, path, IP address, user agent
    - Tracks request duration
    - Logs response status codes
    - Sanitizes sensitive headers (Authorization)
    - Provides security audit trail

    Security Notes:
    - Authorization headers are masked in logs
    - User IP addresses are logged for security monitoring
    - Failed authentication attempts are highlighted
    """

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Process and log HTTP requests and responses.

        Args:
            request: Incoming HTTP request
            call_next: Next middleware/endpoint in the chain

        Returns:
            Response: HTTP response from the endpoint
        """
        # Start timing
        start_time = time.time()

        # Extract request metadata
        request_id = id(request)
        method = request.method
        path = request.url.path
        query_params = str(request.url.query) if request.url.query else None
        client_host = request.client.host if request.client else "unknown"
        user_agent = request.headers.get("user-agent", "unknown")

        # Check if this is an authenticated request
        auth_header = request.headers.get("authorization")
        is_authenticated = bool(auth_header and auth_header.startswith("Bearer "))

        # Log incoming request
        logger.info(
            f"[{request_id}] {method} {path} - "
            f"Client: {client_host} - "
            f"Auth: {'Yes' if is_authenticated else 'No'}"
        )

        # Process request
        try:
            response = await call_next(request)

            # Calculate duration
            duration = time.time() - start_time

            # Determine log level based on status code
            status_code = response.status_code
            if status_code >= 500:
                log_level = logging.ERROR
            elif status_code >= 400:
                log_level = logging.WARNING
            else:
                log_level = logging.INFO

            # Log response
            logger.log(
                log_level,
                f"[{request_id}] {method} {path} - "
                f"Status: {status_code} - "
                f"Duration: {duration:.3f}s - "
                f"Client: {client_host}"
            )

            # Log failed authentication attempts for security monitoring
            if status_code == 401 and is_authenticated:
                logger.warning(
                    f"[SECURITY] Failed authentication attempt - "
                    f"Path: {path} - "
                    f"Client: {client_host} - "
                    f"User-Agent: {user_agent}"
                )

            return response

        except Exception as e:
            # Log exceptions
            duration = time.time() - start_time
            logger.error(
                f"[{request_id}] {method} {path} - "
                f"Exception: {type(e).__name__}: {str(e)} - "
                f"Duration: {duration:.3f}s - "
                f"Client: {client_host}",
                exc_info=True
            )
            raise


def get_client_ip(request: Request) -> str:
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
