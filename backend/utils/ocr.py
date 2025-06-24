import easyocr
import numpy as np
import cv2
import io
from PIL import Image

reader = easyocr.Reader(['en'], gpu=False)

def extract_text_from_image(image_bytes: bytes) -> str:
    # Convert bytes to numpy array
    image_stream = io.BytesIO(image_bytes)
    image = Image.open(image_stream).convert("RGB")
    image_np = np.array(image)

    # Convert RGB to BGR (because OpenCV uses BGR)
    image_cv = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)

    # OCR
    results = reader.readtext(image_cv)

    # Combine text parts
    extracted_text = " ".join([text for _, text, _ in results])
    return extracted_text
