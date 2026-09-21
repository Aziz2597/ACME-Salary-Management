# Verification Record

## Local verification

- Alembic migration: passed.
- Seed script: passed; exactly 10,000 employees inserted.
- Backend tests: **12 passed**.
- Python compile check: passed.
- Local FastAPI smoke test: passed.
- `GET /api/health`: 200.
- `GET /api/employees?page=1&page_size=1`: 200 with total 10,000.
- `GET /api/analytics/summary`: 200 with employee count 10,000.
- Salary update smoke test: 200; 2,500,000 INR reported as 29,750 USD using the documented static rate.
- Unsupported currency validation: 422.
- Frontend Playwright end-to-end salary-update workflow: **1 passed**.

## Production verification

The deployed application was verified through the public frontend and backend.

### Backend

- Health endpoint: `200 OK`.
- Production PostgreSQL connection: working.
- Production database seeded with 10,000 employees.
- Analytics endpoint returns the seeded employee population.

### Frontend

- Vercel deployment loads successfully.
- Frontend communicates with the Render API.
- Dashboard loads employee and analytics data.
- CORS configuration was verified during deployment.
- Employee listing and API-backed dashboard functionality are operational.

### Deployment URLs

- Frontend: `https://acme-salary-management-iota.vercel.app/`
- Backend: `https://acme-salary-management-btp0.onrender.com/`

## Test commands

Backend:

```bash
cd backend
pytest
```

Frontend:

```bash
cd frontend
npm run build
npx playwright install chromium
npm run e2e
```

## Known limitations

- Authentication and authorization are intentionally absent from the assessment MVP.
- The production PostgreSQL deployment uses assessment/demo infrastructure rather than a hardened enterprise production environment.
- FX rates are static and illustrative rather than live.
- Salary history and audit trails are not implemented.
- The dataset is synthetic and should not be used for real HR decisions.