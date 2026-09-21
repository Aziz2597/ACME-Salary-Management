from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Employee
from app.schemas import OptionResponse

router = APIRouter(prefix="/meta", tags=["meta"])


@router.get("/options", response_model=OptionResponse)
def get_options(db: Session = Depends(get_db)):
    countries = db.scalars(select(Employee.country).distinct().order_by(Employee.country)).all()
    departments = db.scalars(select(Employee.department).distinct().order_by(Employee.department)).all()
    return OptionResponse(countries=countries, departments=departments)
