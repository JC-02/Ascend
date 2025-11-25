# ============================================
# Ascend AI - Auth API Integration Tests
# ============================================
# Integration tests for /api/v1/auth endpoints
# Story 1.4, Task 1.4.6 (SUB-1.4.6.1 & SUB-1.4.6.2)
# ============================================

import uuid
from datetime import datetime, timedelta

import pytest
from fastapi import status
from httpx import AsyncClient
from jose import jwt
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.models.user import User
from app.main import app


# ============================================
# Auth Verify Endpoint Tests
# ============================================
class TestAuthVerifyEndpoint:
    """
    Integration tests for POST /api/v1/auth/verify endpoint.

    Tests the complete authentication flow from HTTP request to database
    lookup, ensuring the endpoint correctly validates JWT tokens and
    returns user data.

    CCS Reference:
        - Task 1.4.6: Verify End-to-End Authentication Flow
        - SUB-1.4.6.1: Test /auth/verify with valid token (200 OK)
        - SUB-1.4.6.2: Test /auth/verify with invalid token (401 Unauthorized)
    """

    @pytest.mark.asyncio
    async def test_verify_with_valid_token_returns_200(
        self,
        test_user: User,
        valid_jwt_token: str,
        async_db_session: AsyncSession,
    ):
        """
        Test POST /api/v1/auth/verify with a valid JWT token returns 200 OK.

        Acceptance Criteria (SUB-1.4.6.1):
        - Endpoint returns 200 OK status
        - Response contains complete user data
        - User data matches the authenticated user

        Test Flow:
        1. Create a valid JWT token for test_user
        2. Make POST request to /api/v1/auth/verify with Authorization header
        3. Assert response is 200 OK
        4. Assert response body matches UserResponse schema
        5. Assert user data matches test_user
        """
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/api/v1/auth/verify",
                headers={"Authorization": f"Bearer {valid_jwt_token}"},
            )

        # Assert status code
        assert response.status_code == status.HTTP_200_OK, (
            f"Expected 200 OK, got {response.status_code}. " f"Response: {response.text}"
        )

        # Assert response body
        data = response.json()
        assert "id" in data, "Response missing 'id' field"
        assert "email" in data, "Response missing 'email' field"
        assert "name" in data, "Response missing 'name' field"
        assert "oauth_provider" in data, "Response missing 'oauth_provider' field"
        assert "created_at" in data, "Response missing 'created_at' field"
        assert "updated_at" in data, "Response missing 'updated_at' field"

        # Assert user data matches
        assert data["id"] == str(test_user.id), "User ID mismatch"
        assert data["email"] == test_user.email, "User email mismatch"
        assert data["name"] == test_user.name, "User name mismatch"
        assert data["oauth_provider"] == test_user.oauth_provider, "OAuth provider mismatch"

    @pytest.mark.asyncio
    async def test_verify_with_expired_token_returns_401(
        self,
        test_user: User,
        expired_jwt_token: str,
        async_db_session: AsyncSession,
    ):
        """
        Test POST /api/v1/auth/verify with expired token returns 401 Unauthorized.

        Acceptance Criteria (SUB-1.4.6.2):
        - Endpoint returns 401 Unauthorized status
        - Response contains error detail about invalid token
        - No user data is returned

        Security Note:
        - Expired tokens must be rejected to prevent session hijacking
        - Error message should not reveal token contents
        """
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/api/v1/auth/verify",
                headers={"Authorization": f"Bearer {expired_jwt_token}"},
            )

        # Assert status code
        assert (
            response.status_code == status.HTTP_401_UNAUTHORIZED
        ), f"Expected 401 Unauthorized, got {response.status_code}"

        # Assert error response structure
        data = response.json()
        assert "detail" in data, "Response missing 'detail' field"
        assert (
            "Invalid authentication token" in data["detail"]
        ), "Error detail should mention invalid token"

    @pytest.mark.asyncio
    async def test_verify_with_invalid_signature_returns_401(
        self,
        invalid_jwt_token: str,
        async_db_session: AsyncSession,
    ):
        """
        Test POST /api/v1/auth/verify with invalid signature returns 401.

        This tests the security of JWT validation - tokens signed with
        a different secret must be rejected.
        """
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/api/v1/auth/verify",
                headers={"Authorization": f"Bearer {invalid_jwt_token}"},
            )

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        data = response.json()
        assert "Invalid authentication token" in data["detail"]

    @pytest.mark.asyncio
    async def test_verify_with_malformed_token_returns_401(
        self,
        malformed_jwt_token: str,
        async_db_session: AsyncSession,
    ):
        """
        Test POST /api/v1/auth/verify with malformed token returns 401.

        Tests handling of tokens that are not valid JWT format.
        """
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/api/v1/auth/verify",
                headers={"Authorization": f"Bearer {malformed_jwt_token}"},
            )

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        data = response.json()
        assert "Invalid authentication token" in data["detail"]

    @pytest.mark.asyncio
    async def test_verify_without_authorization_header_returns_403(
        self,
        async_db_session: AsyncSession,
    ):
        """
        Test POST /api/v1/auth/verify without Authorization header returns 403.

        FastAPI's HTTPBearer security scheme returns 403 when the
        Authorization header is missing.
        """
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post("/api/v1/auth/verify")

        assert response.status_code == status.HTTP_403_FORBIDDEN

    @pytest.mark.asyncio
    async def test_verify_with_nonexistent_user_returns_401(
        self,
        async_db_session: AsyncSession,
    ):
        """
        Test POST /api/v1/auth/verify with valid token but nonexistent user returns 401.

        This tests the scenario where a user's token is still valid but
        their account has been deleted from the database.
        """
        # Create token for user that doesn't exist
        nonexistent_user_id = str(uuid.uuid4())
        payload = {
            "sub": nonexistent_user_id,
            "exp": datetime.utcnow() + timedelta(hours=1),
            "iat": datetime.utcnow(),
        }
        token = jwt.encode(payload, settings.nextauth_secret, algorithm="HS256")

        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/api/v1/auth/verify",
                headers={"Authorization": f"Bearer {token}"},
            )

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        data = response.json()
        assert "User not found" in data["detail"]

    @pytest.mark.asyncio
    async def test_verify_returns_complete_user_response_schema(
        self,
        test_user: User,
        valid_jwt_token: str,
        async_db_session: AsyncSession,
    ):
        """
        Test that POST /api/v1/auth/verify returns all fields from UserResponse schema.

        Ensures the endpoint returns the complete user profile including:
        - UUID
        - Email
        - Name (nullable)
        - Avatar URL (nullable)
        - OAuth provider
        - Created timestamp
        - Updated timestamp
        """
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/api/v1/auth/verify",
                headers={"Authorization": f"Bearer {valid_jwt_token}"},
            )

        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        # Assert all UserResponse fields are present
        required_fields = [
            "id",
            "email",
            "name",
            "avatar_url",
            "oauth_provider",
            "created_at",
            "updated_at",
        ]
        for field in required_fields:
            assert field in data, f"Missing required field: {field}"

        # Assert field types
        assert isinstance(data["id"], str), "id should be string (UUID)"
        assert isinstance(data["email"], str), "email should be string"
        assert isinstance(data["oauth_provider"], str), "oauth_provider should be string"
        assert isinstance(data["created_at"], str), "created_at should be ISO datetime string"
        assert isinstance(data["updated_at"], str), "updated_at should be ISO datetime string"

        # Name and avatar_url can be null
        assert data["name"] is None or isinstance(data["name"], str)
        assert data["avatar_url"] is None or isinstance(data["avatar_url"], str)


