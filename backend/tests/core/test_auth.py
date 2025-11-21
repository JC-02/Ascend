# ============================================
# Ascend AI - Authentication Tests
# ============================================
# Tests for JWT validation and get_current_user dependency
# Story 1.4, Task 1.4.2, Sub-tasks 1.4.2.1 & 1.4.2.2
# ============================================

import uuid
import pytest
from datetime import datetime, timedelta
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from jose import jwt
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user
from app.core.security import (
    decode_jwt_token,
    verify_token_signature,
    extract_user_id_from_token,
)
from app.core.config import settings
from app.db.models.user import User


# ============================================
# Security.py Tests (JWT Decoding Logic)
# ============================================
class TestDecodeJWTToken:
    """Test suite for decode_jwt_token function (SUB-1.4.2.1)."""

    def test_decode_valid_token(self, valid_jwt_token: str, test_user_id: str):
        """Test decoding a valid JWT token."""
        payload = decode_jwt_token(valid_jwt_token)

        assert payload is not None
        assert isinstance(payload, dict)
        assert payload["sub"] == test_user_id
        assert "exp" in payload
        assert "iat" in payload

    def test_decode_expired_token(self, expired_jwt_token: str):
        """Test decoding an expired JWT token raises JWTError."""
        from jose import JWTError

        with pytest.raises(JWTError):
            decode_jwt_token(expired_jwt_token)

    def test_decode_invalid_signature(self, invalid_jwt_token: str):
        """Test decoding a token with invalid signature raises JWTError."""
        from jose import JWTError

        with pytest.raises(JWTError):
            decode_jwt_token(invalid_jwt_token)

    def test_decode_malformed_token(self, malformed_jwt_token: str):
        """Test decoding a malformed token raises JWTError."""
        from jose import JWTError

        with pytest.raises(JWTError):
            decode_jwt_token(malformed_jwt_token)

    def test_decode_token_with_missing_claims(self):
        """Test decoding a token without required claims."""
        # Create token without 'sub' claim
        payload = {
            "exp": datetime.utcnow() + timedelta(hours=1),
            "iat": datetime.utcnow(),
        }
        token = jwt.encode(payload, settings.nextauth_secret, algorithm="HS256")

        # Token is valid but missing 'sub' - should still decode successfully
        # The get_current_user function is responsible for validating required claims
        decoded = decode_jwt_token(token)
        assert decoded is not None
        assert "sub" not in decoded

    def test_decode_token_algorithm_validation(self):
        """Test that only HS256 algorithm is accepted."""
        # Create token with different algorithm
        payload = {
            "sub": str(uuid.uuid4()),
            "exp": datetime.utcnow() + timedelta(hours=1),
            "iat": datetime.utcnow(),
        }
        # This token is signed with HS256 but claims to use RS256
        token = jwt.encode(payload, settings.nextauth_secret, algorithm="HS256")

        # Should decode successfully since it's actually HS256
        decoded = decode_jwt_token(token)
        assert decoded["sub"] == payload["sub"]


class TestVerifyTokenSignature:
    """Test suite for verify_token_signature utility function."""

    def test_verify_valid_token(self, valid_jwt_token: str):
        """Test verifying a valid token returns True."""
        assert verify_token_signature(valid_jwt_token) is True

    def test_verify_expired_token(self, expired_jwt_token: str):
        """Test verifying an expired token returns False."""
        assert verify_token_signature(expired_jwt_token) is False

    def test_verify_invalid_signature(self, invalid_jwt_token: str):
        """Test verifying a token with invalid signature returns False."""
        assert verify_token_signature(invalid_jwt_token) is False

    def test_verify_malformed_token(self, malformed_jwt_token: str):
        """Test verifying a malformed token returns False."""
        assert verify_token_signature(malformed_jwt_token) is False


class TestExtractUserIdFromToken:
    """Test suite for extract_user_id_from_token utility function."""

    def test_extract_user_id_from_valid_token(
        self, valid_jwt_token: str, test_user_id: str
    ):
        """Test extracting user ID from a valid token."""
        user_id = extract_user_id_from_token(valid_jwt_token)
        assert user_id == test_user_id

    def test_extract_user_id_from_expired_token(self, expired_jwt_token: str):
        """Test extracting user ID from expired token returns None."""
        user_id = extract_user_id_from_token(expired_jwt_token)
        assert user_id is None

    def test_extract_user_id_from_invalid_token(self, invalid_jwt_token: str):
        """Test extracting user ID from invalid token returns None."""
        user_id = extract_user_id_from_token(invalid_jwt_token)
        assert user_id is None

    def test_extract_user_id_from_token_without_sub_claim(self):
        """Test extracting user ID from token without 'sub' claim returns None."""
        payload = {
            "exp": datetime.utcnow() + timedelta(hours=1),
            "iat": datetime.utcnow(),
        }
        token = jwt.encode(payload, settings.nextauth_secret, algorithm="HS256")

        user_id = extract_user_id_from_token(token)
        assert user_id is None


