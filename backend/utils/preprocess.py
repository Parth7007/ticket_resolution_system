# utils/preprocess.py

import re

def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"http\S+", "", text)              # remove links
    text = re.sub(r"[^a-zA-Z0-9\s]", "", text)        # remove special chars
    text = re.sub(r"\s+", " ", text).strip()
    return text
