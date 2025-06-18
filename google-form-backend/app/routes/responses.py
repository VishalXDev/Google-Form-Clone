from fastapi import APIRouter, HTTPException, status
from typing import List
from app.database.connection import get_database
from app.schemas.response import FormResponse, FormResponseCreate
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/responses", tags=["responses"])

@router.post("/", response_model=FormResponse)
async def submit_response(response: FormResponseCreate):
    db = get_database()
    
    # Verify form exists
    if not ObjectId.is_valid(response.form_id):
        raise HTTPException(status_code=400, detail="Invalid form ID")
    
    form = await db.forms.find_one({"_id": ObjectId(response.form_id)})
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    # Validate field responses against form fields
    form_field_ids = [field["field_id"] for field in form.get("fields", [])]
    response_field_ids = [fr.field_id for fr in response.field_responses]
    
    for field_id in response_field_ids:
        if field_id not in form_field_ids:
            raise HTTPException(
                status_code=400, 
                detail=f"Field {field_id} is not part of this form"
            )
    
    # Create response document
    response_dict = {
        "form_id": response.form_id,
        "submitted_at": datetime.utcnow(),
        "field_responses": [
            {
                "field_id": fr.field_id,
                "value": fr.value
            }
            for fr in response.field_responses
        ]
    }
    
    result = await db.responses.insert_one(response_dict)
    created_response = await db.responses.find_one({"_id": result.inserted_id})
    
    # Convert ObjectId to string for response
    created_response["id"] = str(created_response["_id"])
    del created_response["_id"]
    
    return FormResponse(**created_response)

@router.get("/form/{form_id}", response_model=List[FormResponse])
async def get_form_responses(form_id: str):
    db = get_database()
    
    if not ObjectId.is_valid(form_id):
        raise HTTPException(status_code=400, detail="Invalid form ID")
    
    cursor = db.responses.find({"form_id": form_id})
    responses = []
    
    async for response in cursor:
        response["id"] = str(response["_id"])
        del response["_id"]
        responses.append(FormResponse(**response))
    
    return responses

@router.get("/{response_id}", response_model=FormResponse)
async def get_response(response_id: str):
    db = get_database()
    
    if not ObjectId.is_valid(response_id):
        raise HTTPException(status_code=400, detail="Invalid response ID")
    
    response = await db.responses.find_one({"_id": ObjectId(response_id)})
    if not response:
        raise HTTPException(status_code=404, detail="Response not found")
    
    response["id"] = str(response["_id"])
    del response["_id"]
    
    return FormResponse(**response)

@router.get("/form/{form_id}/summary")
async def get_form_response_summary(form_id: str):
    db = get_database()
    
    if not ObjectId.is_valid(form_id):
        raise HTTPException(status_code=400, detail="Invalid form ID")
    
    # Get form details
    form = await db.forms.find_one({"_id": ObjectId(form_id)})
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    # Get all responses for this form
    cursor = db.responses.find({"form_id": form_id})
    responses = []
    async for response in cursor:
        responses.append(response)
    
    # Create summary with field names
    summary = {
        "form_title": form["title"],
        "total_responses": len(responses),
        "responses": []
    }
    
    for response in responses:
        response_data = {
            "response_id": str(response["_id"]),
            "submitted_at": response["submitted_at"],
            "answers": {}
        }
        
        # Map field responses to field names
        for field_response in response["field_responses"]:
            field_id = field_response["field_id"]
            # Find field details in form
            field_details = None
            for form_field in form.get("fields", []):
                if form_field["field_id"] == field_id:
                    field_details = form_field["field_details"]
                    break
            
            field_name = field_details["name"] if field_details else f"Field_{field_id}"
            response_data["answers"][field_name] = field_response["value"]
        
        summary["responses"].append(response_data)
    
    return summary