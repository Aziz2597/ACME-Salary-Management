from collections import defaultdict
from decimal import Decimal, ROUND_HALF_UP
from statistics import median

from app.core.fx import salary_band, to_usd

ZERO = Decimal("0.00")


def money(value: Decimal | float | int) -> Decimal:
    return Decimal(str(value)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def calculate_median(values: list[Decimal]) -> Decimal:
    if not values:
        return ZERO
    return money(median(values))


def build_summary(rows: list[tuple[str, str, Decimal, str]]) -> dict:
    if not rows:
        return {
            "employee_count": 0,
            "average_salary_usd": ZERO,
            "median_salary_usd": ZERO,
            "min_salary_usd": ZERO,
            "max_salary_usd": ZERO,
            "by_country": [],
            "by_department": [],
            "salary_bands": [{"label": label, "employee_count": 0} for label in ["< $50k", "$50k–$100k", "$100k–$150k", "$150k+"]],
            "reporting_currency": "USD",
            "reporting_note": "USD values use fixed illustrative conversion rates for the assessment dataset.",
        }

    salary_values = [to_usd(salary, currency) for _, _, salary, currency in rows]
    country_values: dict[str, list[Decimal]] = defaultdict(list)
    department_values: dict[str, list[Decimal]] = defaultdict(list)
    band_counts: dict[str, int] = defaultdict(int)

    for (country, department, _salary, _currency), usd_value in zip(rows, salary_values):
        country_values[country].append(usd_value)
        department_values[department].append(usd_value)
        band_counts[salary_band(usd_value)] += 1

    def breakdown(values: dict[str, list[Decimal]]) -> list[dict]:
        result = []
        for label, group in values.items():
            result.append({"label": label, "employee_count": len(group), "average_salary_usd": money(sum(group, ZERO) / len(group))})
        result.sort(key=lambda item: item["average_salary_usd"], reverse=True)
        return result

    bands = ["< $50k", "$50k–$100k", "$100k–$150k", "$150k+"]
    return {
        "employee_count": len(salary_values),
        "average_salary_usd": money(sum(salary_values, ZERO) / len(salary_values)),
        "median_salary_usd": calculate_median(salary_values),
        "min_salary_usd": min(salary_values),
        "max_salary_usd": max(salary_values),
        "by_country": breakdown(country_values),
        "by_department": breakdown(department_values),
        "salary_bands": [{"label": label, "employee_count": band_counts.get(label, 0)} for label in bands],
        "reporting_currency": "USD",
        "reporting_note": "USD values use fixed illustrative conversion rates for the assessment dataset.",
    }
