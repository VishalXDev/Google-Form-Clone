import json
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from . import models, schemas
import uuid
from fastapi import HTTPException

# Field
def create_field(db: Session, field: schemas.FieldCreate):
    try:
        db_field = models.Field(
            label=field.label,
            field_type=field.field_type,
            options=json.dumps(field.options) if field.options else None
        )
        db.add(db_field)
        db.commit()
        db.refresh(db_field)

        # Convert JSON back to list for response
        if db_field.options:
            db_field.options = json.loads(db_field.options)

        return db_field
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create field")

def get_all_fields(db: Session):
    try:
        fields = db.query(models.Field).all()
        for f in fields:
            if f.options:
                try:
                    f.options = json.loads(f.options)
                except json.JSONDecodeError:
                    f.options = []  # fallback to empty list
        return fields
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Failed to fetch fields")

def get_field_by_id(db: Session, field_id: int):
    """Get a single field by ID - useful for validation"""
    field = db.query(models.Field).filter(models.Field.id == field_id).first()
    if field and field.options:
        try:
            field.options = json.loads(field.options)
        except json.JSONDecodeError:
            field.options = []
    return field

# Form
def create_form(db: Session, form: schemas.FormCreate):
    try:
        # ✅ Validate that all field_ids exist
        for field_id in form.field_ids:
            field = db.query(models.Field).filter(models.Field.id == field_id).first()
            if not field:
                raise HTTPException(status_code=400, detail=f"Field with ID {field_id} does not exist")

        # Generate unique link with collision check
        unique_link = generate_unique_link(db)
        
        db_form = models.Form(
            title=form.title,
            unique_link=unique_link,
            fields=json.dumps(form.field_ids)
        )
        db.add(db_form)
        db.commit()
        db.refresh(db_form)

        # Parse fields to list before returning
        db_form.fields = json.loads(db_form.fields)
        return db_form
    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create form")

def generate_unique_link(db: Session, max_attempts: int = 10):
    """Generate a unique link with collision checking"""
    for _ in range(max_attempts):
        link = str(uuid.uuid4())[:8]
        existing = db.query(models.Form).filter(models.Form.unique_link == link).first()
        if not existing:
            return link
    raise HTTPException(status_code=500, detail="Failed to generate unique link")

def get_form_by_link(db: Session, link: str):
    try:
        db_form = db.query(models.Form).filter(models.Form.unique_link == link).first()
        if db_form and db_form.fields:
            try:
                db_form.fields = json.loads(db_form.fields)
            except json.JSONDecodeError:
                db_form.fields = []
        return db_form
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Failed to fetch form")

def get_form_by_id(db: Session, form_id: int):
    """Get form by ID - needed for admin operations"""
    try:
        db_form = db.query(models.Form).filter(models.Form.id == form_id).first()
        if db_form and db_form.fields:
            try:
                db_form.fields = json.loads(db_form.fields)
            except json.JSONDecodeError:
                db_form.fields = []
        return db_form
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Failed to fetch form")

def get_all_forms(db: Session):
    """Get all forms for admin dashboard"""
    try:
        forms = db.query(models.Form).all()
        for form in forms:
            if form.fields:
                try:
                    form.fields = json.loads(form.fields)
                except json.JSONDecodeError:
                    form.fields = []
        return forms
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Failed to fetch forms")

def get_form_with_field_details(db: Session, form_id: int):
    """Get form with complete field information for detailed view"""
    try:
        form = get_form_by_id(db, form_id)
        if not form:
            return None
        
        # Get full field objects
        field_objects = []
        for field_id in form.fields:
            field = get_field_by_id(db, field_id)
            if field:
                field_objects.append(field)
        
        # Create a form object with field details
        form_dict = {
            "id": form.id,
            "title": form.title,
            "unique_link": form.unique_link,
            "fields": field_objects
        }
        return form_dict
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Failed to fetch form details")

# Response
def create_response(db: Session, response: schemas.ResponseCreate):
    try:
        # ✅ Validate that form exists
        form = db.query(models.Form).filter(models.Form.id == response.form_id).first()
        if not form:
            raise HTTPException(status_code=400, detail="Form does not exist")

        # ✅ Validate that answers correspond to form fields
        try:
            form_field_ids = json.loads(form.fields) if form.fields else []
        except json.JSONDecodeError:
            form_field_ids = []

        # Convert field IDs to strings for comparison (since answers keys are strings)
        valid_field_ids = [str(fid) for fid in form_field_ids]
        
        for field_key in response.answers.keys():
            if field_key not in valid_field_ids:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Answer for field '{field_key}' is not valid for this form"
                )

        db_response = models.Response(
            form_id=response.form_id,
            answers=json.dumps(response.answers)
        )
        db.add(db_response)
        db.commit()
        db.refresh(db_response)

        # Convert back to dict for response
        try:
            db_response.answers = json.loads(db_response.answers)
        except json.JSONDecodeError:
            db_response.answers = {}

        return db_response
    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to save response")

def get_responses_by_form(db: Session, form_id: int):
    try:
        # ✅ Validate that form exists
        form = db.query(models.Form).filter(models.Form.id == form_id).first()
        if not form:
            raise HTTPException(status_code=404, detail="Form not found")

        responses = db.query(models.Response).filter(models.Response.form_id == form_id).all()
        for r in responses:
            if r.answers:
                try:
                    r.answers = json.loads(r.answers)
                except json.JSONDecodeError:
                    r.answers = {}
        return responses
    except HTTPException:
        raise
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Failed to fetch responses")