from pydantic import BaseModel, validator
from typing import List, Optional, Dict, Union

class FieldCreate(BaseModel):
    label: str
    field_type: str  # "text", "number", "single_choice"
    options: Optional[List[str]] = None
    
    @validator('field_type')
    def validate_field_type(cls, v):
        allowed_types = ["text", "number", "single_choice"]
        if v not in allowed_types:
            raise ValueError(f'field_type must be one of {allowed_types}')
        return v
    
    @validator('options')
    def validate_options(cls, v, values):
        if values.get('field_type') == 'single_choice' and (not v or len(v) == 0):
            raise ValueError('options are required for single_choice field type')
        if values.get('field_type') in ['text', 'number'] and v:
            raise ValueError('options should not be provided for text or number field types')
        return v

class FieldOut(FieldCreate):
    id: int
    class Config:
        from_attributes = True

class FormCreate(BaseModel):
    title: str
    field_ids: List[int]
    
    @validator('field_ids')
    def validate_field_ids(cls, v):
        if not v or len(v) == 0:
            raise ValueError('At least one field is required')
        if len(set(v)) != len(v):
            raise ValueError('Duplicate field IDs are not allowed')
        return v
    
    @validator('title')
    def validate_title(cls, v):
        if not v or not v.strip():
            raise ValueError('Title cannot be empty')
        return v.strip()

class FormOut(BaseModel):
    id: int
    title: str
    unique_link: str
    fields: List[int]
    class Config:
        from_attributes = True

# Fixed: Changed to handle field_id as string key but allow flexible value types
class ResponseCreate(BaseModel):
    form_id: int
    answers: Dict[str, Union[str, int, float]]  # More flexible to handle different field types
    
    @validator('answers')
    def validate_answers(cls, v):
        if not v:
            raise ValueError('At least one answer is required')
        # Convert all values to strings for consistent storage
        return {k: str(val) for k, val in v.items()}

class ResponseOut(ResponseCreate):
    id: int
    class Config:
        from_attributes = True

# Additional schema for better form details with field information
class FormDetailOut(BaseModel):
    id: int
    title: str
    unique_link: str
    fields: List[FieldOut]  # Full field objects instead of just IDs
    class Config:
        from_attributes = True