# ============================================
# End-to-End Integration Tests
# ============================================
class TestAuthenticationEndToEnd:
    """
    End-to-end integration tests for the complete authentication flow.

    These tests simulate real-world scenarios from token generation
    through API request to database lookup.
    """

    @pytest.mark.asyncio
    async def test_complete_authentication_flow(
        self,
        test_user: User,
        async_db_session: AsyncSession,
    ):
        """
        Test the complete authentication flow end-to-end.

        Flow:
        1. Generate JWT token (simulating NextAuth.js)
        2. Make authenticated request to /api/v1/auth/verify
        3. Verify response contains correct user data
        4. Verify session is properly maintained

        This test validates Story 1.4 Acceptance Criteria AC-4:
        "The frontend can make an authenticated request to a protected
        backend endpoint (/auth/verify), which successfully validates
        the user and returns their data."
        """
        # Step 1: Generate JWT token (simulating NextAuth.js)
        payload = {
            "sub": str(test_user.id),
            "exp": datetime.utcnow() + timedelta(hours=1),
            "iat": datetime.utcnow(),
        }
        token = jwt.encode(payload, settings.nextauth_secret, algorithm="HS256")

        # Step 2: Make authenticated request
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/api/v1/auth/verify",
                headers={"Authorization": f"Bearer {token}"},
            )

        # Step 3: Verify response
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == str(test_user.id)
        assert data["email"] == test_user.email

        # Step 4: Verify we can make multiple requests with same token
        async with AsyncClient(app=app, base_url="http://test") as client:
            response2 = await client.post(
                "/api/v1/auth/verify",
                headers={"Authorization": f"Bearer {token}"},
            )

        assert response2.status_code == status.HTTP_200_OK
        data2 = response2.json()
        assert data2["id"] == str(test_user.id)

    @pytest.mark.asyncio
    async def test_multiple_users_can_authenticate_independently(
        self,
        async_db_session: AsyncSession,
    ):
        """
        Test that multiple users can authenticate independently without interference.

        This validates proper user isolation in the authentication system.
        """
        from sqlalchemy import text

        # Create two test users with unique IDs and emails
        user1_id = str(uuid.uuid4())
        user2_id = str(uuid.uuid4())

        await async_db_session.execute(
            text(
                """
                INSERT INTO users (id, email, name, oauth_provider, oauth_id, created_at, updated_at)
                VALUES (:id, :email, :name, :provider, :oauth_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                ON CONFLICT (id) DO NOTHING
            """
            ),
            {
                "id": user1_id,
                "email": f"user1-{user1_id}@example.com",
                "name": "User One",
                "provider": "google",
                "oauth_id": f"oauth1-{user1_id}",
            },
        )
        await async_db_session.execute(
            text(
                """
                INSERT INTO users (id, email, name, oauth_provider, oauth_id, created_at, updated_at)
                VALUES (:id, :email, :name, :provider, :oauth_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                ON CONFLICT (id) DO NOTHING
            """
            ),
            {
                "id": user2_id,
                "email": f"user2-{user2_id}@example.com",
                "name": "User Two",
                "provider": "github",
                "oauth_id": f"oauth2-{user2_id}",
            },
        )
        await async_db_session.commit()

        # Generate tokens for both users
        token1 = jwt.encode(
            {
                "sub": user1_id,
                "exp": datetime.utcnow() + timedelta(hours=1),
                "iat": datetime.utcnow(),
            },
            settings.nextauth_secret,
            algorithm="HS256",
        )
        token2 = jwt.encode(
            {
                "sub": user2_id,
                "exp": datetime.utcnow() + timedelta(hours=1),
                "iat": datetime.utcnow(),
            },
            settings.nextauth_secret,
            algorithm="HS256",
        )

        # Authenticate both users
        async with AsyncClient(app=app, base_url="http://test") as client:
            response1 = await client.post(
                "/api/v1/auth/verify",
                headers={"Authorization": f"Bearer {token1}"},
            )
            response2 = await client.post(
                "/api/v1/auth/verify",
                headers={"Authorization": f"Bearer {token2}"},
            )

        # Assert both authenticated successfully
        assert response1.status_code == status.HTTP_200_OK
        assert response2.status_code == status.HTTP_200_OK

        # Assert correct user data returned
        data1 = response1.json()
        data2 = response2.json()
        assert data1["id"] == user1_id
        assert data1["email"] == f"user1-{user1_id}@example.com"
        assert data2["id"] == user2_id
        assert data2["email"] == f"user2-{user2_id}@example.com"

        # Assert users are properly isolated
        assert data1["id"] != data2["id"]
        assert data1["email"] != data2["email"]


