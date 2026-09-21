from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import asc, desc, func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.fx import to_usd
from app.db import get_db
from app.models import Employee
from app.schemas import EmployeeCreate, EmployeeListResponse, EmployeeRead, EmployeeUpdate

router = APIRouter(prefix="/employees", tags=["employees"])

SORT_FIELDS = {
    "employee_code": Employee.employee_code,
    "first_name": Employee.first_name,
    "country": Employee.country,
    "department": Employee.department,
    "salary_amount": Employee.salary_amount,
}


def to_read(employee: Employee) -> EmployeeRead:
    return EmployeeRead.model_validate({
        "id": employee.id,
        "employee_code": employee.employee_code,
        "first_name": employee.first_name,
        "last_name": employee.last_name,
        "email": employee.email,
        "country": employee.country,
        "department": employee.department,
        "job_title": employee.job_title,
        "salary_amount": employee.salary_amount,
        "currency": employee.currency,
        "salary_usd": to_usd(employee.salary_amount, employee.currency),
        "created_at": employee.created_at,
        "updated_at": employee.updated_at,
    })


@router.get("", response_model=EmployeeListResponse)
def list_employees(
    q: str | None = Query(default=None, max_length=100),
    country: str | None = Query(default=None, max_length=80),
    department: str | None = Query(default=None, max_length=80),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=25, ge=1, le=100),
    sort_by: Literal["employee_code", "first_name", "country", "department", "salary_amount"] = "employee_code",
    sort_order: Literal["asc", "desc"] = "asc",
    db: Session = Depends(get_db),
):
    filters = []
    if q:
        search = f"%{q.strip()}%"
        filters.append(or_(Employee.employee_code.ilike(search), Employee.first_name.ilike(search), Employee.last_name.ilike(search), Employee.email.ilike(search), Employee.job_title.ilike(search)))
    if country:
        filters.append(Employee.country == country)
    if department:
        filters.append(Employee.department == department)

    base_query = select(Employee).where(*filters)
    count_query = select(func.count()).select_from(Employee).where(*filters)
    total = db.scalar(count_query) or 0

    sort_column = SORT_FIELDS[sort_by]
    order_by = desc(sort_column) if sort_order == "desc" else asc(sort_column)
    rows = db.scalars(base_query.order_by(order_by).offset((page - 1) * page_size).limit(page_size)).all()

    return EmployeeListResponse(items=[to_read(employee) for employee in rows], page=page, page_size=page_size, total=total)


@router.get("/{employee_id}", response_model=EmployeeRead)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.get(Employee, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return to_read(employee)


@router.post("", response_model=EmployeeRead, status_code=status.HTTP_201_CREATED)
def create_employee(payload: EmployeeCreate, db: Session = Depends(get_db)):
    employee = Employee(**payload.model_dump())
    db.add(employee)
    try:
        db.commit()
        db.refresh(employee)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Employee code or email already exists") from exc
    return to_read(employee)


@router.patch("/{employee_id}", response_model=EmployeeRead)
def update_employee(employee_id: int, payload: EmployeeUpdate, db: Session = Depends(get_db)):
    employee = db.get(Employee, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    changes = payload.model_dump(exclude_unset=True)
    for field, value in changes.items():
        setattr(employee, field, value)

    try:
        db.commit()
        db.refresh(employee)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists") from exc
    return to_read(employee)
