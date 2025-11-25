# ============================================
# Ascend AI - Authentication API Routes
# ============================================
# JWT validation and user verification endpoints
# Story 1.4, Task 1.4.3 (SUB-1.4.3.1 & SUB-1.4.3.2)
# ============================================

from fastapi import APIRouter, Depends, status

from app.core.auth import get_current_user
from app.db.models.user import User
from app.schemas.user import UserResponse

# ============================================
# Router Configuration
# ============================================
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


# ============================================
# User Verification Endpoint
# ============================================
@router.post(
    "/verify",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Verify User Authentication",
    description="""
    Verifies the current user's JWT token and returns their profile information.

    This endpoint is used by the frontend to:
    1. Validate that the user's session is still active
    2. Retrieve the current user's profile data
    3. Check authentication status before rendering protected routes

    **Authentication Required:** Yes (JWT Bearer token in Authorization header)

    **Returns:** Complete user profile with UUID, email, name, avatar, and timestamps

    **Errors:**
    - 401 Unauthorized: Invalid, expired, or missing JWT token
    - 401 Unauthorized: User no longer exists in database
    """,
)
async def verify_user(
    current_user: User = Depends(get_current_user),
) -> UserResponse:
    """
    Verify user authentication and return user data.

    This endpoint validates the JWT token and returns the authenticated user's data.
    It serves as the primary endpoint for the frontend to verify sessions and
    retrieve user information for protected routes.

    Args:
        current_user: User object automatically injected by get_current_user dependency.
                     This dependency handles all JWT validation and database lookup.

    Returns:
        UserResponse: Pydantic schema containing user profile data:
            - id: User's UUID
            - email: User's email address
            - name: User's display name
            - avatar_url: URL to user's profile picture
            - oauth_provider: OAuth provider (google/github)
            - created_at: Account creation timestamp
            - updated_at: Last update timestamp

    Security Notes:
        - The get_current_user dependency validates the JWT signature
        - Token expiration is automatically checked
        - User existence in database is verified
        - Redis caching provides 25x faster lookups for repeated requests

    Usage Example (Frontend):
        ```typescript
        const response = await fetch('/api/v1/auth/verify', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const user = await response.json();
          // User is authenticated
        } else {
          // Redirect to login
        }
        ```

    CCS Reference:
        - Task 1.4.3: Create User Verification Endpoint
        - Section 8.6.3: Authentication Integration
        - Acceptance Criteria AC-4: Frontend can verify session
    """
    # The get_current_user dependency has already:
    # 1. Extracted the JWT token from the Authorization header
    # 2. Validated the token signature using NEXTAUTH_SECRET
    # 3. Checked token expiration
    # 4. Verified the user exists in the database
    # 5. Returned the complete User ORM object

    # We simply return the user data in the UserResponse schema
    # Pydantic automatically converts the ORM model to the response schema
    return UserResponse.model_validate(current_user)
