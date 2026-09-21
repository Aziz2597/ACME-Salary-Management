from decimal import Decimal, ROUND_HALF_UP

CURRENCY_TO_USD: dict[str, Decimal] = {
    "USD": Decimal("1.0000"),
    "INR": Decimal("0.0119"),
    "EUR": Decimal("1.0800"),
    "GBP": Decimal("1.2700"),
    "CAD": Decimal("0.7400"),
    "AUD": Decimal("0.6500"),
    "SGD": Decimal("0.7400"),
}


def to_usd(amount: Decimal, currency: str) -> Decimal:
    try:
        rate = CURRENCY_TO_USD[currency.upper()]
    except KeyError as exc:
        raise ValueError(f"Unsupported currency: {currency}") from exc
    return (amount * rate).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def salary_band(amount_usd: Decimal) -> str:
    if amount_usd < Decimal("50000"):
        return "< $50k"
    if amount_usd < Decimal("100000"):
        return "$50k–$100k"
    if amount_usd < Decimal("150000"):
        return "$100k–$150k"
    return "$150k+"
