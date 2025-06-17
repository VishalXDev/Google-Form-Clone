from fastapi import APIRouter, HTTPException, status
from typing import List
from app.database.connection import get_database
from app.schemas.form import Form, FormCreate, FormUpdate, FormInDB
from bson import ObjectId
from datetime import datetime
import uuid

router = APIRouter(prefix="/forms", tags=["forms"])

@router.post("/", response_model=Form)
async def create_form(form: FormCreate):
    db = get_database()
    
    # Verify all fields exist
    field_objects = []
    for field_id in form.field_ids:
        if not ObjectId.is_valid(field_id):
            raise HTTPException(status_code=400, detail=f"Invalid field ID: {field_id}")
        
        field = await db.fields.find_one({"_id": ObjectId(field_id)})
        if not field:
            raise HTTPException(status_code=404, detail=f"Field not found: {field_id}")
        
        field_objects.append(field)
    
    # Create form with embedded field details
    form_fields = []
    for position, (field_id, field_obj) in enumerate(zip(form.field_ids, field_objects)):
        form_fields.append({
            "field_id": field_id,
            "position": position,
            "field_details": {
                "name": field_obj["name"],
                "field_type": field_obj["field_type"],
                "options": field_obj.get("options", []),
                "is_required": field_obj.get("is_required", False)
            }
        })
    
    form_dict = {
        "title": form.title,
        "description": form.description,
        "unique_link": str(uuid.uuid4()),
        "is_active": True,
        "created_at": datetime.utcnow(),
        "fields": form_fields
    }
    
    result = await db.forms.insert_one(form_dict)
    created_form = await db.forms.find_one({"_id": result.inserted_id})
    
    # Convert ObjectId to string for response
    created_form["id"] = str(created_form["_id"])
    del created_form["_id"]
    
    return Form(**created_form)

@router.get("/", response_model=List[Form])
async def get_forms(skip: int = 0, limit: int = 100):
    db = get_database()
    
    cursor = db.forms.find().skip(skip).limit(limit)
    forms = []
    
    async for form in cursor:
        form["id"] = str(form["_id"])
        del form["_id"]
        forms.append(Form(**form))
    
    return forms

@router.get("/{form_id}", response_model=Form)
async def get_form(form_id: str):
    db = get_database()
    
    if not ObjectId.is_valid(form_id):
        raise HTTPException(status_code=400, detail="Invalid form ID")
    
    form = await db.forms.find_one({"_id": ObjectId(form_id)})
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    form["id"] = str(form["_id"])
    del form["_id"]
    
    return Form(**form)

@router.get("/link/{unique_link}", response_model=Form)
async def get_form_by_link(unique_link: str):
    db = get_database()
    
    form = await db.forms.find_one({"unique_link": unique_link})
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    form["id"] = str(form["_id"])
    del form["_id"]
    
    return Form(**form)

@router.put("/{form_id}", response_model=Form)
async def update_form(form_id: str, form_update: FormUpdate):
    db = get_database()
    
    if not ObjectId.is_valid(form_id):
        raise HTTPException(status_code=400, detail="Invalid form ID")
    
    update_data = {k: v for k, v in form_update.dict().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    result = await db.forms.update_one(
        {"_id": ObjectId(form_id)}, 
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Form not found")
    
    updated_form = await db.forms.find_one({"_id": ObjectId(form_id)})
    updated_form["id"] = str(updated_form["_id"])
    del updated_form["_id"]
    
    return Form(**updated_form)

@router.delete("/{form_id}")
async def delete_form(form_id: str):
    db = get_database()
    
    if not ObjectId.is_valid(form_id):
        raise HTTPException(status_code=400, detail="Invalid form ID")
    
    result = await db.forms.delete_one({"_id": ObjectId(form_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Form not found")
    
    return {"message": "Form deleted successfully"}