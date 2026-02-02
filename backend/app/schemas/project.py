from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional, List


class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="项目名称")
    slug: str = Field(..., min_length=1, max_length=100, description="URL slug")
    description: str = Field(..., min_length=1, max_length=500, description="简短描述")
    content: Optional[str] = Field(None, description="详细介绍")
    cover_image: Optional[str] = Field(None, description="封面图片URL")
    tech_stack: Optional[List[str]] = Field(None, description="技术栈列表")
    github_url: Optional[str] = Field(None, description="GitHub链接")
    demo_url: Optional[str] = Field(None, description="演示链接")
    featured: bool = Field(False, description="是否精选")
    sort_order: int = Field(0, ge=0, description="排序")


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    cover_image: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    featured: Optional[bool] = None
    sort_order: Optional[int] = None


class ProjectResponse(ProjectBase):
    id: int
    author_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProjectListResponse(BaseModel):
    projects: List[ProjectResponse]
    total: int
