from decimal import Decimal
from app.core.fx import salary_band, to_usd
from app.services.analytics import build_summary, calculate_median

def test_currency_conversion_uses_fixed_reporting_rate():
    assert to_usd(Decimal("100000"), "USD") == Decimal("100000.00")
    assert to_usd(Decimal("100000"), "INR") == Decimal("1190.00")

def test_salary_band_boundaries():
    assert salary_band(Decimal("49999.99")) == "< $50k"
    assert salary_band(Decimal("50000.00")) == "$50k–$100k"
    assert salary_band(Decimal("100000.00")) == "$100k–$150k"
    assert salary_band(Decimal("150000.00")) == "$150k+"

def test_median():
    assert calculate_median([Decimal("10"), Decimal("30"), Decimal("20")]) == Decimal("20.00")
    assert calculate_median([Decimal("10"), Decimal("20")]) == Decimal("15.00")
    assert calculate_median([]) == Decimal("0.00")

def test_build_summary_groups_by_country_and_department():
    rows = [("India", "Engineering", Decimal("1000000"), "INR"), ("India", "Engineering", Decimal("2000000"), "INR"), ("United States", "Finance", Decimal("100000"), "USD")]
    summary = build_summary(rows)
    assert summary["employee_count"] == 3
    assert len(summary["by_country"]) == 2
    assert len(summary["by_department"]) == 2
    assert sum(item["employee_count"] for item in summary["salary_bands"]) == 3
