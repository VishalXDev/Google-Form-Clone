from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from bson import ObjectId

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

class FieldResponseData(BaseModel):
    """Individual field response data"""
    field_id: str = Field(..., description="ID of the field being responded to")
    field_name: str = Field(..., description="Name/label of the field")
    field_type: str = Field(..., description="Type of the field")
    value: Union[str, int, float, List[str]] = Field(..., description="Response value")
    
    class Config:
        schema_extra = {
            "example": {
                "field_id": "field_123",
                "field_name": "Full Name",
                "field_type": "text",
                "value": "John Doe"
            }
        }

class ResponseMetadata(BaseModel):
    """Additional metadata for the response"""
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    referrer: Optional[str] = None
    completion_time_seconds: Optional[int] = None  # Time taken to complete form

class ResponseModel(BaseModel):
    """Base response model for database operations"""
    form_id: str = Field(..., description="ID of the form this response belongs to")
    form_title: str = Field(..., description="Title of the form (cached for quick access)")
    respondent_email: Optional[str] = Field(None, description="Email of respondent if collected")
    field_responses: List[FieldResponseData] = Field(..., description="List of field responses")
    metadata: Optional[ResponseMetadata] = Field(default_factory=ResponseMetadata, description="Additional response metadata")
    submitted_at: Optional[datetime] = Field(default_factory=datetime.utcnow, description="Response submission timestamp")
    is_complete: bool = Field(default=True, description="Whether response is complete")
    response_id: Optional[str] = Field(None, description="Unique response identifier")
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "form_id": "form_123",
                "form_title": "Customer Survey",
                "field_responses": [
                    {
                        "field_id": "field_1",
                        "field_name": "Name",
                        "field_type": "text",
                        "value": "John Doe"
                    },
                    {
                        "field_id": "field_2",
                        "field_name": "Rating",
                        "field_type": "single_choice",
                        "value": "Excellent"
                    }
                ],
                "submitted_at": "2025-06-18T10:30:00Z"
            }
        }

class ResponseSummary(BaseModel):
    """Summary model for response analytics"""
    total_responses: int
    completion_rate: float
    average_completion_time: Optional[float]
    field_analytics: Dict[str, Any]  # Per-field analytics
    response_trends: Dict[str, Any]  # Time-based trends