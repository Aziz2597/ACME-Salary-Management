# Assessment Compliance Matrix

## Mandatory requirements

| Assessment requirement | Implementation | Verification |
| --- | --- | --- |
| One-page requirements document before development | `docs/requirements.md` | Requirements document |
| End-to-end software with backend and UI | FastAPI backend + React frontend | Local and deployed application |
| Relational database | SQLite locally, PostgreSQL in deployment | Alembic migration + API tests + deployed API |
| ReactJS/NextJS UI | React + TypeScript + Material UI | `frontend/` |
| Seed 10,000 employees | Deterministic seed script | Production database contains 10,000 seeded employees |
| Fully functional deployed software | Vercel frontend + Render backend + PostgreSQL | Public deployment smoke test |
| Video demo | `docs/demo.md` provides the demo script | Final recording |
| Meaningful unit tests | Analytics/service tests and API tests | `pytest`: 12 passed |
| Fast/deterministic/easy tests | SQLite-backed tests and deterministic seed/test data | `pytest` |
| Incremental development evidence | Git repository history contains the initial implementation and subsequent PostgreSQL/deployment compatibility fixes | `git log` |
| Artifacts supporting engineering thinking | Requirements, architecture, trade-offs, AI usage, runbook, verification, and demo documentation | `docs/` |

## Supporting product features

- Search, filtering, sorting, and server-side pagination make the 10,000-employee dataset usable without downloading all records into the browser.
- Salary analytics directly addresses the requirement to answer questions about how the organization pays people.
- Validation, uniqueness constraints, API error handling, and CORS configuration support reliable operation.
- Static illustrative FX rates provide deterministic cross-country salary comparison without a live external dependency.

## Deliberately excluded

Payroll execution, tax calculations, benefits, employee self-service, authentication/SSO/RBAC, salary history/audit trail, real-time FX, notifications, mobile applications, microservices, and an AI chatbot are outside the stated MVP scope.

These exclusions are documented in `requirements.md` and `trade-offs.md`.