# Assessment Compliance Matrix

## Mandatory requirements

| Assessment requirement | Implementation | Verification |
| --- | --- | --- |
| One-page requirements document before development | `docs/requirements.md` | Review document and Git history |
| End-to-end software with backend and UI | FastAPI backend + React frontend | Local run + deployment steps |
| Relational database | SQLite locally, PostgreSQL-compatible production config | Alembic migration + API tests |
| ReactJS/NextJS UI | React + TypeScript + MUI | `frontend/` |
| Seed 10,000 employees | Deterministic seed script | DB count = 10,000 |
| Fully functional deployed software | Deployment-ready frontend/backend/database configuration | Candidate must perform external deployment and record URLs |
| Video demo | `docs/demo.md` provides the exact 3–5 minute script | Candidate records it after deployment |
| Meaningful unit tests | Analytics and salary business logic tests | `backend/tests/test_analytics_service.py` |
| Fast/deterministic/easy tests | Pure analytics tests + SQLite-backed API tests | `pytest` |
| Incremental commits | `docs/git-plan.md` defines commit sequence | Candidate makes commits under their own Git identity |
| Artifacts supporting thinking | Requirements, architecture, trade-offs, AI usage, runbook | `docs/` |

## Explicitly optional / suggested artifacts

The assessment says artifacts *might include* planning/design notes, architecture diagrams, AI prompts/instructions, trade-off explanations, and performance considerations. These are therefore not separate product requirements, but they are useful evidence of the requested thinking process. This project includes equivalent Markdown artifacts for each.

## Supporting features kept intentionally small

- Search, filtering, sorting, and pagination make 10,000 employees usable without sending all rows to the browser.
- A small salary analytics dashboard directly addresses the requirement to answer questions about how the organization pays people.
- Validation, duplicate protection, API error handling, and CORS configuration support reliability.
- Static illustrative FX rates allow cross-country salary comparison without introducing an external live-data dependency.

## Deliberately excluded

Payroll execution, tax calculations, benefits, employee self-service, authentication/SSO/RBAC, salary history/audit trail, real-time FX, notifications, mobile apps, microservices, and AI features are not stated requirements and are therefore excluded from the MVP.
