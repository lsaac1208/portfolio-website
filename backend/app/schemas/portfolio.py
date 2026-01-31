from pydantic import BaseModel, ConfigDict, Field, HttpUrl
from datetime import datetime
from typing import Optional


class PortfolioBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100, description="作品标题")
    category: str = Field(..., min_length=1, max_length=50, description="分类")
    description: Optional[str] = Field(None, max_length=1000, description="描述")
    image_url: Optional[HttpUrl] = Field(None, description="图片URL")
    link_url: Optional[HttpUrl] = Field(None, description="作品链接")
    sort_order: int = Field(0, ge=0, description="排序")


class PortfolioCreate(PortfolioBase):
    pass


class PortfolioUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    link_url: Optional[str] = None
    sort_order: Optional[int] = None


class PortfolioResponse(PortfolioBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
