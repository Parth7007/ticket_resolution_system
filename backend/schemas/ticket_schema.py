from pydantic import BaseModel
from typing import Optional

class TicketRequest(BaseModel):
    subject: str
    body: str
    admin_solution: Optional[str] = None  # Optional input from admin

class TicketResponse(BaseModel):
    subject: str
    body: str
    ticket_type: str
    priority: str
    resolution: str
    admin_solution: Optional[str] = None
