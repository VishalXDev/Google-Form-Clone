from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud, database
from typing import List

router = APIRouter(prefix="/api", tags=["forms"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ===== FIELD ENDPOINTS =====
@router.post("/fields/", response_model=schemas.FieldOut)
def create_field(field: schemas.FieldCreate, db: Session = Depends(get_db)):
    """Create a new reusable field"""
    return crud.create_field(db, field)

@router.get("/fields/", response_model=List[schemas.FieldOut])
def list_fields(db: Session = Depends(get_db)):
    """Get all available fields for form creation"""
    return crud.get_all_fields(db)

@router.get("/fields/{field_id}", response_model=schemas.FieldOut)
def get_field(field_id: int, db: Session = Depends(get_db)):
    """Get a specific field by ID"""
    field = crud.get_field_by_id(db, field_id)
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
    return field

# ===== FORM ENDPOINTS =====
@router.post("/forms/", response_model=schemas.FormOut)
def create_form(form: schemas.FormCreate, db: Session = Depends(get_db)):
    """Create a new form with unique link"""
    return crud.create_form(db, form)

@router.get("/forms/", response_model=List[schemas.FormOut])
def list_all_forms(db: Session = Depends(get_db)):
    """Get all forms - for admin dashboard"""
    return crud.get_all_forms(db)

@router.get("/forms/link/{link}", response_model=schemas.FormOut)
def get_form_by_link(link: str, db: Session = Depends(get_db)):
    """Get form by unique link - for public form access"""
    db_form = crud.get_form_by_link(db, link)
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    return db_form

@router.get("/forms/id/{form_id}", response_model=schemas.FormOut)  
def get_form_by_id(form_id: int, db: Session = Depends(get_db)):
    """Get form by ID - for admin operations"""
    form = crud.get_form_by_id(db, form_id)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    return form

@router.get("/forms/{form_id}/details", response_model=schemas.FormDetailOut)
def get_form_details(form_id: int, db: Session = Depends(get_db)):
    """Get form with complete field information - useful for rendering forms"""
    form_details = crud.get_form_with_field_details(db, form_id)
    if not form_details:
        raise HTTPException(status_code=404, detail="Form not found")
    return form_details

@router.get("/forms/link/{link}/details", response_model=schemas.FormDetailOut)
def get_form_details_by_link(link: str, db: Session = Depends(get_db)):
    """Get form details by link - for public form rendering with full field info"""
    # First get the form by link
    form = crud.get_form_by_link(db, link)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    # Then get detailed information
    form_details = crud.get_form_with_field_details(db, form.id)
    if not form_details:
        raise HTTPException(status_code=404, detail="Form details not found")
    return form_details