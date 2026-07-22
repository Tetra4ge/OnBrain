from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import model_validator
from typing import Optional

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    ENVIRONMENT: str = "development"

    PORT: int = 8000
    HOST: str = "0.0.0.0"

    MONGO_URI: str = "mongodb://root:rootpassword@mongo:27017/onbrain?authSource=admin"
    NEO4J_URI: str = "bolt://neo4j:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "strongpassword"

    CHROMA_HOST: str = "chroma"
    CHROMA_PORT: int = 8000
    CHROMA_API_KEY: Optional[str] = None
    CHROMA_TENANT: Optional[str] = None
    CHROMA_DATABASE: str = "Onbrain"

    GROQ_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    USE_LLM_EXTRACTION: bool = False
    USE_GENERATIVE_COPILOT: bool = False

    FIREBASE_PROJECT_ID: Optional[str] = None
    FIREBASE_SERVICE_ACCOUNT_PATH: Optional[str] = None

    @model_validator(mode="after")
    def validate_production_credentials(self) -> "Settings":
        if self.ENVIRONMENT.lower() not in ["development", "dev", "local", "test"]:
            if "password123" in self.NEO4J_PASSWORD or not self.NEO4J_PASSWORD:
                raise ValueError("NEO4J_PASSWORD must be configured with a secure non-default password in production.")
            if "@" not in self.MONGO_URI:
                raise ValueError("MONGO_URI must include authentication credentials in production.")
        return self

settings = Settings()
