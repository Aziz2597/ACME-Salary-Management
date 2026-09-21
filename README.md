# ACME Employee Salary Management Software

A web-based salary management and compensation analytics application for ACME, a multi-country organization with approximately 10,000 employees.

The application replaces spreadsheet-based salary management with a structured interface for HR to manage employee compensation data and answer organization-level salary questions.

## Live Deployment

- **Frontend:** https://acme-salary-management-iota.vercel.app/
- **Backend API:** https://acme-salary-management-btp0.onrender.com/
- **Backend health check:** https://acme-salary-management-btp0.onrender.com/api/health

The deployed application uses:

- **Frontend:** React + TypeScript + Vite + Material UI on Vercel
- **Backend:** Python + FastAPI on Render
- **Database:** PostgreSQL on Render
- **Local database:** SQLite
- **ORM:** SQLAlchemy 2
- **Migrations:** Alembic
- **Testing:** pytest + Playwright

The production database is seeded with **10,000 deterministic employee records**.

> The deployment uses free assessment/demo infrastructure. The Render PostgreSQL free tier is intended for testing/prototyping and has platform-specific limitations such as limited resources, no production-grade backups, and a limited service lifetime.

---

## 1. Problem Statement

ACME currently manages employee salary information using Excel spreadsheets.

For an organization operating across multiple countries and departments, spreadsheet-based management makes it difficult to:

- Find and update individual employee salary information
- Search and filter employees efficiently
- Understand compensation distributions
- Compare salaries across countries and departments
- Calculate organization-level compensation metrics
- Maintain a structured and consistent salary dataset

The goal of this project is to provide HR with a simple web application that centralizes salary information and provides basic compensation analytics.

---

## 2. Goal

Build a maintainable salary management application that allows an HR Manager to:

1. View organization-level salary metrics
2. Search, filter, sort, and paginate employee records
3. Create employee salary records
4. Edit existing employee and salary information
5. Analyze compensation by country and department
6. View salary-band distributions
7. Compare compensation using a common reporting currency

The application is intentionally scoped to salary management rather than becoming a complete HR or payroll platform.

---

## 3. Features

### Dashboard

The dashboard provides:

- Total employee count
- Average salary
- Median salary
- Minimum salary
- Maximum salary
- Salary distribution by band
- Salary distribution by country
- Salary distribution by department

Salary analytics are reported in USD.

### Employee Management

HR can:

- View employee records
- Search employees
- Filter by country and department
- Sort employee records
- Navigate through paginated results
- Create employees
- Edit employee information
- Update salary information

### Employee Data

Each employee record contains information such as:

- Employee code
- Name
- Country
- Department
- Job title
- Salary
- Currency

### Salary Analytics

The backend calculates:

- Employee count
- Average salary
- Median salary
- Minimum salary
- Maximum salary
- Country-level salary statistics
- Department-level salary statistics
- Salary-band distribution

### Currency Normalization

The application converts salary values into USD for analytics using a fixed illustrative exchange-rate table.

This keeps the assessment environment deterministic and avoids dependency on a live external foreign-exchange service.

---

## 4. Scope

### Included

- Salary data management
- Employee CRUD operations required by the application
- Employee search
- Filtering
- Sorting
- Server-side pagination
- Compensation analytics
- Country and department aggregation
- Salary bands
- Fixed currency conversion
- Deterministic 10,000-record seed dataset
- REST API
- React web interface
- Relational database
- Database migrations
- Unit/API tests
- End-to-end UI test
- Local and cloud deployment configuration

### Deliberately Excluded

The following are outside the scope of this assessment:

| Feature | Reason for exclusion |
|---|---|
| Payroll processing | Salary management is the required scope; payroll introduces substantially broader tax and payment workflows |
| Tax calculation | Country-specific tax rules are complex and not required for the assessment |
| Benefits management | Not required for answering salary-management questions |
| Attendance/time tracking | Separate HR domain |
| Employee self-service | The primary persona is the HR Manager |
| SSO/OAuth/RBAC | Authentication and authorization were not required by the assessment |
| Salary history | The assessment focuses on current salary information |
| Live FX integration | A fixed illustrative rate keeps analytics deterministic and avoids an external dependency |
| Notifications | Not required for the core workflow |
| Mobile application | The assessment requires a web application |
| AI chatbot | AI tooling is used during development; a chatbot is not required as a product feature |
| Microservices | The current scope does not justify the operational complexity of distributed services |

More detailed scope decisions are documented in [`docs/requirements.md`](docs/requirements.md).

