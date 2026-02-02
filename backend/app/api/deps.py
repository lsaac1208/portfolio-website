from typing import Generator
from fastapi import HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import get_current_user
from app.models.models import User

# 统一使用 get_db 依赖（来自 app.db.session）
# 避免重复定义数据库会话依赖


async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """获取当前活跃用户"""
    return current_user


async def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """获取管理员用户，如果用户不是管理员则抛出异常"""
    if current_user.role.lower() != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="需要管理员权限"
        )
    return current_user


def require_role(required_role: str):
    """
    装饰器工厂，创建角色检查依赖
    使用方式: Depends(require_role("ADMIN"))
    """
    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role.lower() != required_role.lower():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"需要 {required_role} 权限"
            )
        return current_user
    return role_checker
