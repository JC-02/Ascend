# ============================================
# Ascend AI - Authentication & Authorization
# ============================================
# JWT validation and user authentication dependency
# Follows CCS Section 8.6.3 (Authentication Integration)
# DIRECTIVE: DIR-008 (Zero Trust Security Protocol)
# ============================================

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.models.user import User
from app.db.session import get_db

# ============================================
# Security Scheme Configuration
# ============================================
# HTTPBearer extracts the token from the Authorization header
# Format: Authorization: Bearer <token>
security = HTTPBearer()


# ============================================
# Authentication Dependency
# ============================================
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: AsyncSession = Depends(get_db),
) -> User:
    """
    FastAPI dependency that validates JWT tokens and returns the authenticated user.

    This dependency:
    1. Extracts the JWT token from the Authorization header (Bearer token)
    2. Validates the token signature using NEXTAUTH_SECRET
    3. Extracts the user ID from the "sub" claim
    4. Fetches the user from the database
    5. Returns the authenticated User object

    Args:
        credentials: HTTPAuthorizationCredentials containing the Bearer token
        session: AsyncSession for database queries

    Returns:
        User: The authenticated user object from the database

    Raises:
        HTTPException: 401 Unauthorized if:
            - Token is missing or malformed
            - Token signature is invalid
            - Token is expired
            - "sub" claim is missing
            - User does not exist in database

    Usage:
        @router.get("/protected")
        async def protected_route(current_user: User = Depends(get_current_user)):
            return {"user_id": current_user.id}

    Security Notes (CCS Section 8.6.3):
    - Authentication verifies WHO the user is
    - Authorization verifies WHAT the user can access
    - After using this dependency, you MUST verify resource ownership
    - Example: if resume.user_id != current_user.id: raise HTTPException(403)
    """
    token = credentials.credentials

    # ============================================
    # JWT Token Validation
    # ============================================
    try:
        # Decode and verify JWT token
        # - Validates signature using NEXTAUTH_SECRET
        # - Checks expiration time (exp claim)
        # - Verifies token integrity
        payload = jwt.decode(
            token,
            settings.nextauth_secret,
            algorithms=["HS256"],  # Only HS256 allowed per CCS
        )

        # Extract user ID from "sub" claim
        # NextAuth.js encodes the user ID in the "sub" (subject) claim
        user_id: str = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token: missing subject claim",
                headers={"WWW-Authenticate": "Bearer"},
            )

    except JWTError as e:
        # Catches all JWT-related errors:
        # - Invalid signature
        # - Expired token
        # - Malformed token
        # - Invalid claims
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        ) from e

    # ============================================
    # User Database Verification
    # ============================================
    # Fetch the user from the database using the extracted user_id
    # This ensures the user still exists and hasn't been deleted
    user = await session.get(User, user_id)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Return the authenticated User ORM object
    # Endpoints can now access user.id, user.email, etc.
    return user
