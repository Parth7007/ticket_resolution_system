from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from db.postgres import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)  # Changed from hashed_password to password
    role = Column(String, default="user")
    created_at = Column(DateTime(timezone=True), server_default=func.now())