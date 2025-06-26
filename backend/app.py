from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import ticket_routes, ocr_routes

from routes.all_tickets_routes import router as all_tickets_router

app = FastAPI(
    title="AI Helpdesk Ticket Resolution System",
    description="Automatically classify tickets and generate resolutions using ML + GenAI.",
    version="1.0.0"
)

# Allow frontend access (adjust origins for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include your ticket-related routes
app.include_router(ticket_routes.router, prefix="/api/tickets", tags=["Tickets"])

app.include_router(ocr_routes.router, prefix="/api/ocr", tags=["OCR"])

app.include_router(all_tickets_router, prefix="/api")
@app.get("/")
def root():
    return {"message": "AI Helpdesk Backend is running"}
