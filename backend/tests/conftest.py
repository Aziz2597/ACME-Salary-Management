from collections.abc import Generator
from decimal import Decimal
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import Session, sessionmaker
from app.db import Base, get_db
from app.main import app
from app.models import Employee

@pytest.fixture()
def db_session() -> Generator[Session, None, None]:
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    Base.metadata.create_all(engine)
    SessionTest = sessionmaker(bind=engine, expire_on_commit=False)
    session = SessionTest()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(engine)
        engine.dispose()

@pytest.fixture()
def client(db_session: Session) -> Generator[TestClient, None, None]:
    def override_get_db():
        yield db_session
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

@pytest.fixture()
def employees(db_session: Session) -> list[Employee]:
    rows = [Employee(employee_code="E00001", first_name="Aarav", last_name="Khan", email="aarav.khan@example.com", country="India", department="Engineering", job_title="Software Engineer", salary_amount=Decimal("2000000.00"), currency="INR"), Employee(employee_code="E00002", first_name="Alex", last_name="Smith", email="alex.smith@example.com", country="United States", department="Finance", job_title="Financial Analyst", salary_amount=Decimal("100000.00"), currency="USD")]
    db_session.add_all(rows)
    db_session.commit()
    return rows
