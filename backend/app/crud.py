import json
from sqlalchemy.orm import Session
from . import models, schemas
import uuid

# Field
def create_field(db: Session, field: schemas.FieldCreate):
    db_field = models.Field(
        label=field.label,
        field_type=field.field_type,
        options=json.dumps(field.options) if field.options else None
    )
    db.add(db_field)
    db.commit()
    db.refresh(db_field)

    if db_field.options:
        db_field.options = json.loads(db_field.options)

    return db_field

def get_all_fields(db: Session):
    fields = db.query(models.Field).all()
    for f in fields:
        if f.options:
            f.options = json.loads(f.options)
    return fields

# Form
def create_form(db: Session, form: schemas.FormCreate):
    unique_link = str(uuid.uuid4())[:8]  # short unique ID
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

def get_form_by_link(db: Session, link: str):
    db_form = db.query(models.Form).filter(models.Form.unique_link == link).first()
    if db_form and db_form.fields:
        db_form.fields = json.loads(db_form.fields)
    return db_form

# Response
def create_response(db: Session, response: schemas.ResponseCreate):
    db_response = models.Response(
        form_id=response.form_id,
        answers=json.dumps(response.answers)
    )
    db.add(db_response)
    db.commit()
    db.refresh(db_response)

    # Convert back to dict for response
    db_response.answers = json.loads(db_response.answers)
    return db_response

def get_responses_by_form(db: Session, form_id: int):
    responses = db.query(models.Response).filter(models.Response.form_id == form_id).all()
    for r in responses:
        if r.answers:
            r.answers = json.loads(r.answers)
    return responses
