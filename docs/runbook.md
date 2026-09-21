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

## 5. Production deployment

### Backend: Render + PostgreSQL

Render supports monorepos through a per-service root directory. Set the backend service root directory to `backend`, so its Dockerfile and commands are evaluated relative to that directory.

Create a PostgreSQL database and copy its SQLAlchemy connection URL into the backend service as `DATABASE_URL`.

Create a Web Service using Docker:

- Root Directory: `backend`
- Runtime: Docker
- Dockerfile Path: `Dockerfile`
- Health Check Path: `/api/health`
- Environment variable: `DATABASE_URL=<managed PostgreSQL URL>`
- Environment variable: `CORS_ORIGINS=<Vercel frontend URL>`

The Docker image runs Alembic migrations before starting Uvicorn. After the first deploy, run the seed script once against the production database using the platform's shell/one-off command facility:

```bash
python -m app.seed.seed_data
```

Do not use `--force` in production unless intentionally replacing all data.

Render web services must listen on `0.0.0.0`; the Dockerfile already does this and respects Render's `PORT` environment variable.

### Frontend: Vercel

Import the Git repository as a new Vercel project and set:

- Root Directory: `frontend`
- Framework: Vite (auto-detected)
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment variable: `VITE_API_BASE_URL=<public Render backend URL>/api`

Deploy the project and verify the browser can call the backend API.

## 6. Final deployed verification

Run these checks against the public deployment:

1. Open the frontend URL.
2. Dashboard shows 10,000 employees.
3. Dashboard analytics load without errors.
4. Country/department filters change the analytics.
5. Employees page loads and paginates.
6. Search finds `E00001`.
7. Edit the salary and verify the success message and updated value.
8. Open backend `/docs` and verify the OpenAPI page loads.
9. Run the exact Playwright flow against the deployed frontend if the environment configuration supports it.
10. Record the final URLs and demo video in `docs/demo.md`.
