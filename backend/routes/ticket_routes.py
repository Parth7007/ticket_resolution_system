from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.ticket_schema import TicketRequest, TicketResponse
from models.ml_model import classify_ticket
from models.genai_model import call_llama_groq
from db.postgres import SessionLocal
from services.ticket_processor import store_ticket

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/submit", response_model=TicketResponse)
def submit_ticket(ticket_data: TicketRequest, db: Session = Depends(get_db)):
    subject = ticket_data.subject
    body = ticket_data.body
    admin_solution = ticket_data.admin_solution if ticket_data.admin_solution else None

    # Get ticket_type and priority from ML model
    ticket_type, priority = classify_ticket(subject, body)

    # Get AI-generated resolution
    resolution = call_llama_groq(subject, body, ticket_type, priority)

    # Store in Supabase (PostgreSQL)
    store_ticket(
        db=db,
        subject=subject,
        body=body,
        ticket_type=ticket_type,
        priority=priority,
        resolution=resolution,
        admin_solution=admin_solution
    )

    return TicketResponse(
        subject=subject,
        body=body,
        ticket_type=ticket_type,
        priority=priority,
        resolution=resolution,
        admin_solution=admin_solution
    )
