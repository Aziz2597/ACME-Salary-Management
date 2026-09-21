import argparse
import random
from datetime import date
from decimal import Decimal

from sqlalchemy import delete, func, insert, select

from app.core.fx import CURRENCY_TO_USD
from app.db import SessionLocal
from app.models import Employee

FIRST_NAMES = ["Aarav", "Aisha", "Alex", "Amelia", "Arjun", "Daniel", "Elena", "Ethan", "Fatima", "Grace", "Hannah", "Henry", "Ibrahim", "Isla", "Jacob", "James", "Leah", "Liam", "Lucas", "Maya", "Mia", "Noah", "Oliver", "Priya", "Rohan", "Sara", "Sophia", "Thomas", "William", "Zoya"]
LAST_NAMES = ["Adams", "Baker", "Brown", "Campbell", "Carter", "Choudhary", "Clark", "Davis", "Evans", "Foster", "Garcia", "Gupta", "Hall", "Harris", "Hughes", "Johnson", "Khan", "Kumar", "Lewis", "Martin", "Miller", "Patel", "Roberts", "Shah", "Singh", "Smith", "Taylor", "Thomas", "Turner", "Wilson"]
COUNTRIES = [("India", "INR", 900_000, 5_000_000), ("United States", "USD", 50_000, 250_000), ("United Kingdom", "GBP", 35_000, 160_000), ("Germany", "EUR", 40_000, 180_000), ("Canada", "CAD", 50_000, 180_000), ("Australia", "AUD", 55_000, 220_000), ("Singapore", "SGD", 60_000, 240_000)]
DEPARTMENTS = {"Engineering": ["Software Engineer", "Senior Software Engineer", "Engineering Manager", "QA Engineer"], "Finance": ["Financial Analyst", "Finance Manager", "Accountant", "Controller"], "Human Resources": ["HR Specialist", "HR Manager", "Recruiter", "People Operations Partner"], "Sales": ["Sales Representative", "Account Executive", "Sales Manager", "Sales Director"], "Marketing": ["Marketing Specialist", "Content Strategist", "Marketing Manager", "Brand Manager"], "Operations": ["Operations Analyst", "Operations Manager", "Program Manager", "Operations Specialist"]}
SEED = 20260921
DEFAULT_COUNT = 10_000


def build_rows(count: int = DEFAULT_COUNT) -> list[dict]:
    rng = random.Random(SEED)
    rows = []
    departments = list(DEPARTMENTS)
    for index in range(1, count + 1):
        country, currency, low, high = COUNTRIES[(index - 1) % len(COUNTRIES)]
        department = departments[(index * 7) % len(departments)]
        job_title = rng.choice(DEPARTMENTS[department])
        first_name = FIRST_NAMES[(index * 3) % len(FIRST_NAMES)]
        last_name = LAST_NAMES[(index * 5) % len(LAST_NAMES)]
        salary = Decimal(rng.randrange(low, high + 1)).quantize(Decimal("0.01"))
        employee_code = f"E{index:05d}"
        email = f"{first_name.lower()}.{last_name.lower()}.{index}@acme.example"
        rows.append({"employee_code": employee_code, "first_name": first_name, "last_name": last_name, "email": email, "country": country, "department": department, "job_title": job_title, "salary_amount": salary, "currency": currency})
    return rows


def seed(force: bool = False, count: int = DEFAULT_COUNT) -> None:
    with SessionLocal.begin() as db:
        existing = db.scalar(select(func.count()).select_from(Employee)) or 0
        if existing and not force:
            raise SystemExit(f"Database already contains {existing} employees. Use --force to replace the seed dataset.")
        if force:
            db.execute(delete(Employee))
        db.execute(insert(Employee), build_rows(count))
        print(f"Seeded {count} employees.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed the ACME salary database.")
    parser.add_argument("--force", action="store_true", help="Delete existing employees before seeding.")
    parser.add_argument("--count", type=int, default=DEFAULT_COUNT, help="Number of employees to generate.")
    args = parser.parse_args()
    if args.count <= 0 or args.count > 100_000:
        raise SystemExit("count must be between 1 and 100000")
    unknown_currency = set(currency for _, currency, _, _ in COUNTRIES) - set(CURRENCY_TO_USD)
    if unknown_currency:
        raise SystemExit(f"Missing FX rates for: {sorted(unknown_currency)}")
    seed(force=args.force, count=args.count)
