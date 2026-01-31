import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.models import Portfolio, User
from app.core.security import get_current_user
from app.api.deps import get_admin_user
from app.schemas.portfolio import PortfolioCreate, PortfolioUpdate, PortfolioResponse

logger = logging.getLogger(__name__)

# 有效的作品集分类列表
VALID_CATEGORIES = {"design", "photography", "illustration", "ui-ux", "3d", "video", "other"}

router = APIRouter(prefix="/portfolio", tags=["作品集"])


@router.get("")
def get_portfolio_items(category: str | None = None, db: Session = Depends(get_db)):
    # 验证分类参数
    if category and category not in VALID_CATEGORIES:
        raise HTTPException(
            status_code=400,
            detail=f"无效的分类，支持的分类: {', '.join(sorted(VALID_CATEGORIES))}"
        )

    query = db.query(Portfolio)
    if category:
        query = query.filter(Portfolio.category == category)
    items = query.order_by(Portfolio.sort_order.asc(), Portfolio.created_at.desc()).all()
    return items


@router.get("/{item_id}", response_model=PortfolioResponse)
def get_portfolio_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Portfolio).filter(Portfolio.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="作品不存在")
    return item


@router.post("", response_model=PortfolioResponse)
def create_portfolio_item(
    data: PortfolioCreate,
    current_user: User = Depends(get_admin_user),  # 仅管理员可创建
    db: Session = Depends(get_db)
):
    try:
        item = Portfolio(**data.model_dump())
        db.add(item)
        db.commit()
        db.refresh(item)
        return item
    except Exception as e:
        db.rollback()
        logger.exception("Failed to create portfolio item")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="创建失败，请稍后重试")


@router.put("/{item_id}", response_model=PortfolioResponse)
def update_portfolio_item(
    item_id: int,
    data: PortfolioUpdate,  # 使用 Schema 替代 dict
    current_user: User = Depends(get_admin_user),  # 仅管理员可更新
    db: Session = Depends(get_db)
):
    try:
        item = db.query(Portfolio).filter(Portfolio.id == item_id).first()
        if not item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="作品不存在")

        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(item, key, value)

        db.commit()
        db.refresh(item)
        return item
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to update portfolio item")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="更新失败，请稍后重试")


@router.delete("/{item_id}")
def delete_portfolio_item(
    item_id: int,
    current_user: User = Depends(get_admin_user),  # 仅管理员可删除
    db: Session = Depends(get_db)
):
    try:
        item = db.query(Portfolio).filter(Portfolio.id == item_id).first()
        if not item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="作品不存在")

        db.delete(item)
        db.commit()
        return {"message": "删除成功"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to delete portfolio item")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="删除失败，请稍后重试")
