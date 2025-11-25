# ============================================
# Ascend AI - SQLAlchemy Base Model
# ============================================
# Base class for all database models
# Provides UUID primary keys and timestamps
# ============================================

import uuid
from datetime import datetime

from sqlalchemy import DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """
    Base class for all database models.
    Provides common columns and functionality.
    """

    pass


class TimestampMixin:
    """
    Mixin to add created_at and updated_at timestamps to models.
    """

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )


class UUIDMixin:
    """
    Mixin to add UUID primary key to models.
    """

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
