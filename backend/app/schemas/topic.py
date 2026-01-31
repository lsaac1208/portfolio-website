from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional, List


class TopicBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="话题标题")
    content: str = Field(..., min_length=1, max_length=10000, description="话题内容")


class TopicCreate(TopicBase):
    pass


class TopicUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = Field(None, min_length=1, max_length=10000)


class TopicResponse(TopicBase):
    id: int
    author_id: int
    views: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TopicListResponse(BaseModel):
    topics: List[TopicResponse]
    total: int
    page: int
    limit: int


class CommentBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=5000, description="评论内容")


class CommentCreate(CommentBase):
    pass


class CommentResponse(CommentBase):
    id: int
    author_id: int
    topic_id: Optional[int] = None
    post_id: Optional[int] = None
    created_at: datetime
    likes: int = 0

    model_config = ConfigDict(from_attributes=True)
