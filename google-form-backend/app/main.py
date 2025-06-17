from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import forms, fields, responses
from app.database.connection import connect_to_mongo, close_mongo_connection

app = FastAPI(title="Google Forms API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database events
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# Include routers
app.include_router(forms.router)
app.include_router(fields.router)
app.include_router(responses.router)

@app.get("/")
def root():
    return {"message": "Google Forms API is running with MongoDB"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)