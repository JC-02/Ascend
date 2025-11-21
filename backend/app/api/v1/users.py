# ============================================
# Ascend AI - User Management API Routes
# ============================================
# User creation and retrieval endpoints for OAuth flow
# Story 1.4, Task 1.4.4 (NextAuth Integration)
# ============================================

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.user import User
from app.db.session import get_db
from app.schemas.user import UserCreate, UserResponse

# ============================================
# Router Configuration
# ============================================
router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


# ============================================
# User Creation/Retrieval Endpoint
# ============================================
@router.post(
    "",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Create or Retrieve User",
    description="""
    Creates a new user or retrieves an existing user during OAuth flow.

    This endpoint is called by NextAuth during the JWT callback to ensure
    that every authenticated OAuth user has a corresponding record in our database.

    **Authentication Required:** No (called during auth flow before JWT is issued)

    **Behavior:**
    - If a user with the given email already exists, returns the existing user
    - If no user exists, creates a new user with the provided OAuth data
    - Updates user information if OAuth data has changed

    **Returns:** Complete user profile with UUID, email, name, avatar, and timestamps

    **Errors:**
    - 400 Bad Request: Invalid input data
    - 500 Internal Server Error: Database error
    """,
)
async def create_or_get_user(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    """
    Create a new user or retrieve existing user during OAuth authentication.

    This endpoint implements an "upsert" pattern:
    1. Check if user with email already exists
    2. If exists, return existing user (optionally update fields)
    3. If not exists, create new user

    Args:
        user_data: UserCreate schema with OAuth user information
        db: Database session injected by FastAPI dependency

    Returns:
        UserResponse: Complete user profile data

    Raises:
        HTTPException: If database operation fails

    Security Notes:
        - This endpoint is public (no JWT required) as it's called DURING auth flow
        - OAuth provider validation happens in NextAuth before this endpoint is called
        - Email uniqueness is enforced at database level

    Usage (from NextAuth jwt callback):
        ```typescript
        const response = await fetch('/api/v1/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            oauth_provider: account.provider,
            oauth_id: account.providerAccountId,
          }),
        });
        ```

    CCS Reference:
        - Story 1.4: User Authentication
        - Task 1.4.4: Configure NextAuth.js
        - Acceptance Criteria AC-2: User created or retrieved on login
    """
    try:
        # Check if user already exists by email
        stmt = select(User).where(User.email == user_data.email)
        result = await db.execute(stmt)
        existing_user = result.scalar_one_or_none()

        if existing_user:
            # User exists - optionally update their info if it changed
            updated = False

            if existing_user.name != user_data.name and user_data.name:
                existing_user.name = user_data.name
                updated = True

            if existing_user.avatar_url != str(user_data.avatar_url) and user_data.avatar_url:
                existing_user.avatar_url = str(user_data.avatar_url)
                updated = True

            if updated:
                await db.commit()
                await db.refresh(existing_user)

            return UserResponse.model_validate(existing_user)

        # User doesn't exist - create new user
        new_user = User(
            email=user_data.email,
            name=user_data.name,
            avatar_url=str(user_data.avatar_url) if user_data.avatar_url else None,
            oauth_provider=user_data.oauth_provider,
            oauth_id=user_data.oauth_id,
        )

        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)

        return UserResponse.model_validate(new_user)

    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create or retrieve user: {str(e)}"
        ) from e