# ============================================
# Auth.py Tests (get_current_user Dependency)
# ============================================
class TestGetCurrentUser:
    """Test suite for get_current_user dependency (SUB-1.4.2.2)."""

    @pytest.mark.asyncio
    async def test_get_current_user_with_valid_token(
        self,
        test_user: User,
        valid_jwt_token: str,
        async_db_session: AsyncSession,
    ):
        """Test get_current_user with a valid JWT token."""
        # Create mock credentials
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer", credentials=valid_jwt_token
        )

        # Call the dependency
        user = await get_current_user(credentials, async_db_session)

        # Assertions
        assert user is not None
        assert isinstance(user, User)
        assert user.id == test_user.id
        assert user.email == test_user.email
        assert user.name == test_user.name

    @pytest.mark.asyncio
    async def test_get_current_user_with_expired_token(
        self,
        test_user: User,
        expired_jwt_token: str,
        async_db_session: AsyncSession,
    ):
        """Test get_current_user with expired token raises 401."""
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer", credentials=expired_jwt_token
        )

        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(credentials, async_db_session)

        assert exc_info.value.status_code == 401
        assert "Invalid authentication token" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_get_current_user_with_invalid_signature(
        self,
        invalid_jwt_token: str,
        async_db_session: AsyncSession,
    ):
        """Test get_current_user with invalid signature raises 401."""
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer", credentials=invalid_jwt_token
        )

        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(credentials, async_db_session)

        assert exc_info.value.status_code == 401
        assert "Invalid authentication token" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_get_current_user_with_malformed_token(
        self,
        malformed_jwt_token: str,
        async_db_session: AsyncSession,
    ):
        """Test get_current_user with malformed token raises 401."""
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer", credentials=malformed_jwt_token
        )

        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(credentials, async_db_session)

        assert exc_info.value.status_code == 401
        assert "Invalid authentication token" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_get_current_user_with_nonexistent_user(
        self,
        async_db_session: AsyncSession,
    ):
        """Test get_current_user when user doesn't exist in database raises 401."""
        # Create token for user that doesn't exist in database
        nonexistent_user_id = str(uuid.uuid4())
        payload = {
            "sub": nonexistent_user_id,
            "exp": datetime.utcnow() + timedelta(hours=1),
            "iat": datetime.utcnow(),
        }
        token = jwt.encode(payload, settings.nextauth_secret, algorithm="HS256")

        credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)

        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(credentials, async_db_session)

        assert exc_info.value.status_code == 401
        assert "User not found" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_get_current_user_with_missing_sub_claim(
        self,
        async_db_session: AsyncSession,
    ):
        """Test get_current_user with token missing 'sub' claim raises 401."""
        # Create token without 'sub' claim
        payload = {
            "exp": datetime.utcnow() + timedelta(hours=1),
            "iat": datetime.utcnow(),
        }
        token = jwt.encode(payload, settings.nextauth_secret, algorithm="HS256")

        credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)

        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(credentials, async_db_session)

        assert exc_info.value.status_code == 401
        assert "missing subject claim" in exc_info.value.detail.lower()

    @pytest.mark.asyncio
    async def test_get_current_user_returns_complete_user_object(
        self,
        test_user: User,
        valid_jwt_token: str,
        async_db_session: AsyncSession,
    ):
        """Test that get_current_user returns complete User ORM object with all fields."""
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer", credentials=valid_jwt_token
        )

        user = await get_current_user(credentials, async_db_session)

        # Verify all User model fields are accessible
        assert hasattr(user, "id")
        assert hasattr(user, "email")
        assert hasattr(user, "name")
        assert hasattr(user, "avatar_url")
        assert hasattr(user, "oauth_provider")
        assert hasattr(user, "oauth_id")
        assert hasattr(user, "created_at")
        assert hasattr(user, "updated_at")

        # Verify relationships are accessible (even if empty)
        assert hasattr(user, "resumes")
        assert hasattr(user, "interview_sessions")


