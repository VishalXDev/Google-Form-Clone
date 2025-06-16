from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud, database

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/responses/", response_model=schemas.ResponseOut)
def submit_response(response: schemas.ResponseCreate, db: Session = Depends(get_db)):
    return crud.create_response(db, response)

@router.get("/responses/{form_id}", response_model=list[schemas.ResponseOut])
def list_responses(form_id: int, db: Session = Depends(get_db)):
    return crud.get_responses_by_form(db, form_id)
