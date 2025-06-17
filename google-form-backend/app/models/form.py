from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from bson import ObjectId
import uuid

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

class FormFieldEmbedded(BaseModel):
    """Embedded field details in form"""
    field_id: str
    position: int
    field_details: Dict[str, Any]  # Contains field name, type, options, etc.

class FormSettings(BaseModel):
    """Form settings and configuration"""
    allow_multiple_responses: bool = True
    collect_email: bool = False
    show_progress_bar: bool = True
    randomize_questions: bool = False
    confirmation_message: Optional[str] = "Thank you for your response!"

class FormModel(BaseModel):
    """Base form model for database operations"""
    title: str = Field(..., description="Form title")
    description: Optional[str] = Field(None, description="Form description")
    unique_link: str = Field(default_factory=lambda: str(uuid.uuid4()), description="Unique form URL identifier")
    is_active: bool = Field(default=True, description="Whether form is active and accepting responses")
    fields: List[FormFieldEmbedded] = Field(default=[], description="List of form fields with their details")
    settings: Optional[FormSettings] = Field(default_factory=FormSettings, description="Form settings")
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    created_by: Optional[str] = Field(None, description="User ID who created the form")
    
    # Analytics fields
    total_responses: int = Field(default=0, description="Total number of responses")
    last_response_at: Optional[datetime] = Field(None, description="Last response timestamp")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "title": "Customer Feedback Survey",
                "description": "Help us improve our services",
                "is_active": True,
                "fields": [
                    {
                        "field_id": "field_id_1",
                        "position": 0,
                        "field_details": {
                            "name": "Rating",
                            "field_type": "single_choice",
                            "options": ["Excellent", "Good", "Average", "Poor"],
                            "is_required": True
                        }
                    }
                ]
            }
        }