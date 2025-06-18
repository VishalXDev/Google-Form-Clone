from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from enum import Enum

# MongoDB-compatible ObjectId for Pydantic
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

# Enum for field types
class FieldType(str, Enum):
    SINGLE_CHOICE = "single_choice"
    NUMBER = "number"
    TEXT = "text"
    EMAIL = "email"
    TEXTAREA = "textarea"

# Field Schema
class FieldModel(BaseModel):
    name: str = Field(..., description="Field label/name")
    field_type: FieldType = Field(..., description="Type of field")
    options: Optional[List[str]] = Field(None, description="Options for single_choice fields")
    is_required: bool = Field(default=False, description="Whether field is required")
    placeholder: Optional[str] = Field(None, description="Placeholder text")
    description: Optional[str] = Field(None, description="Field description/help text")
    validation_rules: Optional[dict] = Field(None, description="Validation rules for the field")
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "name": "Full Name",
                "field_type": "text",
                "is_required": True,
                "placeholder": "Enter your full name",
                "description": "Please provide your complete name"
            }
        }
