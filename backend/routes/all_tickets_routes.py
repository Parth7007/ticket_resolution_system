from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.postgres import SessionLocal
from db.mongo import mongo_db
from bson.json_util import dumps
from bson import ObjectId

router = APIRouter()

# PostgreSQL dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/tickets/all")
async def get_all_tickets(db: Session = Depends(get_db)):
    # ----- Fetch from PostgreSQL -----
    from db.models import Ticket  # adjust if needed
    pg_tickets = db.query(Ticket).all()
    postgres_data = [
        {
            "id": ticket.id,
            "source": "text",
            "subject": ticket.subject,
            "body": ticket.body,
            "ticket_type": ticket.ticket_type,
            "priority": ticket.priority,
            "resolution": ticket.resolution,
            "admin_solution": ticket.admin_solution,
            "created_at": str(ticket.created_at),
        }
        for ticket in pg_tickets
    ]

    # ----- Fetch from MongoDB -----
    ocr_collection = mongo_db["ocr_tickets"]
    mongo_docs = ocr_collection.find()
    mongo_data = []
    for doc in mongo_docs:
        mongo_data.append({
            "id": str(doc.get("_id")),
            "source": "image",
            "subject": doc.get("subject"),
            "body": doc.get("body"),
            "ticket_type": doc.get("ticket_type"),
            "priority": doc.get("priority"),
            "resolution": doc.get("resolution"),
            "admin_solution": doc.get("admin_solution"),
            "image_url": doc.get("image_url"),
            "created_at": doc.get("created_at")
        })

    # ----- Merge & return -----
    return {
        "text_tickets": postgres_data,
        "ocr_tickets": mongo_data,
        "total": len(postgres_data) + len(mongo_data)
    }
