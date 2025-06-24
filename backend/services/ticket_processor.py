# services/ticket_processor.py

from sqlalchemy.orm import Session
from db.models import Ticket
from utils.preprocess import clean_text
from models.ml_model import classify_ticket
from models.genai_model import call_llama_groq

def process_ticket(subject: str, body: str) -> dict:
    # Clean combined text
    combined_text = clean_text(subject + " " + body)

    # Predict ticket type and priority using ML model
    ticket_type, priority = classify_ticket(combined_text)

    # Generate resolution using GenAI (Groq LLaMA 3)
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
    return ticket  # Optional: useful for logging or debugging
