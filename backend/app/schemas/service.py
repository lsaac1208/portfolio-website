from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional, List


class ServiceBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="服务名称")
    slug: str = Field(..., min_length=1, max_length=100, description="URL slug")
    description: str = Field(..., min_length=1, max_length=500, description="服务描述")
    content: Optional[str] = Field(None, description="详细介绍")
    price_type: str = Field("fixed", description="定价方式: fixed/hourly/custom")
    price_from: Optional[int] = Field(None, ge=0, description="起始价格")
    price_to: Optional[int] = Field(None, ge=0, description="结束价格")
    icon: Optional[str] = Field(None, description="图标URL")
    features: Optional[List[str]] = Field(None, description="功能列表")
    estimated_days: Optional[int] = Field(None, ge=1, le=365, description="预估天数")
    sort_order: int = Field(0, ge=0, description="排序")
    active: bool = Field(True, description="是否激活")


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, min_length=1, max_length=500)
    content: Optional[str] = None
    price_type: Optional[str] = None
    price_from: Optional[int] = Field(None, ge=0)
    price_to: Optional[int] = Field(None, ge=0)
    icon: Optional[str] = None
    features: Optional[List[str]] = None
    estimated_days: Optional[int] = Field(None, ge=1, le=365)
    sort_order: Optional[int] = Field(None, ge=0)
    active: Optional[bool] = None


class ServiceResponse(ServiceBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class InquiryBase(BaseModel):
    client_name: str = Field(..., min_length=1, max_length=100, description="客户姓名")
    client_email: str = Field(..., description="客户邮箱")
    client_phone: Optional[str] = Field(None, description="客户电话")
    service_id: Optional[int] = Field(None, description="服务ID")
    project_type: str = Field(..., min_length=1, max_length=100, description="项目类型")
    budget: Optional[str] = Field(None, description="预算范围")
    timeline: Optional[str] = Field(None, description="时间安排")
    description: str = Field(..., min_length=1, max_length=5000, description="需求描述")


class InquiryCreate(InquiryBase):
    pass


class InquiryUpdate(BaseModel):
    """询价更新 Schema - 明确允许更新的字段"""
    status: Optional[str] = None
    notes: Optional[str] = Field(None, max_length=2000, description="内部备注")
    budget: Optional[str] = None
    timeline: Optional[str] = None


class InquiryResponse(InquiryBase):
    id: int
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    service: Optional[ServiceResponse] = None

    model_config = ConfigDict(from_attributes=True)


class OrderBase(BaseModel):
    service_id: int = Field(..., description="服务ID")
    total_amount: int = Field(..., ge=0, description="订单金额")
    deposit: int = Field(0, ge=0, description="预付款")
    description: str = Field(..., min_length=1, max_length=5000, description="需求描述")
    requirements: Optional[str] = Field(None, description="详细需求")


class OrderCreate(OrderBase):
    pass


class OrderUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = Field(None, max_length=2000)
    total_amount: Optional[int] = Field(None, ge=0)
    deposit: Optional[int] = Field(None, ge=0)


class OrderResponse(OrderBase):
    id: int
    order_no: str
    client_id: int
    status: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    client: Optional["UserResponse"] = None
    service: Optional[ServiceResponse] = None

    model_config = ConfigDict(from_attributes=True)


# Forward reference for UserResponse
from app.schemas.user import UserResponse
OrderResponse.model_rebuild()
