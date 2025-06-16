from fastapi import FastAPI
from .database import Base, engine
from .routers import form, response

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(form.router)
app.include_router(response.router)
