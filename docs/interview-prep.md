# Interview Preparation

## Technical concepts to understand

1. REST APIs and HTTP methods/status codes.
2. FastAPI dependency injection and request/response validation.
3. SQLAlchemy ORM, transactions, constraints, indexes, and pagination.
4. Alembic migrations and why schema changes should be versioned.
5. React state/effects and API-driven UI updates.
6. TypeScript interfaces and type-safe component props.
7. Unit vs integration vs end-to-end testing.
8. Deterministic seed data and reproducible tests.
9. Server-side filtering and pagination for a 10,000-row dataset.
10. Environment variables, CORS, deployment, and secrets management.

## Why these technologies

- FastAPI: small, typed Python API framework suited to CRUD and analytics.
- SQLAlchemy: explicit relational persistence without tying application logic directly to raw SQL.
- Alembic: versioned database schema changes.
- React + Vite + TypeScript: straightforward browser application with fast development feedback and static type checking.
- Material UI: accessible, reusable controls without spending the assessment on custom visual design.
- PostgreSQL in production: standard relational database choice; SQLite remains the lowest-friction local database explicitly permitted by the assessment.

## Important implementation decisions

- Modular monolith instead of microservices because the problem has low operational complexity and a single bounded domain.
- Server-side pagination/filtering rather than loading 10,000 employees into React.
- Current-salary model rather than salary-history model because the assessment asks to manage salary data, not compensation history.
- Static illustrative FX table rather than live FX integration because current rates are not part of the problem.
- No authentication because the pasted assessment does not require it; this is explicitly documented as a production gap.

## Likely interviewer questions

### Why did you choose a modular monolith?
The application has one domain, modest scale, and a small team/time constraint. Separating it into services would add deployment and operational complexity without solving a stated problem.

### Why PostgreSQL if SQLite is enough for 10,000 employees?
SQLite is perfectly adequate for the local assessment. PostgreSQL is the more conventional production relational database, so the application uses SQLite locally for simplicity while keeping the data layer PostgreSQL-compatible.

### Why paginate on the server?
A browser does not need 10,000 rows to render one page. Server-side pagination reduces transfer size and frontend work while also keeping filtering close to the database.

### Why static FX rates?
The assessment requires multi-country salary data and organizational questions, but does not require a live FX source. Static illustrative rates keep the comparison understandable and deterministic while avoiding an external runtime dependency.

### What would you add in a real HR product?
Authentication/SSO, RBAC, salary-change audit history, immutable payroll or finance integration boundaries, stronger privacy controls, encrypted sensitive data handling, structured audit logs, live FX policy where legally appropriate, and operational observability.

### What is the biggest trade-off?
The MVP is optimized for assessment scope rather than enterprise HR completeness. Authentication and audit history are intentionally absent and documented as follow-on requirements.

## Project presentation in about 60 seconds

> I built a modular-monolith salary management application for an HR Manager managing 10,000 employees across multiple countries. The React frontend talks to a FastAPI REST API backed by a relational database. The MVP supports employee search/filtering, pagination, salary updates, and salary analytics by country, department, and salary band. The seed data is deterministic so the test environment is reproducible. I used server-side filtering and pagination instead of sending all employee data to the browser, added validation and automated backend tests, and included a Playwright workflow for the main salary-update journey. I deliberately excluded payroll, authentication, live FX, and microservices because they were not required and would expand the scope without improving the assessment signal. The repository also includes requirements, architecture, trade-offs, AI usage, and deployment documentation.
