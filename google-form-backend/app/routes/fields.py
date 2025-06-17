from fastapi import APIRouter, HTTPException, status
from typing import List
from app.database.connection import get_database
from app.schemas.field import Field, FieldCreate, FieldUpdate, FieldInDB
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/fields", tags=["fields"])

@router.post("/", response_model=Field)
async def create_field(field: FieldCreate):
    db = get_database()
    
    field_dict = field.dict()
    field_dict["created_at"] = datetime.utcnow()
    
    result = await db.fields.insert_one(field_dict)
    created_field = await db.fields.find_one({"_id": result.inserted_id})
    
    # Convert ObjectId to string for response
    created_field["id"] = str(created_field["_id"])
    del created_field["_id"]
    
    return Field(**created_field)

@router.get("/", response_model=List[Field])
async def get_fields(skip: int = 0, limit: int = 100):
    db = get_database()
    
    cursor = db.fields.find().skip(skip).limit(limit)
    fields = []
    
    async for field in cursor:
        field["id"] = str(field["_id"])
        del field["_id"]
        fields.append(Field(**field))
    
    return fields

@router.get("/{field_id}", response_model=Field)
async def get_field(field_id: str):
    db = get_database()
    
    if not ObjectId.is_valid(field_id):
        raise HTTPException(status_code=400, detail="Invalid field ID")
    
    field = await db.fields.find_one({"_id": ObjectId(field_id)})
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
    
    field["id"] = str(field["_id"])
    del field["_id"]
    
    return Field(**field)

@router.put("/{field_id}", response_model=Field)
async def update_field(field_id: str, field_update: FieldUpdate):
    db = get_database()
    
    if not ObjectId.is_valid(field_id):
        raise HTTPException(status_code=400, detail="Invalid field ID")
    
    update_data = {k: v for k, v in field_update.dict().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    result = await db.fields.update_one(
        {"_id": ObjectId(field_id)}, 
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Field not found")
    
    updated_field = await db.fields.find_one({"_id": ObjectId(field_id)})
    updated_field["id"] = str(updated_field["_id"])
    del updated_field["_id"]
    
    return Field(**updated_field)

@router.delete("/{field_id}")
async def delete_field(field_id: str):
    db = get_database()
    
    if not ObjectId.is_valid(field_id):
        raise HTTPException(status_code=400, detail="Invalid field ID")
    
    result = await db.fields.delete_one({"_id": ObjectId(field_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Field not found")
    
    return {"message": "Field deleted successfully"}