---

## 5. Architecture

The application uses a **modular monolith** architecture.

```text
                    ┌──────────────────────────┐
                    │      React Frontend      │
                    │   TypeScript + Vite      │
                    │      Material UI         │
                    └────────────┬─────────────┘
                                 │
                              REST API
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │       FastAPI Backend    │
                    │                          │
                    │  Employee APIs           │
                    │  Analytics APIs           │
                    │  Metadata APIs            │
                    │  Validation              │
                    │  Analytics Services      │
                    └────────────┬─────────────┘
                                 │
                           SQLAlchemy 2
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │    Relational Database   │
                    │                          │
                    │ SQLite locally            │
                    │ PostgreSQL in production │
                    └──────────────────────────┘
```

### Backend Structure

```text
backend/
├── app/
│   ├── api/
│   │   ├── analytics.py
│   │   ├── employees.py
│   │   └── meta.py
│   ├── core/
│   │   ├── config.py
│   │   └── fx.py
│   ├── seed/
│   │   └── seed_data.py
│   ├── services/
│   │   └── analytics.py
│   ├── db.py
│   ├── main.py
│   ├── models.py
│   └── schemas.py
├── migrations/
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
│       └── 0001_create_employees.py
├── tests/
│   ├── conftest.py
│   ├── test_analytics_service.py
│   └── test_employees_api.py
├── Dockerfile
├── alembic.ini
├── requirements.txt
└── .env.example
```

### Frontend Structure

```text
frontend/
├── src/
│   ├── components/
│   │   ├── AnalyticsSection.tsx
│   │   ├── EmployeeDialog.tsx
│   │   ├── EmployeeTable.tsx
│   │   └── StatCard.tsx
│   ├── api.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── theme.ts
│   └── types.ts
├── tests/
│   └── salary-update.spec.ts
├── package.json
├── playwright.config.ts
├── tsconfig.json
├── vercel.json
└── vite.config.ts
```

More architectural details are documented in [`docs/architecture.md`](docs/architecture.md).

---

## 6. Technology Stack

### Backend

- Python 3.13
- FastAPI
- SQLAlchemy 2
- Pydantic
- pydantic-settings
- Alembic
- PostgreSQL
- SQLite
- psycopg 3
- pytest

### Frontend

- React
- TypeScript
- Vite
- Material UI
- Playwright

### Deployment

- Vercel — frontend
- Render — backend
- Render PostgreSQL — production database
- Docker — backend containerization

---

## 7. API

The backend exposes REST endpoints under `/api`.

### System

```text
GET /api/health
```

### Employees

```text
GET    /api/employees
GET    /api/employees/{id}
POST   /api/employees
PATCH  /api/employees/{id}
```

Employee listing supports server-side:

- Search
- Country filtering
- Department filtering
- Sorting
- Pagination

### Analytics

```text
GET /api/analytics/summary
```

Optional filters allow analytics to be calculated for a selected country and/or department.

### Metadata

```text
GET /api/meta/options
```

Returns available filter options used by the frontend.

Interactive API documentation is available through FastAPI when the backend is running:

```text
/docs
```

For the deployed backend:

https://acme-salary-management-btp0.onrender.com/docs

---

## 8. Data Model

The primary database entity is `Employee`.

Conceptually:

```text
Employee
---------
id
employee_code
first_name
last_name
country
department
job_title
salary
currency
created_at
updated_at
```

The salary is stored as the employee's current salary in their specified currency.

Analytics convert supported currencies to USD using the application's fixed FX table.

---

## 9. Seed Data

The application includes a deterministic seed script that creates **10,000 employees**.

Run locally with:

```powershell
cd backend
python -m app.seed.seed_data
```

The generated dataset contains employees across multiple countries, departments, currencies, job titles, and salary ranges.

The deterministic dataset makes local testing and demonstrations repeatable.

The production database has been seeded with 10,000 records.

---

## 10. Local Development

### Prerequisites

Install:

- Python 3.13+
- Node.js
- npm
- Git

### Clone the repository

```powershell
git clone https://github.com/Aziz2597/ACME-Salary-Management.git
cd ACME-Salary-Management
```

### Backend setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create the local environment file:

```powershell
Copy-Item .env.example .env
```

Run the database migration:

```powershell
alembic upgrade head
```

Seed the database:

```powershell
python -m app.seed.seed_data
```

Start the backend:

```powershell
uvicorn app.main:app --reload
```

The backend will be available at:

```text
http://localhost:8000
```

Health check:

