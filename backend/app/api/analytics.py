from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Employee
from app.schemas import AnalyticsSummary
from app.services.analytics import build_summary

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/summary", response_model=AnalyticsSummary)
def get_summary(country: str | None = Query(default=None, max_length=80), department: str | None = Query(default=None, max_length=80), db: Session = Depends(get_db)):
    query = select(Employee.country, Employee.department, Employee.salary_amount, Employee.currency)
    if country:
        query = query.where(Employee.country == country)
    if department:
        query = query.where(Employee.department == department)
    return build_summary(db.execute(query).all())
