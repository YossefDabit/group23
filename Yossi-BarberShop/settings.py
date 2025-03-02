import os
from dotenv import load_dotenv

# Load all environment variables from .env file
load_dotenv()

# MongoDB configuration
MONGO_URI = os.getenv('MONGO_URI')
DB_NAME = os.getenv('MONGO_DB_NAME')

# Flask secret key (useful for sessions if needed)
SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key')

# Optional: If you want to add other config values later (email service, etc.), you can
