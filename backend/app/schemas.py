from pydantic import BaseModel
from typing import List, Optional, Dict

class FieldCreate(BaseModel):
    label: str
    field_type: str
    options: Optional[List[str]] = None

class FieldOut(FieldCreate):
    id: int
    class Config:
        from_attributes = True

class FormCreate(BaseModel):
    title: str
    field_ids: List[int]

class FormOut(BaseModel):
    id: int
    title: str
    unique_link: str
    fields: List[int]
    class Config:
        from_attributes = True

class ResponseCreate(BaseModel):
    form_id: int
    answers: Dict[str, str]

class ResponseOut(ResponseCreate):
    id: int
    class Config:
        from_attributes = True
