from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    PORT: int = 8000
    HOST: str = "0.0.0.0"

    MONGO_URI: str = "mongodb://mongo:27017/onbrain"
    NEO4J_URI: str = "bolt://neo4j:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "password123"

    CHROMA_HOST: str = "chroma"
    CHROMA_PORT: int = 8000

    GROQ_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None

    FIREBASE_PROJECT_ID: Optional[str] = None
    FIREBASE_SERVICE_ACCOUNT_PATH: Optional[str] = None

settings = Settings()
