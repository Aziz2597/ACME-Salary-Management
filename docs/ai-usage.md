# AI-Assisted Development Notes

This project is intended to satisfy the assessment requirement to use AI tools intentionally.

## Appropriate uses

- Generate an initial implementation skeleton after requirements were fixed.
- Review API schemas and validation rules.
- Generate candidate unit/integration test cases.
- Identify edge cases such as duplicate email/employee code and invalid salary/currency values.
- Review SQLAlchemy query structure and error handling.
- Improve documentation and README clarity.

## Human decisions to record during the assessment

The candidate should be able to explain these choices rather than treating generated code as authoritative:

1. The MVP scope is limited to current salary management and organizational compensation analytics.
2. The backend is a FastAPI modular monolith.
3. SQLite is used for easy local setup; PostgreSQL is supported for production.
4. Static FX conversion is deliberately used for deterministic assessment data.
5. Server-side pagination is used for employee listing.
6. Authentication, payroll, and other enterprise HR features are explicitly out of scope.

## Review rule

Every AI-generated change should be reviewed, run, and tested before being committed. The candidate should not commit code merely because an AI tool suggested it.
