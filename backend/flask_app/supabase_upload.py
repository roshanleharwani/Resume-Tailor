import os
from supabase import create_client, Client
from dotenv import load_dotenv
from uuid import uuid4
import cloudinary
import cloudinary.uploader

load_dotenv()
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)

SUPABASE_BUCKET = "resumes"
SIGNED_URL_EXPIRY = 3600
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Supabase environment variables not set")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def upload_tex_to_supabase(file_path: str, folder: str) -> str:
    if not os.path.exists(file_path):
        raise FileNotFoundError(file_path)

    ext = os.path.splitext(file_path)[1]
    filename = f"{folder}/{uuid4()}{ext}"

    with open(file_path, "rb") as f:
        data = f.read()

    # Upload TEX
    supabase.storage.from_(SUPABASE_BUCKET).upload(
        path=filename,
        file=data,
        file_options={
            "contentType": "text/plain",
            "cacheControl": "3600",
            "upsert": "false",
        },
    )

    # Generate signed URL
    signed = supabase.storage.from_(SUPABASE_BUCKET).create_signed_url(
        path=filename,
        expires_in=SIGNED_URL_EXPIRY,
    )

    return signed["signedURL"]


def upload_pdf_to_cloudinary(file_path: str, folder: str) -> str:
    if not os.path.exists(file_path):
        raise FileNotFoundError(file_path)

    result = cloudinary.uploader.upload(
        file_path,
        resource_type="raw",  # IMPORTANT for PDFs
        folder=folder,
        use_filename=True,
        unique_filename=True,
    )

    # Cloudinary always returns a valid HTTPS URL
    return result["secure_url"]
