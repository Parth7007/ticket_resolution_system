from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from .postgres import Base

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    ticket_type = Column(String, nullable=False)
    priority = Column(String, nullable=False)
    resolution = Column(Text, nullable=True)
    admin_solution = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())  # 👈 Add this line
