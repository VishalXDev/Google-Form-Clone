import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database.connection import connect_to_mongo, close_mongo_connection
from app.routes import fields, forms, responses 

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(
    title="Google Forms Clone API",
    description="A simplified version of Google Forms with form creation and response management",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(fields.router, prefix="/api/v1")
app.include_router(forms.router, prefix="/api/v1")
app.include_router(responses.router, prefix="/api/v1") 

@app.get("/")
async def root():
    return {"message": "Google Forms Clone API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is operational"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",  # this must be the full import path
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8000))
    )
