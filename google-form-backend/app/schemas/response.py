from pydantic import BaseModel, Field
from typing import List, Dict, Any
from datetime import datetime
from app.schemas.field import PyObjectId

class FieldResponseBase(BaseModel):
    field_id: str
    value: str

class FieldResponseCreate(FieldResponseBase):
    pass

class FormResponseBase(BaseModel):
    form_id: str

class FormResponseCreate(FormResponseBase):
    field_responses: List[FieldResponseCreate]

class FormResponseInDB(FormResponseBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    field_responses: List[Dict[str, Any]] = []
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {PyObjectId: str}

class FormResponse(FormResponseBase):
    id: str
    submitted_at: datetime
    field_responses: List[Dict[str, Any]] = []
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {PyObjectId: str}