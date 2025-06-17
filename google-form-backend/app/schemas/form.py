from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from app.schemas.field import PyObjectId, Field as FieldSchema

class FormFieldBase(BaseModel):
    field_id: str
    position: int

class FormFieldInDB(FormFieldBase):
    field_details: Optional[dict] = None  # Will store field information

class FormBase(BaseModel):
    title: str
    description: Optional[str] = None

class FormCreate(FormBase):
    field_ids: List[str]

class FormUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

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
    fields: List[dict] = []
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}