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

@router.post("/fields/", response_model=schemas.FieldOut)
def create_field(field: schemas.FieldCreate, db: Session = Depends(get_db)):
    return crud.create_field(db, field)

@router.get("/fields/", response_model=list[schemas.FieldOut])
def list_fields(db: Session = Depends(get_db)):
    return crud.get_all_fields(db)

@router.post("/forms/", response_model=schemas.FormOut)
def create_form(form: schemas.FormCreate, db: Session = Depends(get_db)):
    return crud.create_form(db, form)

@router.get("/forms/{link}", response_model=schemas.FormOut)
def get_form(link: str, db: Session = Depends(get_db)):
    db_form = crud.get_form_by_link(db, link)
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    return db_form
