from pydantic import BaseModel, ConfigDict, Field, HttpUrl, field_validator
from datetime import datetime
from typing import Optional, List
import re


class PostBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="文章标题")
    slug: str = Field(..., min_length=1, max_length=100, description="URL slug")
    content: str = Field(..., min_length=1, max_length=100000, description="文章内容")
    excerpt: Optional[str] = Field(None, max_length=500, description="文章摘要")
    cover_image: Optional[HttpUrl] = Field(None, description="封面图片URL")
    published: bool = Field(False, description="是否发布")

    @field_validator("slug")
    @classmethod
    def validate_slug(cls, v):
        """验证 slug 格式：只允许字母、数字、连字符、下划线"""
        if not re.match(r"^[a-zA-Z0-9_-]+$", v):
            raise ValueError("slug 只能包含字母、数字、连字符和下划线")
        return v


class PostCreate(PostBase):
    pass


class PostUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = Field(None, min_length=1, max_length=100000)
    excerpt: Optional[str] = Field(None, max_length=500)
    cover_image: Optional[str] = None
    published: Optional[bool] = None


class PostResponse(PostBase):
    id: int
    author_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PostListResponse(BaseModel):
    posts: List[PostResponse]
    total: int
    page: int
    limit: int
