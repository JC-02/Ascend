# ============================================
# Ascend AI - User Database Model
# ============================================
# SQLAlchemy model for users table
# Follows CCS database schema specification
# ============================================

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, UUIDMixin


class User(Base, UUIDMixin, TimestampMixin):
    """
    User model for OAuth-authenticated users.
    
    Follows CCS database schema:
    - id: UUID primary key
    - email: Unique email address
    - name: User's display name
    - avatar_url: Profile picture URL from OAuth provider
    - oauth_provider: 'google' or 'github'
    - oauth_id: Provider-specific user ID
    - created_at: Timestamp when user was created
    - updated_at: Timestamp when user was last updated
    """

    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String, nullable=True)
    oauth_provider: Mapped[str] = mapped_column(String(50), nullable=False)
    oauth_id: Mapped[str] = mapped_column(String(255), nullable=False)

    # Relationships
    resumes: Mapped[list["Resume"]] = relationship(
        "Resume", back_populates="user", cascade="all, delete-orphan"
    )
    interview_sessions: Mapped[list["InterviewSession"]] = relationship(
        "InterviewSession", back_populates="user", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email}, provider={self.oauth_provider})>"
