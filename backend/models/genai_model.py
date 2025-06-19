# models/genai_model.py

import os
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_API_KEY = os.getenv("GROQ_API_KEY")  # Set this in your .env

HEADERS = {
    "Authorization": f"Bearer {GROQ_API_KEY}",
    "Content-Type": "application/json"
}

def build_prompt(subject: str, body: str, ticket_type: str, priority: str) -> str:
    """
    Construct a system + user prompt to guide the LLM toward giving relevant step-by-step resolutions.
    """
    return f"""
You are a professional IT support assistant.

Your task is to generate a detailed resolution guide for a user-submitted IT ticket.
Use the information below and be specific, clear, and concise.

TICKET DETAILS:
---------------
Type: {ticket_type}
Priority: {priority}
Subject: {subject}

Description:
{body}

Instructions:
-------------
1. Begin with a short acknowledgment.
2. Provide a **step-by-step** solution to resolve the issue.
3. Mention safety/backup precautions if necessary.
4. Keep the language user-friendly.
5. If it cannot be resolved without expert help, mention that and suggest next steps.

Now, write the resolution:
"""

def call_llama_groq(subject: str, body: str, ticket_type: str, priority: str) -> str:
    """
    Call Groq API with LLaMA 3.3-70B to get resolution for a given ticket.
    """
    prompt = build_prompt(subject, body, ticket_type, priority)

    payload = {
        "model": "llama3-70b-8192",  # Versatile version, supports 8k tokens
        "messages": [
            {"role": "system", "content": "You are an expert IT support assistant."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.5,
        "max_tokens": 800,
        "top_p": 0.9,
        "stream": False
    }

    try:
        response = requests.post(GROQ_API_URL, headers=HEADERS, json=payload, timeout=60)
        response.raise_for_status()
        reply = response.json()["choices"][0]["message"]["content"]
        return reply.strip()
    except requests.exceptions.RequestException as e:
        return f"Error: Failed to generate resolution due to API error: {e}"
