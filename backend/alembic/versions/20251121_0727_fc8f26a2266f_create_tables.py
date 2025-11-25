"""create tables

Revision ID: fc8f26a2266f
Revises: fb15e9deacff
Create Date: 2024-11-21 07:27:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'fc8f26a2266f'
down_revision = 'fb15e9deacff'
branch_labels = None
depends_on = None


def upgrade():
    # Tables already created in earlier migration (d6cc5906827a)
    # Only add any NEW tables or modifications here
    pass


def downgrade():
    pass
