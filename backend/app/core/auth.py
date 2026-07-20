import os
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

firebase_app = None
firebase_init_error = None

is_local_dev = settings.ENVIRONMENT.lower() in ["development", "dev", "local", "test"]

try:
    import firebase_admin
    from firebase_admin import credentials

    service_account_path = settings.FIREBASE_SERVICE_ACCOUNT_PATH

    if service_account_path and os.path.exists(service_account_path):
        try:
            cred = credentials.Certificate(service_account_path)
            firebase_app = firebase_admin.initialize_app(cred)
            logger.info("Firebase Admin SDK initialized successfully from service account file.")
        except Exception as e:
            firebase_init_error = f"Failed to initialize Firebase Admin SDK from certificate: {e}"
            logger.error(firebase_init_error)
            if not is_local_dev:
                raise RuntimeError(firebase_init_error) from e
    else:
        try:
            firebase_app = firebase_admin.initialize_app()
            logger.info("Firebase Admin SDK initialized with default credentials.")
        except Exception as e:
            firebase_init_error = (
                f"Firebase service account not found at '{service_account_path}' and default credentials failed. Error: {e}"
            )
            logger.warning(firebase_init_error)
            if not is_local_dev:
                raise RuntimeError(firebase_init_error) from e
except ImportError as e:
    firebase_init_error = f"firebase-admin library not installed: {e}"
    logger.warning(firebase_init_error)
    if not is_local_dev:
        raise RuntimeError(firebase_init_error) from e