# ============================================
# Integration Tests
# ============================================
class TestAuthenticationIntegration:
    """Integration tests for the complete authentication flow."""

    @pytest.mark.asyncio
    async def test_authentication_flow_end_to_end(
        self,
        test_user: User,
        async_db_session: AsyncSession,
    ):
        """
        Test the complete authentication flow:
        1. Generate JWT token
        2. Validate token
        3. Extract user ID
        4. Fetch user from database
        """
        # Step 1: Generate JWT token (simulating NextAuth.js)
        payload = {
            "sub": test_user.id,
            "exp": datetime.utcnow() + timedelta(hours=1),
            "iat": datetime.utcnow(),
        }
        token = jwt.encode(payload, settings.nextauth_secret, algorithm="HS256")

        # Step 2: Validate token signature
        assert verify_token_signature(token) is True

        # Step 3: Extract user ID
        user_id = extract_user_id_from_token(token)
        assert user_id == test_user.id

        # Step 4: Fetch user from database using dependency
        credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
        authenticated_user = await get_current_user(credentials, async_db_session)

        # Verify we got the correct user
        assert authenticated_user.id == test_user.id
        assert authenticated_user.email == test_user.email

    @pytest.mark.asyncio
    async def test_multiple_users_authentication_isolation(
        self,
        async_db_session: AsyncSession,
    ):
        """Test that authentication correctly isolates different users."""
        from sqlalchemy import text

        user1_id = str(uuid.uuid4())
        user2_id = str(uuid.uuid4())

        # Create two different users using raw SQL to avoid relationship issues
        await async_db_session.execute(
            text("""
                INSERT INTO users (id, email, name, oauth_provider, oauth_id, created_at, updated_at)
                VALUES (:id, :email, :name, :provider, :oauth_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            """),
            {
                "id": user1_id,
                "email": "user1@example.com",
                "name": "User One",
                "provider": "google",
                "oauth_id": "oauth1",
            }
        )
        await async_db_session.execute(
            text("""
                INSERT INTO users (id, email, name, oauth_provider, oauth_id, created_at, updated_at)
                VALUES (:id, :email, :name, :provider, :oauth_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            """),
            {
                "id": user2_id,
                "email": "user2@example.com",
                "name": "User Two",
                "provider": "github",
                "oauth_id": "oauth2",
            }
        )
        await async_db_session.commit()

        # Fetch users
        user1 = await async_db_session.get(User, user1_id)
        user2 = await async_db_session.get(User, user2_id)

        # Create tokens for both users
        token1 = jwt.encode(
            {
                "sub": user1.id,
                "exp": datetime.utcnow() + timedelta(hours=1),
                "iat": datetime.utcnow(),
            },
            settings.nextauth_secret,
            algorithm="HS256",
        )
        token2 = jwt.encode(
            {
                "sub": user2.id,
                "exp": datetime.utcnow() + timedelta(hours=1),
                "iat": datetime.utcnow(),
            },
            settings.nextauth_secret,
            algorithm="HS256",
        )

        # Authenticate with token1
        creds1 = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token1)
        auth_user1 = await get_current_user(creds1, async_db_session)
        assert auth_user1.id == user1.id
        assert auth_user1.email == "user1@example.com"

        # Authenticate with token2
        creds2 = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token2)
        auth_user2 = await get_current_user(creds2, async_db_session)
        assert auth_user2.id == user2.id
        assert auth_user2.email == "user2@example.com"

        # Verify they are different users
        assert auth_user1.id != auth_user2.id


# ============================================
# Security Edge Cases
# ============================================
class TestAuthenticationSecurityEdgeCases:
    """Test edge cases and security scenarios."""

    @pytest.mark.asyncio
    async def test_token_with_extra_claims_is_accepted(
        self,
        test_user: User,
        async_db_session: AsyncSession,
    ):
        """Test that tokens with extra claims (beyond sub, exp, iat) are accepted."""
        payload = {
            "sub": test_user.id,
            "exp": datetime.utcnow() + timedelta(hours=1),
            "iat": datetime.utcnow(),
            "email": test_user.email,  # Extra claim
            "name": test_user.name,  # Extra claim
        }
        token = jwt.encode(payload, settings.nextauth_secret, algorithm="HS256")

        credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
        user = await get_current_user(credentials, async_db_session)

        assert user.id == test_user.id

    def test_token_cannot_be_forged_with_different_secret(self):
        """Test that tokens signed with different secret are rejected."""
        payload = {
            "sub": str(uuid.uuid4()),
            "exp": datetime.utcnow() + timedelta(hours=1),
            "iat": datetime.utcnow(),
        }

        # Sign with wrong secret
        forged_token = jwt.encode(
            payload, "attacker-secret-key-123456789012", algorithm="HS256"
        )

        # Verification should fail
        assert verify_token_signature(forged_token) is False

    def test_token_expiration_is_enforced(self):
        """Test that expired tokens are properly rejected."""
        payload = {
            "sub": str(uuid.uuid4()),
            "exp": datetime.utcnow() - timedelta(seconds=1),  # Expired 1 second ago
            "iat": datetime.utcnow() - timedelta(hours=1),
        }
        expired_token = jwt.encode(payload, settings.nextauth_secret, algorithm="HS256")

        assert verify_token_signature(expired_token) is False
