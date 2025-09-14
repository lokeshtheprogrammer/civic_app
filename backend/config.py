import cloudinary
import os
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
  cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME", "del0trhdj"),
  api_key = os.getenv("CLOUDINARY_API_KEY", "711159468917553"),
  api_secret = os.getenv("CLOUDINARY_API_SECRET", "RozEGV9srbag5GjQHaxKCrCWQU4"),
  secure = True
)
