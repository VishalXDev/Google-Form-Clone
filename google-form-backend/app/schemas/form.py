from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from app.schemas.field import PyObjectId, FieldCreate

class FormBase(BaseModel):
    title: str
    description: Optional[str] = None

class FormFieldInput(BaseModel):
    field_details: dict

class FormCreate(FormBase):
    fields: List[FormFieldInput]


class FormUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class FormFieldInDB(BaseModel):
    field_id: str
    position: int
    field_details: dict  # Changed from Optional[FieldCreate] to dict for flexibility

class FormInDB(FormBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    unique_link: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    fields: List[FormFieldInDB] = []

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Form(FormBase):
    id: str
    unique_link: str
    is_active: bool
    created_at: datetime
    fields: List[FormFieldInDB] = []

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Keep this for backward compatibility if needed elsewhere
class FormFieldInput(BaseModel):
    field_details: FieldCreate