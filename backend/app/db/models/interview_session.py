# ============================================
# Ascend AI - Interview Session Database Model
# ============================================
# SQLAlchemy model for interview_sessions table
# Follows CCS database schema specification
# ============================================

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from app.db.models.resume import Resume
    from app.db.models.user import User


class InterviewSession(Base, UUIDMixin, TimestampMixin):
    """
    Interview session model for storing mock interview data.

    Follows CCS database schema:
    - id: UUID primary key
    - user_id: Foreign key to users table
    - resume_id: Foreign key to resumes table (optional)
    - job_description: Job description for interview prep
    - generated_questions: JSONB array of generated questions
    - question_count: Number of questions generated
    - status: 'pending', 'processing', 'complete', 'failed'
    - created_at: Timestamp when session was created
    - updated_at: Timestamp when session was last updated
    """

    __tablename__ = "interview_sessions"

    # Foreign Keys
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    resume_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("resumes.id", ondelete="SET NULL"), nullable=True
    )

    # Session Data
    job_description: Mapped[str] = mapped_column(Text, nullable=False)
    generated_questions: Mapped[dict] = mapped_column(JSONB, nullable=True, default=[])
    question_count: Mapped[int] = mapped_column(Integer, nullable=False, default=5)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="pending", index=True)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="interview_sessions")
    resume: Mapped["Resume"] = relationship("Resume", back_populates="interview_sessions")

    # Constraints
    __table_args__ = (
        CheckConstraint(
            "status IN ('pending', 'processing', 'complete', 'failed')",
            name="sessions_status_check",
        ),
        CheckConstraint(
            "char_length(job_description) >= 50 AND char_length(job_description) <= 5000",
            name="sessions_jd_length_check",
        ),
        CheckConstraint(
            "question_count >= 0 AND question_count <= 10", name="sessions_question_count_check"
        ),
    )

    def __repr__(self) -> str:
        return f"<InterviewSession(id={self.id}, user_id={self.user_id}, status={self.status})>"
