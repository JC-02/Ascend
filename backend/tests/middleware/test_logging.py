# ============================================
# Ascend AI - Request Logging Middleware Tests
# ============================================
# Tests for request/response logging functionality
# ============================================

import logging

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.middleware.logging import RequestLoggingMiddleware, get_client_ip


@pytest.fixture
def app_with_logging():
    """Create a test FastAPI app with logging middleware."""
    app = FastAPI()
    app.add_middleware(RequestLoggingMiddleware)

    @app.get("/test")
    async def test_endpoint():
        return {"message": "success"}

    @app.get("/error")
    async def error_endpoint():
        raise ValueError("Test error")

    return app


@pytest.fixture
def client(app_with_logging):
    """Create a test client."""
    return TestClient(app_with_logging)


def test_logging_middleware_logs_successful_request(client, caplog):
    """Test that successful requests are logged."""
    with caplog.at_level(logging.INFO):
        response = client.get("/test")

    assert response.status_code == 200

    # Check that request and response were logged
    log_messages = [record.message for record in caplog.records]

    # Should have incoming request log
    assert any("GET /test" in msg for msg in log_messages)

    # Should have response log with status
    assert any("Status: 200" in msg for msg in log_messages)


def test_logging_middleware_logs_duration(client, caplog):
    """Test that request duration is logged."""
    with caplog.at_level(logging.INFO):
        response = client.get("/test")

    assert response.status_code == 200

    # Check that duration is logged
    log_messages = [record.message for record in caplog.records]
    assert any("Duration:" in msg and "s" in msg for msg in log_messages)


def test_logging_middleware_logs_client_ip(client, caplog):
    """Test that client IP is logged."""
    with caplog.at_level(logging.INFO):
        response = client.get("/test")

    assert response.status_code == 200

    # Check that client IP is logged
    log_messages = [record.message for record in caplog.records]
    assert any("Client:" in msg for msg in log_messages)


def test_logging_middleware_warns_on_4xx_errors(client, caplog):
    """Test that 4xx errors are logged with WARNING level."""
    with caplog.at_level(logging.WARNING):
        response = client.get("/nonexistent")

    assert response.status_code == 404

    # Check that 404 is logged at WARNING level
    warning_logs = [record for record in caplog.records if record.levelname == "WARNING"]
    assert len(warning_logs) > 0
    assert any("Status: 404" in record.message for record in warning_logs)


def test_logging_middleware_errors_on_5xx_errors(client, caplog):
    """Test that 5xx errors are logged with ERROR level."""
    with caplog.at_level(logging.ERROR):
        # This will cause a 500 error due to unhandled ValueError
        with pytest.raises(ValueError):
            client.get("/error")

    # Check that exception is logged at ERROR level
    error_logs = [record for record in caplog.records if record.levelname == "ERROR"]
    assert len(error_logs) > 0
    assert any("Exception:" in record.message for record in error_logs)


def test_get_client_ip_returns_direct_ip(app_with_logging):
    """Test that get_client_ip returns direct client IP."""
    from unittest.mock import Mock

    from fastapi import Request

    # Mock request with direct client IP
    request = Mock(spec=Request)
    request.headers.get = Mock(return_value=None)
    request.client = Mock(host="192.168.1.100")

    ip = get_client_ip(request)
    assert ip == "192.168.1.100"


def test_get_client_ip_returns_forwarded_ip(app_with_logging):
    """Test that get_client_ip returns X-Forwarded-For IP when present."""
    from unittest.mock import Mock

    from fastapi import Request

    # Mock request with X-Forwarded-For header
    request = Mock(spec=Request)
    request.headers.get = Mock(return_value="203.0.113.1, 198.51.100.1")
    request.client = Mock(host="192.168.1.100")

    ip = get_client_ip(request)
    # Should return the first IP in the chain
    assert ip == "203.0.113.1"


def test_get_client_ip_handles_no_client(app_with_logging):
    """Test that get_client_ip handles missing client gracefully."""
    from unittest.mock import Mock

    from fastapi import Request

    # Mock request without client
    request = Mock(spec=Request)
    request.headers.get = Mock(return_value=None)
    request.client = None

    ip = get_client_ip(request)
    assert ip == "unknown"


def test_logging_middleware_logs_auth_status(client, caplog):
    """Test that authentication status is logged."""
    with caplog.at_level(logging.INFO):
        # Request without auth
        response1 = client.get("/test")
        assert response1.status_code == 200

        # Request with auth header
        response2 = client.get("/test", headers={"Authorization": "Bearer fake-token"})
        assert response2.status_code == 200

    log_messages = [record.message for record in caplog.records]

    # Should have logs showing auth status
    assert any("Auth: No" in msg for msg in log_messages)
    assert any("Auth: Yes" in msg for msg in log_messages)
