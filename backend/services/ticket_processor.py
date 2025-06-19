# services/ticket_processor.py

from sqlalchemy.orm import Session
from db.models import Ticket
from utils.preprocess import clean_text
from models.ml_model import classify_ticket  # Updated name
from models.genai_model import call_llama_groq  # Updated for llama usage

def process_ticket(subject: str, body: str) -> dict:
    # Preprocess combined text
    full_text = clean_text(subject + " " + body)

    # Predict using ML model (currently returns "software", priority)
    ticket_type, priority = classify_ticket(subject, body)

    # Generate solution using GenAI
    resolution = call_llama_groq(subject, body, ticket_type, priority)

    return {
        "ticket_type": ticket_type,
        "priority": priority,
        "resolution": resolution
    }


def store_ticket(
    db: Session,
    subject: str,
    body: str,
    ticket_type: str,
    priority: str,
    resolution: str,
    admin_solution: str = None
):
    ticket = Ticket(
        subject=subject,
        body=body,
        ticket_type=ticket_type,
        priority=priority,
        resolution=resolution,
        admin_solution=admin_solution
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket
