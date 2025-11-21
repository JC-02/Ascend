# ============================================
# Ascend AI - Resume Database Model
# ============================================
# SQLAlchemy model for resumes table
# Follows CCS database schema specification
# ============================================

import uuid

from sqlalchemy import CheckConstraint, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, UUIDMixin, TimestampMixin


class Resume(Base, UUIDMixin, TimestampMixin):
    """
    Resume model for uploaded resume files.
    
    Follows CCS database schema:
    - id: UUID primary key
    - user_id: Foreign key to users table
    - storage_path: Relative path in MinIO
    - original_filename: Original filename from upload
    - file_size_bytes: File size in bytes
    - mime_type: MIME type (application/pdf or application/vnd...)
    - parsed_text: Extracted text from PDF/DOCX
    - parsing_status: 'pending', 'processing', 'complete', 'failed'
    - created_at: Timestamp when resume was uploaded
    """

    __tablename__ = "resumes"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    storage_path: Mapped[str] = mapped_column(Text, nullable=False)
    original_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    file_size_bytes: Mapped[int] = mapped_column(Integer, nullable=False)
    mime_type: Mapped[str] = mapped_column(String(100), nullable=False)
    parsed_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    parsing_status: Mapped[str] = mapped_column(
        String(50), nullable=False, default="pending"
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="resumes")
    interview_sessions: Mapped[list["InterviewSession"]] = relationship(
        "InterviewSession", back_populates="resume"
    )

    # Constraints
    __table_args__ = (
        CheckConstraint(
            "file_size_bytes > 0 AND file_size_bytes <= 5242880",
            name="resumes_file_size_check",
        ),
        CheckConstraint(
            "parsing_status IN ('pending', 'processing', 'complete', 'failed')",
            name="resumes_parsing_status_check",
        ),
    )

    def __repr__(self) -> str:
        return f"<Resume(id={self.id}, filename={self.original_filename}, status={self.parsing_status})>"
