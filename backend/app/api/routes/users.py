import logging
from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.db.session import get_db
from app.models.models import User
from app.schemas.user import UserResponse, UserUpdate
from app.core.security import get_current_user, get_password_hash
from app.api.deps import get_admin_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/users", tags=["用户管理"])


@router.get("", response_model=list[UserResponse])
def get_users(
    search: str = None,
    current_user: User = Depends(get_admin_user),  # 仅管理员可访问
    db: Session = Depends(get_db)
):
    """获取用户列表（仅管理员）"""
    query = db.query(User)

    if search:
        query = query.filter(
            or_(
                User.name.contains(search),
                User.email.contains(search)
            )
        )

    users = query.order_by(User.created_at.desc()).all()
    return users


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    current_user: User = Depends(get_admin_user),  # 仅管理员可访问
    db: Session = Depends(get_db)
):
    """获取单个用户信息（仅管理员）"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="用户不存在")
    return user


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_data: UserUpdate,
    current_user: User = Depends(get_admin_user),  # 仅管理员可更新
    db: Session = Depends(get_db)
):
    """更新用户信息（仅管理员）"""
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="用户不存在")

        # 不能修改最后一个管理员
        if user.role == "ADMIN":
            admin_count = db.query(User).filter(User.role == "ADMIN").count()
            if admin_count <= 1 and user_data.role and user_data.role != "ADMIN":
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="不能移除最后一个管理员")

        for key, value in user_data.model_dump(exclude_unset=True).items():
            setattr(user, key, value)

        db.commit()
        db.refresh(user)
        return user
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to update user")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="更新失败，请稍后重试")


@router.put("/{user_id}/role")
def update_user_role(
    user_id: int,
    data: dict = Body(...),  # 接受 body
    current_user: User = Depends(get_admin_user),  # 仅管理员可更新
    db: Session = Depends(get_db)
):
    """更新用户角色（仅管理员）"""
    role = data.get("role")
    if not role:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="角色字段必填")

    # 兼容大小写
    role_lower = role.lower()
    if role_lower not in ["user", "admin"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="无效的角色")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="用户不存在")

    # 不能修改最后一个管理员
    if user.role.lower() == "admin" and role_lower != "admin":
        admin_count = db.query(User).filter(User.role.lower() == "admin").count()
        if admin_count <= 1:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="不能移除最后一个管理员")

    user.role = role_lower  # 使用小写
    db.commit()
    return {"message": "角色更新成功"}


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    current_user: User = Depends(get_admin_user),  # 仅管理员可删除
    db: Session = Depends(get_db)
):
    """删除用户（仅管理员，不能删除自己或最后一个管理员）"""
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="用户不存在")

        # 不能删除自己
        if user.id == current_user.id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="不能删除当前登录用户")

        # 不能删除最后一个管理员
        if user.role == "ADMIN":
            admin_count = db.query(User).filter(User.role == "ADMIN").count()
            if admin_count <= 1:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="不能删除最后一个管理员")

        db.delete(user)
        db.commit()
        return {"message": "用户删除成功"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to delete user")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="删除失败，请稍后重试")


@router.get("/stats/count")
def get_user_stats(
    current_user: User = Depends(get_admin_user),  # 仅管理员可访问
    db: Session = Depends(get_db)
):
    """获取用户统计信息（仅管理员）"""
    total = db.query(User).count()
    admins = db.query(User).filter(User.role == "ADMIN").count()
    regular_users = total - admins

    return {
        "total": total,
        "admins": admins,
        "regular_users": regular_users
    }
