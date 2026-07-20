import os
import logging
import firebase_admin
from firebase_admin import credentials
from app.core.config import settings

logger = logging.getLogger(__name__)

# Initialize Firebase Admin SDK
firebase_app = None

service_account_path = settings.FIREBASE_SERVICE_ACCOUNT_PATH

if service_account_path and os.path.exists(service_account_path):
    try:
        cred = credentials.Certificate(service_account_path)
        firebase_app = firebase_admin.initialize_app(cred)
        logger.info("Firebase Admin SDK initialized successfully from service account file.")
    except Exception as e:
        logger.error(f"Failed to initialize Firebase Admin SDK from certificate: {e}")
else:
    try:
        # Fallback to application default credentials (useful in cloud environments)
        firebase_app = firebase_admin.initialize_app()
        logger.info("Firebase Admin SDK initialized with default credentials.")
    except Exception as e:
        logger.warning(
            f"Firebase service account not found at '{service_account_path}' and default credentials failed. "
            f"Authentication features will be disabled. Error: {e}"
        )