```text
http://localhost:8000/api/health
```

---

## 11. Frontend Setup

Open a second terminal.

```powershell
cd frontend
npm install
```

For local development, the application defaults to:

```text
http://localhost:8000/api
```

Start the frontend:

```powershell
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

If using a different backend URL, configure:

```text
VITE_API_BASE_URL
```

For example:

```text
VITE_API_BASE_URL=http://localhost:8000/api
```

For the deployed frontend, this variable points to the Render API:

```text
https://acme-salary-management-btp0.onrender.com/api
```

`VITE_*` variables are frontend build-time configuration and therefore must not contain secrets.

---

## 12. Database Migrations

Alembic is used to manage database schema changes.

Apply migrations:

```powershell
cd backend
alembic upgrade head
```

The initial migration creates the `employees` table.

The application does not rely on automatic table creation at runtime; schema changes are represented through migrations.

---

## 13. Testing

### Backend tests

From the `backend` directory:

```powershell
pytest
```

The current test suite covers:

- Employee API behavior
- Employee creation
- Employee updates
- Employee retrieval/listing behavior
- Validation failures
- Pagination/filtering behavior
- Analytics calculations
- Salary aggregation
- Currency normalization
- Salary-band calculations

The current local backend test run passes:

```text
12 passed
```

### Frontend end-to-end test

From the `frontend` directory:

```powershell
npx playwright test
```

The Playwright test covers a representative salary-management workflow, including locating an employee and updating salary information.

The current local E2E run passes:

```text
1 passed
```

Tests are intentionally kept deterministic and focused on meaningful application behavior rather than implementation details.

---

## 14. Production Deployment

### Frontend

The React/Vite frontend is deployed on Vercel.

Production frontend:

https://acme-salary-management-iota.vercel.app/

The frontend uses:

```text
VITE_API_BASE_URL=https://acme-salary-management-btp0.onrender.com/api
```

### Backend

The FastAPI backend is deployed as a Docker-based Render Web Service.

Production backend:

https://acme-salary-management-btp0.onrender.com/

Health endpoint:

https://acme-salary-management-btp0.onrender.com/api/health

The backend container:

1. Installs Python dependencies
2. Runs Alembic migrations
3. Starts Uvicorn

### Database

Production uses Render PostgreSQL.

The production database contains the seeded 10,000-employee assessment dataset.

Database credentials are supplied through environment variables and are not committed to the repository.

---

## 15. Configuration

### Local

```text
DATABASE_URL=sqlite:///./salary.db
CORS_ORIGINS=http://localhost:5173
```

### Production

Production configuration is supplied through Render environment variables.

The important settings are:

```text
DATABASE_URL=<production PostgreSQL connection string>
CORS_ORIGINS=https://acme-salary-management-iota.vercel.app
```

The actual production database connection string is intentionally not stored in Git.

---

## 16. Engineering Decisions

### Modular Monolith

A modular monolith was selected instead of microservices because the application has a relatively small bounded scope.

This provides:

- Simpler deployment
- Lower operational overhead
- Easier local development
- Straightforward testing
- Clear separation between API, service, database, and frontend concerns

### PostgreSQL in Production, SQLite Locally

SQLite keeps local setup lightweight.

PostgreSQL is used in production because it is a better fit for a multi-user relational application and demonstrates deployment against a production-oriented relational database.

SQLAlchemy provides portability between the two databases.

### Server-Side Pagination

The application does not load all 10,000 employees into the browser.

Employee lists are paginated at the API/database layer, reducing the amount of data transferred and rendered for each request.

### Fixed FX Rates

The assessment requires salary analysis across multiple currencies but does not require live foreign-exchange data.

Fixed illustrative rates provide:

- Deterministic results
- No external API dependency
- Reproducible tests
- Stable demonstrations

### Current Salary Only

Salary history was intentionally excluded.

This keeps the data model focused on the requested current-compensation workflow rather than introducing effective dates, historical records, audit semantics, and additional UI complexity.

Additional trade-offs are documented in [`docs/trade-offs.md`](docs/trade-offs.md).

---

## 17. AI-Assisted Development

Agentic AI tools were used during development as an engineering aid.

AI assistance was used for tasks including:

- Initial implementation scaffolding
- API and schema review
- Test-case generation and edge-case identification
- SQLAlchemy implementation review
- Documentation drafting
- Deployment troubleshooting
- Reviewing implementation approaches and trade-offs

Generated changes were reviewed, adapted where necessary, and validated through tests and manual verification.

The final implementation decisions remain the responsibility of the developer.

Details are documented in [`docs/ai-usage.md`](docs/ai-usage.md).

---

## 18. Documentation

The repository includes assessment-focused documentation:

| Document | Purpose |
|---|---|
| [`docs/requirements.md`](docs/requirements.md) | Requirements, scope, and deliberate exclusions |
| [`docs/architecture.md`](docs/architecture.md) | Architecture and component design |
| [`docs/trade-offs.md`](docs/trade-offs.md) | Important engineering trade-offs |
| [`docs/ai-usage.md`](docs/ai-usage.md) | AI-assisted development record |
| [`docs/assessment-matrix.md`](docs/assessment-matrix.md) | Mapping between assessment expectations and implementation |
| [`docs/runbook.md`](docs/runbook.md) | Local setup, deployment, and operational instructions |
| [`docs/demo.md`](docs/demo.md) | Demonstration flow |
| [`docs/verification.md`](docs/verification.md) | Validation and verification record |

---

## 19. Verification Summary

The implementation has been validated locally through:

- Alembic database migration
- Deterministic seeding of 10,000 employees
- Backend automated tests
- Frontend production build
- Playwright end-to-end testing
- Backend API smoke tests
- Salary update validation
- Unsupported-currency validation
- Production backend health check
- Production database verification
- Deployed frontend/backend integration

The deployed backend health endpoint returns:

```json
{
  "status": "ok"
}
```

The deployed analytics endpoint reports an employee count of:

```text
10,000
```

Detailed verification information is available in [`docs/verification.md`](docs/verification.md).

---

## 20. Known Limitations

This application is intentionally scoped for the assessment and is not intended to represent a complete enterprise HR/payroll system.

Known limitations include:

- No authentication or authorization
- No role-based access control
- No audit log
- No salary history
- No payroll processing
- No tax calculation
- No benefits management
- No employee self-service
- Fixed illustrative FX rates
- No live external FX provider
- No notifications
- No mobile application
- Free-tier deployment infrastructure
- Production database infrastructure is intended for assessment/demo use rather than long-term production operation

These limitations are deliberate scope decisions rather than unfinished core requirements.

---

## 21. Repository Structure

```text
ACME-Salary-Management/
│
├── backend/
│   ├── app/
│   ├── migrations/
│   ├── tests/
│   ├── Dockerfile
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── tests/
│   ├── package.json
│   ├── package-lock.json
│   ├── playwright.config.ts
│   ├── tsconfig.json
│   ├── vercel.json
│   └── vite.config.ts
│
├── docs/
│   ├── requirements.md
│   ├── architecture.md
│   ├── trade-offs.md
│   ├── ai-usage.md
│   ├── assessment-matrix.md
│   ├── runbook.md
│   ├── demo.md
│   └── verification.md
│
├── .gitignore
├── .gitattributes
└── README.md
```

---

## 22. Git History

The repository contains the actual development history of the project.

The history has not been rewritten to simulate an incremental commit sequence that did not occur.

Current commits represent:

- Initial project implementation
- PostgreSQL/psycopg3 compatibility fix
- Alembic PostgreSQL configuration fix

Subsequent documentation or deployment-related changes are committed as they are actually made.

This keeps the repository history truthful and reproducible.

---

## 23. Assessment Alignment

The implementation addresses the core assessment requirements:

| Assessment Area | Implementation |
|---|---|
| Requirements document | `docs/requirements.md` |
| Planning/design documentation | Architecture and trade-off documents |
| Relational database | SQLite locally, PostgreSQL in production |
| Backend | Python + FastAPI |
| Frontend | React + TypeScript |
| 10,000 employees | Deterministic seed dataset |
| Salary management | Employee create/edit/list APIs and UI |
| Salary questions/analytics | Dashboard and analytics API |
| Testing | pytest + Playwright |
| AI-assisted development | `docs/ai-usage.md` |
| Architecture | `docs/architecture.md` |
| Trade-offs | `docs/trade-offs.md` |
| Deployment | Vercel + Render |
| Verification | `docs/verification.md` |
| Demonstration | `docs/demo.md` |

---

## 24. Quick Links

- **Live application:** https://acme-salary-management-iota.vercel.app/
- **API:** https://acme-salary-management-btp0.onrender.com/
- **API health:** https://acme-salary-management-btp0.onrender.com/api/health
- **API documentation:** https://acme-salary-management-btp0.onrender.com/docs
- **GitHub repository:** https://github.com/Aziz2597/ACME-Salary-Management
