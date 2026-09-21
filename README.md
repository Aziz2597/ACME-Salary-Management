# ACME Salary Management

A focused full-stack salary management application for an HR Manager managing compensation data for 10,000 employees across multiple countries.

## Assessment scope

This implementation is intentionally aligned to the assessment statement: employee salary management, salary-oriented organizational analysis, 10,000 seeded employees, a React UI, a Python backend, relational persistence, automated tests, documentation, and deployment readiness.

It does **not** add payroll processing, employee self-service, SSO/RBAC, live FX feeds, notifications, or microservices because those are outside the stated assessment scope.

## Features

- Employee directory with search, country/department filters, sorting, and pagination.
- Create and update employee salary records.
- Salary dashboard with total employees, average, median, minimum, and maximum reporting-currency salary.
- Salary breakdowns by country and department.
- Salary distribution bands.
- Deterministic seed script for 10,000 employees.
- REST API with validation and automatic OpenAPI documentation.
- Unit and API integration tests with pytest.
- Playwright end-to-end test for the primary salary-update workflow.
- Local SQLite development database and PostgreSQL-compatible production configuration.

## Technology stack

- Backend: Python 3.13, FastAPI, SQLAlchemy 2, Alembic, Pydantic Settings, pytest.
- Frontend: React 19, TypeScript, Vite, Material UI.
- Testing: pytest + FastAPI TestClient + Playwright.
- Production database: PostgreSQL.
- Local database: SQLite (the assessment explicitly allows SQLite).

Dependency versions are pinned in `backend/requirements.txt` and `frontend/package.json`. Current package releases were checked against their official package registries on September 21, 2026.

## Architecture

```text
React + Material UI
        |
        | HTTP/JSON
        v
FastAPI REST API
        |
        | SQLAlchemy
        v
Relational DB
SQLite locally / PostgreSQL in production
```

The backend is a modular monolith. The application is small enough that microservices would add operational complexity without solving a stated problem.

## Repository structure

```text
backend/
  app/
    api/          REST endpoints
    core/         settings and currency conversion
    services/     business logic
    models.py     database model
    schemas.py    API schemas
    db.py         database configuration
    main.py       application entry point
  migrations/    Alembic migrations
  app/seed/      deterministic 10,000-row seed script
  tests/         unit and integration tests
frontend/
  src/            React application
  tests/          Playwright E2E tests
docs/              requirements, architecture, trade-offs, AI usage
```

## Prerequisites

- Python 3.13 recommended (Python 3.10+ is supported by FastAPI, but this repository targets 3.13).
- Node.js 22 LTS or 24 LTS. Vite 8 requires Node.js 20.19+ or 22.12+.
- Git.
- Docker is **not** required for local development.

Verify:

```bash
python --version
node --version
npm --version
git --version
```

## Backend setup

From `backend/`:

### Windows PowerShell

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
alembic upgrade head
python -m app.seed.seed_data
uvicorn app.main:app --reload --port 8000
```

### macOS/Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
python -m app.seed.seed_data
uvicorn app.main:app --reload --port 8000
```

The API will be at `http://localhost:8000`.

Interactive API docs are available at `http://localhost:8000/docs`.

Health check: `http://localhost:8000/api/health`.

## Frontend setup

From `frontend/`:

```bash
npm install
```

Create `.env` from the example:

```text
VITE_API_BASE_URL=http://localhost:8000/api
```

Then run:

```bash
npm run dev
```

The UI will be available at `http://localhost:5173`.

## Run tests

### Backend

From `backend/` with the virtual environment active:

```bash
pytest
```

### Frontend type-check/build

From `frontend/`:

```bash
npm run build
```

### Playwright end-to-end test

Start the backend and frontend first, then from `frontend/`:

```bash
npx playwright install chromium
npm run e2e
```

The E2E test expects the backend at `http://localhost:8000` and the frontend at `http://localhost:5173`.

## Database and seed data

Local development defaults to SQLite at `backend/salary.db`.

The seed script creates exactly 10,000 deterministic employees on an empty database. It refuses to seed a non-empty database unless `--force` is supplied:

```bash
python -m app.seed.seed_data
python -m app.seed.seed_data --force
```

For production, set `DATABASE_URL` to a PostgreSQL SQLAlchemy URL such as:

```text
postgresql+psycopg://USER:PASSWORD@HOST:5432/DATABASE
```

Then run migrations and seed the production database as appropriate.

## Environment variables

Backend `.env`:

```text
DATABASE_URL=sqlite:///./salary.db
CORS_ORIGINS=http://localhost:5173
```

Frontend `.env`:

```text
VITE_API_BASE_URL=http://localhost:8000/api
```

Do not commit real credentials or `.env` files.

## API overview

- `GET /api/health` - health check.
- `GET /api/meta/options` - filter options.
- `GET /api/employees` - paginated employee list with filters.
- `GET /api/employees/{id}` - employee detail.
- `POST /api/employees` - create employee.
- `PATCH /api/employees/{id}` - update employee.
- `GET /api/analytics/summary` - salary metrics and breakdowns.

FastAPI also exposes generated OpenAPI/Swagger documentation at `/docs`.

## Currency/reporting assumption

Employee salaries are stored in their local currency. For cross-country analysis, the application converts salaries into USD using a small, static set of illustrative exchange rates in `backend/app/core/fx.py`.

This is intentionally not a live FX integration: live rates are not required by the assessment and would add an external dependency and reliability concern. The dashboard labels the values as reporting-currency amounts and documents the limitation.

## Authentication assumption

The assessment identifies an HR Manager persona but does not explicitly require authentication, SSO, or role-based access control. Those are intentionally excluded from the assessment MVP. In a production HR system they would be mandatory.

## Design decisions

See:

- `docs/requirements.md`
- `docs/architecture.md`
- `docs/trade-offs.md`
- `docs/ai-usage.md`
- `docs/git-plan.md`
- `docs/assessment-matrix.md`
- `docs/interview-prep.md`

## Deployment

The application is deployment-ready for a split deployment:

- Frontend: Vercel (or equivalent static host).
- Backend: Render (or equivalent Docker/HTTP host).
- Database: managed PostgreSQL.

The repository contains `backend/Dockerfile` and a complete deployment runbook in `docs/runbook.md`. The backend container runs Alembic migrations before Uvicorn starts; seed data is intentionally a one-time deployment operation so a normal redeploy never overwrites HR data.

A real deployment still requires the candidate to create the external hosting resources, configure secrets/environment variables, seed the production database once, and record the final public URLs in `docs/demo.md`.

## Known limitations

- Authentication/authorization is intentionally absent from the assessment MVP.
- Currency rates are static and illustrative rather than live.
- Salary history/audit trail is not implemented because the assessment only asks to manage current salary data.
- The seed dataset is synthetic and should not be used for real HR decisions.

## Assessment-specific delivery notes

The pasted assessment does not specify the exact role language/framework. It says to use the language/framework preferred for the role, or another framework of choice. This implementation uses Python + FastAPI because the assessment permits another framework and it keeps the solution aligned with the candidate's existing Python/React background. If the role explicitly requires Java/Spring Boot, the same product scope can be implemented with Spring Boot, but the assessment statement alone does not mandate that switch.

The assessment asks for a deployed system and a video demo. Those two steps require external hosting and screen-recording accounts, so they cannot be completed purely inside this local source package. `docs/runbook.md` and `docs/demo.md` provide the exact remaining steps and verification points.
