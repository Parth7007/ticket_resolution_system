from fastapi import APIRouter, File, UploadFile, Form, Depends
from sqlalchemy.orm import Session
from db.postgres import SessionLocal
from db.mongo import ocr_collection  # 🆕 MongoDB import
from bson import Binary  # 🆕 For storing image bytes
from datetime import datetime  # 🆕 Timestamp
from utils.ocr import extract_text_from_image
from models.ml_model import classify_ticket
from models.genai_model import call_llama_groq
from services.ticket_processor import store_ticket
from schemas.ticket_schema import TicketResponse

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/submit-image", response_model=TicketResponse)
async def submit_image(
    image: UploadFile = File(...),
    subject: str = Form(...),
    body: str = Form(...),
    admin_solution: str = Form(None),
    db: Session = Depends(get_db)
):
    # Step 1: OCR
    image_bytes = await image.read()
    extracted_text = extract_text_from_image(image_bytes)

    # Step 2: Combine user + OCR text
    full_body = body + " " + extracted_text

    # Step 3: ML Classification
    ticket_type, priority = classify_ticket(subject, full_body)

    # Step 4: GenAI Resolution
    resolution = call_llama_groq(subject, full_body, ticket_type, priority)

    # Step 5: Store in Supabase (PostgreSQL)
    store_ticket(db, subject, full_body, ticket_type, priority, resolution, admin_solution)

    # 🆕 Step 6: Store in MongoDB (OCR metadata + image)
    ocr_collection.insert_one({
        "subject": subject,
        "original_body": body,
        "extracted_text": extracted_text,
        "full_body": full_body,
        "ticket_type": ticket_type,
        "priority": priority,
        "resolution": resolution,
        "admin_solution": admin_solution,
        "image_filename": image.filename,
        "image_bytes": Binary(image_bytes),
        "timestamp": datetime.utcnow()
    })

    # Step 7: Return to frontend
    return TicketResponse(
        subject=subject,
        body=full_body,
        ticket_type=ticket_type,
        priority=priority,
        resolution=resolution,
        admin_solution=admin_solution
    )
