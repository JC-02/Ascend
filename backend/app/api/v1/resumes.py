# ============================================
# Ascend AI - Resume API Routes (Placeholder)
# ============================================
# Placeholder endpoints for Epic 2 implementation
# Story 2.1: Resume Upload and Processing
# ============================================

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse

from app.core.auth import get_current_user
from app.db.models.user import User

# ============================================
# Router Configuration
# ============================================
router = APIRouter(
    prefix="/resumes",
    tags=["Resumes"],
)


# ============================================
# Resume Upload Endpoint (Placeholder)
# ============================================
@router.post(
    "",
    status_code=status.HTTP_501_NOT_IMPLEMENTED,
    summary="Upload Resume (Not Implemented)",
    description="""
    **This endpoint is not yet implemented.**

    This endpoint will be implemented in Epic 2, Story 2.1.

    **Planned Functionality:**
    - Accept PDF or DOCX resume files
    - Validate file size (max 5MB) and type
    - Store file in MinIO S3 storage
    - Create database record in `resumes` table
    - Trigger background parsing task

    **Returns:** 501 Not Implemented (for now)
    """,
)
async def upload_resume(
    current_user: User = Depends(get_current_user),
):
    """
    Upload resume endpoint placeholder.

    This endpoint is reserved for Epic 2 implementation.
    Returns 501 Not Implemented status.
    """
    return JSONResponse(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        content={
            "detail": "Resume upload functionality will be implemented in Epic 2",
            "epic": "EPIC-2: Core Data Ingestion & Session Creation",
            "story": "STORY-2.1: Resume Upload and Processing",
            "status": "not_implemented",
        },
    )


# ============================================
# List Resumes Endpoint (Placeholder)
# ============================================
@router.get(
    "",
    status_code=status.HTTP_501_NOT_IMPLEMENTED,
    summary="List User Resumes (Not Implemented)",
    description="""
    **This endpoint is not yet implemented.**

    This endpoint will be implemented in Epic 2.

    **Planned Functionality:**
    - List all resumes for the authenticated user
    - Include parsing status and metadata
    - Support pagination

    **Returns:** 501 Not Implemented (for now)
    """,
)
async def list_resumes(
    current_user: User = Depends(get_current_user),
):
    """
    List resumes endpoint placeholder.

    Returns 501 Not Implemented status.
    """
    return JSONResponse(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        content={
            "detail": "Resume listing functionality will be implemented in Epic 2",
            "epic": "EPIC-2: Core Data Ingestion & Session Creation",
            "status": "not_implemented",
        },
    )
