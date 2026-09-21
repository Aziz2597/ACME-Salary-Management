from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.analytics import router as analytics_router
from app.api.employees import router as employees_router
from app.api.meta import router as meta_router
from app.core.config import get_settings

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="Salary management and compensation analytics for the ACME HR Manager persona.",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PATCH"],
    allow_headers=["*"],
)
app.include_router(employees_router, prefix="/api")
app.include_router(analytics_router, prefix="/api")
app.include_router(meta_router, prefix="/api")


@app.get("/api/health", tags=["system"])
def health():
    return {"status": "ok"}
