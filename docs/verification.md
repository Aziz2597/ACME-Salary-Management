# Verification Record

## Local verification completed

- Alembic migration: passed.
- Seed script: passed; exactly 10,000 employees inserted.
- Backend tests: 12 passed.
- Python compile check: passed.
- Live FastAPI smoke test: passed on a clean local port.
- `GET /api/health`: 200.
- `GET /api/employees?page=1&page_size=1`: 200 and total 10,000.
- `GET /api/analytics/summary`: 200 and employee count 10,000.
- Salary update smoke test: 200; 2,500,000 INR reported as 29,750 USD using the documented static rate.
- Unsupported currency validation: 422.

## Verification not completed inside the build container

The frontend dependency install could not be completed in this environment because external npm registry access was unavailable. Therefore a real `npm run build` and Playwright browser run were not honestly claimed as passed here. The source is pinned to current checked package versions, and the repository includes the exact commands the candidate should run locally before submission.

## Required final verification by the candidate

1. `cd frontend && npm install`
2. `npm run build`
3. `npx playwright install chromium`
4. Start backend + frontend and run `npm run e2e`
5. Deploy backend/database/frontend.
6. Re-run health, dashboard, search, edit-salary, and analytics checks against the public URLs.
7. Record the public URLs and demo video in `docs/demo.md`.
