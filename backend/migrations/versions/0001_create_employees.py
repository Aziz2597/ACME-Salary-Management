"""create employees table

Revision ID: 0001_create_employees
Revises:
Create Date: 2026-09-21
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
revision: str = "0001_create_employees"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table("employees", sa.Column("id", sa.Integer(), nullable=False), sa.Column("employee_code", sa.String(length=10), nullable=False), sa.Column("first_name", sa.String(length=80), nullable=False), sa.Column("last_name", sa.String(length=80), nullable=False), sa.Column("email", sa.String(length=160), nullable=False), sa.Column("country", sa.String(length=80), nullable=False), sa.Column("department", sa.String(length=80), nullable=False), sa.Column("job_title", sa.String(length=120), nullable=False), sa.Column("salary_amount", sa.Numeric(precision=14, scale=2), nullable=False), sa.Column("currency", sa.String(length=3), nullable=False), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False), sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False), sa.CheckConstraint("salary_amount > 0", name="ck_employee_salary_positive"), sa.PrimaryKeyConstraint("id"), sa.UniqueConstraint("employee_code"), sa.UniqueConstraint("email"))
    op.create_index("ix_employees_employee_code", "employees", ["employee_code"], unique=False)
    op.create_index("ix_employees_email", "employees", ["email"], unique=False)
    op.create_index("ix_employees_country", "employees", ["country"], unique=False)
    op.create_index("ix_employees_department", "employees", ["department"], unique=False)
    op.create_index("ix_employees_country_department", "employees", ["country", "department"], unique=False)

def downgrade() -> None:
    op.drop_index("ix_employees_country_department", table_name="employees")
    op.drop_index("ix_employees_department", table_name="employees")
    op.drop_index("ix_employees_country", table_name="employees")
    op.drop_index("ix_employees_email", table_name="employees")
    op.drop_index("ix_employees_employee_code", table_name="employees")
    op.drop_table("employees")
