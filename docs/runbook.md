# Runbook

## 1. Local prerequisites

Install:

- Python 3.13 recommended.
- Node.js 22 LTS or newer supported by the pinned Vite release.
- Git.

Docker is optional for this project; local development uses SQLite so that a beginner can start without running a database server.

## 2. Local backend

From `backend/`:

```bash
python -m venv .venv
```

Activate the environment, then:

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
python -m app.seed.seed_data
uvicorn app.main:app --reload --port 8000
```

Windows PowerShell uses `Copy-Item .env.example .env` and `..\\.venv\\Scripts\\Activate.ps1` instead of the POSIX activation/copy commands.

Verify:

```text
http://localhost:8000/api/health
http://localhost:8000/docs
```

## 3. Local frontend

From `frontend/`:

```bash
npm install
```

Create `.env` with:

```text
VITE_API_BASE_URL=http://localhost:8000/api
```

Then:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

## 4. Local tests

Backend:

```bash
cd backend
pytest
```

Frontend build/type-check:

```bash
cd frontend
npm run build
```

End-to-end test:

```bash
cd frontend
npx playwright install chromium
npm run e2e
```

The Playwright test expects the backend on `http://localhost:8000` and frontend on `http://localhost:5173`.

# Production Deployment

The submitted assessment is deployed as a split application:

- Frontend: Vercel
- Backend: Render
- Database: Render PostgreSQL

## Current deployment

Frontend:

`https://acme-salary-management-iota.vercel.app/`

Backend:

`https://acme-salary-management-btp0.onrender.com/`

Health check:

`https://acme-salary-management-btp0.onrender.com/api/health`

## Backend configuration

The Render backend uses:

- Root Directory: `backend`
- Runtime: Docker
- Dockerfile: `backend/Dockerfile`
- Health Check Path: `/api/health`
- `DATABASE_URL`: managed PostgreSQL connection string
- `CORS_ORIGINS`: deployed Vercel frontend origin

The Docker image runs Alembic migrations before starting Uvicorn.

The seed script is intentionally separate from application startup so that normal deployments do not overwrite existing data.

## Frontend configuration

The Vercel frontend uses:

- Root Directory: `frontend`
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- `VITE_API_BASE_URL`: public Render API URL ending in `/api`

`VITE_*` variables are embedded into the browser build by Vite. The API URL is therefore not a secret and must be available during the Vercel build.

## Production verification

After deployment, verify:

1. Open the frontend URL.
2. Dashboard shows 10,000 employees.
3. Dashboard analytics load.
4. Country/department filters operate.
5. Employee table loads and paginates.
6. Search finds `E00001`.
7. Edit a salary and verify the updated value.
8. Open the backend `/docs` endpoint.
9. Verify the API health endpoint returns `{"status":"ok"}`.
10. Record the final URLs and demo video in `docs/demo.md`.
