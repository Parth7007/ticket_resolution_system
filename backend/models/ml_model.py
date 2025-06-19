import os
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from xgboost import XGBClassifier

# Path to the directory containing your .pkl models
MODEL_DIR = "D:\\ticket_system\\ml_model"

tfidf_vectorizer: TfidfVectorizer = joblib.load(os.path.join(MODEL_DIR, "tfidf_vectorizer.pkl"))
xgb_model: XGBClassifier = joblib.load(os.path.join(MODEL_DIR, "xgboost_model.pkl"))
label_encoder = joblib.load(os.path.join(MODEL_DIR, "label_encoder.pkl"))

def classify_ticket(subject: str, body: str) -> tuple[str, str]:
    """
    Predicts the priority of a ticket based on subject + body.
    Returns: ("software", priority)
    """
    combined_text = subject + " " + body
    transformed = tfidf_vectorizer.transform([combined_text])
    prediction = xgb_model.predict(transformed)
    priority = label_encoder.inverse_transform(prediction)[0]

    return "software", priority  # hardcoded "software" for now