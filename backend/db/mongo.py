from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
mongo_db = client["ticket_system"]
ocr_collection = mongo_db["ocr_tickets"]
