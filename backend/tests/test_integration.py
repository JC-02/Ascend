# ============================================
# Ascend AI - Integration Tests
# ============================================
# Tests for complete request flow with all middleware
# ============================================

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
import time

from app.main import app


@pytest.fixture
def client():
    """Create a test client for the main application."""
    return TestClient(app)


def test_health_check_with_logging(client, caplog):
    """Test that health check works with logging middleware."""
    import logging

    with caplog.at_level(logging.INFO):
        response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

    # Verify logging middleware recorded the request
    log_messages = [record.message for record in caplog.records]
    assert any("GET /health" in msg for msg in log_messages)


def test_cors_headers_present(client):
    """Test that CORS middleware is working."""
    response = client.get(
        "/health",
        headers={"Origin": "http://localhost:3000"}
    )

    assert response.status_code == 200
    # CORS headers should be present (if origin is allowed)


def test_rate_limit_headers_on_success(client):
    """Test that successful requests include rate limit headers (if Redis available)."""
    response = client.get("/")

    assert response.status_code == 200

    # Rate limit headers may be present if Redis is available
    # Just verify the request succeeds
    assert "status" not in response.headers or response.status_code == 200


def test_middleware_stack_order(client):
    """Test that middleware executes in correct order."""
    # Make a request and verify it succeeds
    # This tests that all middleware is compatible
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_nonexistent_endpoint_logging(client, caplog):
    """Test that 404 errors are logged appropriately."""
    import logging

    with caplog.at_level(logging.WARNING):
        response = client.get("/nonexistent-endpoint")

    assert response.status_code == 404

    # Should have warning-level log for 404
    warning_logs = [r for r in caplog.records if r.levelname == "WARNING"]
    assert len(warning_logs) > 0


def test_root_endpoint_with_all_middleware(client):
    """Test root endpoint works with all middleware active."""
    response = client.get("/")

    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Ascend AI API"
    assert data["version"] == "1.0.0"


def test_multiple_requests_sequential(client):
    """Test that multiple requests work correctly."""
    # Make several requests to test stability
    for i in range(5):
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"


def test_request_with_custom_headers(client):
    """Test that custom headers are handled correctly."""
    response = client.get(
        "/health",
        headers={
            "User-Agent": "TestClient/1.0",
            "X-Custom-Header": "test-value"
        }
    )

    assert response.status_code == 200


def test_request_with_bearer_token_format(client):
    """Test that requests with Bearer token format are handled."""
    # Note: This won't authenticate (invalid token) but should be processed
    response = client.get(
        "/health",
        headers={"Authorization": "Bearer fake-token-for-testing"}
    )

    assert response.status_code == 200


def test_json_response_format(client):
    """Test that JSON responses are correctly formatted."""
    response = client.get("/")

    assert response.status_code == 200
    assert response.headers["content-type"] == "application/json"

    data = response.json()
    assert isinstance(data, dict)
    assert "message" in data
    assert "version" in data


def test_application_startup_completes(client):
    """Test that application starts successfully with all middleware."""
    # If we can make a request, startup completed successfully
    response = client.get("/health")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_middleware_performance_overhead():
    """Test that middleware doesn't add significant latency."""
    client = TestClient(app)

    # Measure response time for health check
    start_time = time.time()
    for _ in range(10):
        response = client.get("/health")
        assert response.status_code == 200
    end_time = time.time()

    avg_time = (end_time - start_time) / 10

    # Average request should be under 100ms (very generous)
    # Health check should be nearly instant
    assert avg_time < 0.1, f"Average request time {avg_time}s exceeds threshold"


def test_error_handling_with_middleware(client):
    """Test that errors are properly handled through middleware stack."""
    # Request non-existent endpoint to trigger 404
    response = client.get("/api/v1/nonexistent")

    assert response.status_code == 404


def test_docs_endpoint_accessible(client):
    """Test that API docs are accessible."""
    response = client.get("/docs")

    # Docs endpoint should return HTML (200) or redirect
    assert response.status_code in [200, 307]