# ============================================
# Security Tests
# ============================================
class TestAuthenticationSecurity:
    """
    Security-focused tests for authentication vulnerabilities.
    """

    @pytest.mark.asyncio
    async def test_token_cannot_be_forged(
        self,
        test_user: User,
        async_db_session: AsyncSession,
    ):
        """
        Test that tokens signed with a different secret are rejected.

        This validates that the JWT signature verification is working
        correctly and prevents token forgery attacks.
        """
        # Create forged token with wrong secret
        payload = {
            "sub": str(test_user.id),
            "exp": datetime.utcnow() + timedelta(hours=1),
            "iat": datetime.utcnow(),
        }
        forged_token = jwt.encode(payload, "attacker-secret-key-123456789012", algorithm="HS256")

        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/api/v1/auth/verify",
                headers={"Authorization": f"Bearer {forged_token}"},
            )

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @pytest.mark.asyncio
    async def test_token_with_modified_claims_is_rejected(
        self,
        test_user: User,
        valid_jwt_token: str,
        async_db_session: AsyncSession,
    ):
        """
        Test that modifying token claims after signing invalidates the token.

        This tests tamper resistance of JWT tokens.
        """
        # Try to manually modify the token (will break signature)
        modified_token = valid_jwt_token[:-10] + "AAAAAAAAAA"

        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/api/v1/auth/verify",
                headers={"Authorization": f"Bearer {modified_token}"},
            )

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
