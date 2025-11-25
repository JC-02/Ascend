# ============================================
# Ascend AI - Session API Routes (Placeholder)
# ============================================
# Placeholder endpoints for Epic 2 implementation
# Story 2.2: Interview Session Creation
# ============================================

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse

from app.core.auth import get_current_user
from app.db.models.user import User

# ============================================
# Router Configuration
# ============================================
router = APIRouter(
    prefix="/sessions",
    tags=["Sessions"],
)


# ============================================
# Create Session Endpoint (Placeholder)
# ============================================
@router.post(
    "",
    status_code=status.HTTP_501_NOT_IMPLEMENTED,
    summary="Create Interview Session (Not Implemented)",
    description="""
    **This endpoint is not yet implemented.**

    This endpoint will be implemented in Epic 2, Story 2.2.

    **Planned Functionality:**
    - Accept job description and resume ID
    - Create interview session record
    - Trigger AI question generation workflow
    - Return session ID for polling

    **Returns:** 501 Not Implemented (for now)
    """,
)
async def create_session(
    current_user: User = Depends(get_current_user),
):
    """
    Create interview session endpoint placeholder.

    This endpoint is reserved for Epic 2 implementation.
    Returns 501 Not Implemented status.
    """
    return JSONResponse(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        content={
            "detail": "Session creation functionality will be implemented in Epic 2",
            "epic": "EPIC-2: Core Data Ingestion & Session Creation",
            "story": "STORY-2.2: Interview Session Creation",
            "status": "not_implemented",
        },
    )


# ============================================
# Get Session Endpoint (Placeholder)
# ============================================
@router.get(
    "/{session_id}",
    status_code=status.HTTP_501_NOT_IMPLEMENTED,
    summary="Get Session Details (Not Implemented)",
    description="""
    **This endpoint is not yet implemented.**

    This endpoint will be implemented in Epic 2, Story 2.2.

    **Planned Functionality:**
    - Retrieve session details by ID
    - Include generated questions
    - Show session status (processing/complete)
    - Authorization check (user owns session)

    **Returns:** 501 Not Implemented (for now)
    """,
)
async def get_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
):
    """
    Get session endpoint placeholder.

    Returns 501 Not Implemented status.
    """
    return JSONResponse(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        content={
            "detail": "Session retrieval functionality will be implemented in Epic 2",
            "epic": "EPIC-2: Core Data Ingestion & Session Creation",
            "story": "STORY-2.2: Interview Session Creation",
            "status": "not_implemented",
        },
    )


# ============================================
# List Sessions Endpoint (Placeholder)
# ============================================
@router.get(
    "",
    status_code=status.HTTP_501_NOT_IMPLEMENTED,
    summary="List User Sessions (Not Implemented)",
    description="""
    **This endpoint is not yet implemented.**

    This endpoint will be implemented in Epic 2.

    **Planned Functionality:**
    - List all sessions for authenticated user
    - Include session status and metadata
    - Support pagination and filtering

    **Returns:** 501 Not Implemented (for now)
    """,
)
async def list_sessions(
    current_user: User = Depends(get_current_user),
):
    """
    List sessions endpoint placeholder.

    Returns 501 Not Implemented status.
    """
    return JSONResponse(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        content={
            "detail": "Session listing functionality will be implemented in Epic 2",
            "epic": "EPIC-2: Core Data Ingestion & Session Creation",
            "status": "not_implemented",
        },
    )
