import cloudinary
import os
import json
import firebase_admin
from firebase_admin import credentials
from dotenv import load_dotenv

load_dotenv()

# Cloudinary Config
cloudinary.config(
  cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME", "del0trhdj"),
  api_key = os.getenv("CLOUDINARY_API_KEY", "711159468917553"),
  api_secret = os.getenv("CLOUDINARY_API_SECRET", "RozEGV9srbag5GjQHaxKCrCWQU4"),
  secure = True
)

# Firebase Config
try:
    firebase_cred_json_str = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY_JSON")
    if firebase_cred_json_str:
        firebase_cred_dict = json.loads(firebase_cred_json_str)
        cred = credentials.Certificate(firebase_cred_dict)
        firebase_admin.initialize_app(cred)
    else:
        print("WARNING: FIREBASE_SERVICE_ACCOUNT_KEY_JSON not set. Firebase features will be disabled.")
except Exception as e:
    print(f"WARNING: Failed to initialize Firebase Admin SDK: {e}")
