from fastapi import APIRouter, HTTPException, status
from typing import List
from app.database.connection import get_database
from app.schemas.form import Form, FormCreate, FormUpdate
from bson import ObjectId
from datetime import datetime
import uuid
import logging

router = APIRouter(prefix="/forms", tags=["forms"])
logger = logging.getLogger(__name__)


@router.post("/", response_model=Form)
async def create_form(form: FormCreate):
    db = get_database()

    form_fields = []
    for index, field_input in enumerate(form.fields):
        field_data = field_input.field_details
        field_id = str(ObjectId())  # Generate unique field ID

        await db.fields.insert_one({
            "_id": ObjectId(field_id),
            **field_data
        })

        form_fields.append({
            "field_id": field_id,
            "position": index,
            "field_details": field_data
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

    created_form["id"] = str(created_form["_id"])
    del created_form["_id"]

    return Form(**created_form)


@router.get("/", response_model=List[Form])
async def get_forms(skip: int = 0, limit: int = 100):
    db = get_database()
    cursor = db.forms.find().skip(skip).limit(limit)
    forms = []

    async for form in cursor:
        try:
            form["id"] = str(form["_id"])
            del form["_id"]
            forms.append(Form(**form))
        except Exception as e:
            logger.warning(f"Skipping malformed form document: {e}")

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
