from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.core.fx import CURRENCY_TO_USD


class EmployeeCreate(BaseModel):
    employee_code: str = Field(pattern=r"^E\d{5}$", min_length=6, max_length=6)
    first_name: str = Field(min_length=1, max_length=80)
    last_name: str = Field(min_length=1, max_length=80)
    email: EmailStr
    country: str = Field(min_length=2, max_length=80)
    department: str = Field(min_length=2, max_length=80)
    job_title: str = Field(min_length=2, max_length=120)
    salary_amount: Decimal = Field(gt=0, max_digits=14, decimal_places=2)
    currency: str = Field(pattern=r"^[A-Z]{3}$", min_length=3, max_length=3)

    @field_validator(
        "first_name", "last_name", "country", "department", "job_title", mode="before"
    )
    @classmethod
    def strip_text(cls, value: str) -> str:
        return value.strip()

    @field_validator("currency", mode="before")
    @classmethod
    def normalize_currency(cls, value: str) -> str:
        normalized = value.strip().upper()
        if normalized not in CURRENCY_TO_USD:
            raise ValueError(f"Unsupported currency: {normalized}")
        return normalized


class EmployeeUpdate(BaseModel):
    first_name: str | None = Field(default=None, min_length=1, max_length=80)
    last_name: str | None = Field(default=None, min_length=1, max_length=80)
    email: EmailStr | None = None
    country: str | None = Field(default=None, min_length=2, max_length=80)
    department: str | None = Field(default=None, min_length=2, max_length=80)
    job_title: str | None = Field(default=None, min_length=2, max_length=120)
    salary_amount: Decimal | None = Field(
        default=None, gt=0, max_digits=14, decimal_places=2
    )
    currency: str | None = Field(
        default=None, min_length=3, max_length=3, pattern=r"^[A-Z]{3}$"
    )

    @field_validator(
        "first_name", "last_name", "country", "department", "job_title", mode="before"
    )
    @classmethod
    def strip_text(cls, value: str | None) -> str | None:
        return value.strip() if value is not None else value

    @field_validator("currency", mode="before")
    @classmethod
    def normalize_currency(cls, value: str | None) -> str | None:
        if value is None:
            return value
        normalized = value.strip().upper()
        if normalized not in CURRENCY_TO_USD:
            raise ValueError(f"Unsupported currency: {normalized}")
        return normalized


class EmployeeRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    employee_code: str
    first_name: str
    last_name: str
    email: EmailStr
    country: str
    department: str
    job_title: str
    salary_amount: Decimal
    currency: str
    salary_usd: Decimal
    created_at: datetime
    updated_at: datetime


class EmployeeListResponse(BaseModel):
    items: list[EmployeeRead]
    page: int
    page_size: int
    total: int


class OptionResponse(BaseModel):
    countries: list[str]
    departments: list[str]


class SalaryBreakdownItem(BaseModel):
    label: str
    employee_count: int
    average_salary_usd: Decimal


class SalaryBandItem(BaseModel):
    label: str
    employee_count: int


class AnalyticsSummary(BaseModel):
    employee_count: int
    average_salary_usd: Decimal
    median_salary_usd: Decimal
    min_salary_usd: Decimal
    max_salary_usd: Decimal
    by_country: list[SalaryBreakdownItem]
    by_department: list[SalaryBreakdownItem]
    salary_bands: list[SalaryBandItem]
    reporting_currency: str = "USD"
    reporting_note: str
