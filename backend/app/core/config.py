from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
import os


class Settings(BaseSettings):
    SECRET_KEY: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24小时
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7  # 7天
    DATABASE_URL: str = "sqlite:///./portfolio.db"
    FRONTEND_URL: str = "http://localhost:3000"

    # Email configuration
    SMTP_HOST: str = "smtp.example.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = "your-email@example.com"
    SMTP_PASSWORD: str = "your-email-password"
    FROM_EMAIL: str = "your-email@example.com"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    def validate_settings(self):
        """验证关键配置是否已设置"""
        if not self.SECRET_KEY:
            raise ValueError("SECRET_KEY must be set in environment variables")
        if self.SECRET_KEY == "your-secret-key-change-in-production":
            raise ValueError("SECRET_KEY cannot be the default value - please set a secure secret key")


@lru_cache()
def get_settings() -> Settings:
    settings = Settings()
    settings.validate_settings()
    return settings


settings = get_settings()
