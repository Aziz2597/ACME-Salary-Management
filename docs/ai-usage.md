# AI-Assisted Development Notes

AI tools were used as development assistants throughout the project. Generated suggestions were treated as drafts and were reviewed, adapted, implemented, and verified by the developer.

## Appropriate uses

- Generate an initial implementation skeleton after the requirements and MVP scope were fixed.
- Review API schemas and validation rules.
- Generate candidate unit, integration, and end-to-end test cases.
- Identify edge cases such as duplicate employee codes/emails and invalid salary or currency values.
- Review SQLAlchemy query structure and error handling.
- Assist with documentation and README clarity.
- Diagnose development and deployment issues, including frontend/API integration, CORS configuration, and PostgreSQL/psycopg3 compatibility.

## Human decisions

The following decisions were made deliberately rather than being accepted as defaults from generated code:

1. The MVP is limited to current salary management and organizational compensation analytics.
2. The backend is a FastAPI modular monolith.
3. SQLite is used for simple local development and PostgreSQL is used for the deployed environment.
4. Static FX conversion is used to keep the assessment dataset deterministic and self-contained.
5. Employee listing uses server-side pagination, filtering, and sorting.
6. Authentication, payroll, employee self-service, salary history, live FX, notifications, mobile applications, and microservices are outside the MVP scope.
7. Analytics are calculated from the assessment-sized dataset in Python rather than introducing database-specific aggregation functions for median calculations.

## Validation rule

AI-generated code was not treated as authoritative. Changes were reviewed against the requirements, executed locally, and tested before being retained in the project.

The final implementation and its tests are the source of truth; AI suggestions that conflicted with the requirements or introduced unnecessary complexity were not used.