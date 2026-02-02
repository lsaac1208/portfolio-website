import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.models import Service, Inquiry, Order, User
from app.schemas.service import (
    ServiceCreate, ServiceUpdate, ServiceResponse,
    InquiryCreate, InquiryResponse, InquiryUpdate,
    OrderCreate, OrderResponse, OrderUpdate
)
from app.core.security import get_current_user
from app.api.deps import get_admin_user
from app.lib.utils import generate_order_no

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/services", tags=["服务"])


# ============ 服务管理端点 ============

@router.get("", response_model=list[ServiceResponse])
def get_services(db: Session = Depends(get_db)):
    services = db.query(Service).filter(Service.active == True).order_by(Service.sort_order.asc()).all()
    return services


# ============ 询价端点 ============
# 公开端点：创建询价（无需登录）
@router.post("/inquiries", response_model=InquiryResponse)
def create_inquiry(inquiry_data: InquiryCreate, db: Session = Depends(get_db)):
    try:
        inquiry = Inquiry(**inquiry_data.model_dump())
        db.add(inquiry)
        db.commit()
        db.refresh(inquiry)
        return inquiry
    except Exception as e:
        db.rollback()
        logger.exception("Failed to create inquiry")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="创建失败，请稍后重试")


# 管理端点：询价列表（仅管理员）
@router.get("/inquiries", response_model=list[InquiryResponse])
def get_inquiries(
    current_user: User = Depends(get_admin_user),  # 仅管理员可查看
    db: Session = Depends(get_db)
):
    inquiries = db.query(Inquiry).order_by(Inquiry.created_at.desc()).all()
    return inquiries


@router.put("/inquiries/{inquiry_id}", response_model=InquiryResponse)
def update_inquiry(
    inquiry_id: int,
    data: InquiryUpdate,  # 使用 Schema 替代 dict
    current_user: User = Depends(get_admin_user),  # 仅管理员可更新
    db: Session = Depends(get_db)
):
    try:
        inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
        if not inquiry:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="询价不存在")

        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(inquiry, key, value)

        db.commit()
        db.refresh(inquiry)
        return inquiry
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to update inquiry")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="更新失败，请稍后重试")


@router.delete("/inquiries/{inquiry_id}")
def delete_inquiry(
    inquiry_id: int,
    current_user: User = Depends(get_admin_user),  # 仅管理员可删除
    db: Session = Depends(get_db)
):
    try:
        inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
        if not inquiry:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="询价不存在")

        db.delete(inquiry)
        db.commit()
        return {"message": "询价已删除"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to delete inquiry")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="删除失败，请稍后重试")


# ============ 订单端点 ============

@router.post("/orders", response_model=OrderResponse)
def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        order = Order(
            **order_data.dict(),
            order_no=generate_order_no(),
            client_id=current_user.id
        )
        db.add(order)
        db.commit()
        db.refresh(order)
        return order
    except Exception as e:
        db.rollback()
        logger.exception("Failed to create order")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="创建失败，请稍后重试")


@router.get("/orders", response_model=list[OrderResponse])
def get_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 用户只能查看自己的订单
    orders = db.query(Order).filter(Order.client_id == current_user.id) \
        .order_by(Order.created_at.desc()).all()
    return orders


@router.get("/orders/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 验证订单属于当前用户
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.client_id == current_user.id
    ).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="订单不存在或无权访问")
    return order


@router.put("/orders/{order_id}", response_model=OrderResponse)
def update_order(
    order_id: int,
    data: OrderUpdate,  # 使用 Schema 替代 dict
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # 验证订单属于当前用户
        order = db.query(Order).filter(
            Order.id == order_id,
            Order.client_id == current_user.id
        ).first()
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="订单不存在或无权访问")

        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(order, key, value)

        db.commit()
        db.refresh(order)
        return order
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to update order")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="更新失败，请稍后重试")


# ============ 服务 CRUD 端点（放在最后避免路由冲突）===========

@router.post("", response_model=ServiceResponse)
def create_service(
    service_data: ServiceCreate,
    current_user: User = Depends(get_admin_user),  # 仅管理员可创建
    db: Session = Depends(get_db)
):
    try:
        service = Service(**service_data.model_dump())
        db.add(service)
        db.commit()
        db.refresh(service)
        return service
    except Exception as e:
        db.rollback()
        logger.exception("Failed to create service")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="创建失败，请稍后重试")


@router.get("/{slug}", response_model=ServiceResponse)
def get_service(slug: str, db: Session = Depends(get_db)):
    service = db.query(Service).filter(Service.slug == slug, Service.active == True).first()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="服务不存在")
    return service


@router.put("/{slug}", response_model=ServiceResponse)
def update_service(
    slug: str,
    service_data: ServiceUpdate,
    current_user: User = Depends(get_admin_user),  # 仅管理员可更新
    db: Session = Depends(get_db)
):
    try:
        service = db.query(Service).filter(Service.slug == slug).first()
        if not service:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="服务不存在")

        for key, value in service_data.model_dump(exclude_unset=True).items():
            setattr(service, key, value)

        db.commit()
        db.refresh(service)
        return service
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to update service")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="更新失败，请稍后重试")


@router.delete("/{slug}")
def delete_service(
    slug: str,
    current_user: User = Depends(get_admin_user),  # 仅管理员可删除
    db: Session = Depends(get_db)
):
    try:
        service = db.query(Service).filter(Service.slug == slug).first()
        if not service:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="服务不存在")

        # 软删除：设置为不活跃
        service.active = False
        db.commit()
        return {"message": "服务已删除"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to delete service")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="删除失败，请稍后重试")
