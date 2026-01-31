import logging
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel, validator
import re

from app.core.config import settings
from app.core.security import get_password_hash, create_access_token, create_refresh_token, verify_password, get_current_user
from app.db.session import get_db
from app.models.models import User
from app.schemas.user import Token, UserCreate, UserResponse
from app.core.limiter import limiter

logger = logging.getLogger(__name__)

# 登录锁定配置
MAX_LOGIN_ATTEMPTS = 5  # 最大失败尝试次数
LOCKOUT_DURATION = timedelta(minutes=15)  # 锁定时长

router = APIRouter(prefix="/auth", tags=["认证"])


class LoginRequest(BaseModel):
    email: str
    password: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


def validate_password_strength(password: str) -> tuple[bool, str]:
    """验证密码强度，返回 (是否通过, 错误信息)"""
    if len(password) < 8:
        return False, "密码长度至少8位"
    if not re.search(r"[A-Z]", password):
        return False, "密码必须包含大写字母"
    if not re.search(r"[a-z]", password):
        return False, "密码必须包含小写字母"
    if not re.search(r"[0-9]", password):
        return False, "密码必须包含数字"
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False, "密码必须包含特殊字符"
    return True, ""


@router.post("/register", response_model=UserResponse)
@limiter.limit("5/minute")  # 限制每分钟5次注册
def register(request: Request, user_data: UserCreate, db: Session = Depends(get_db)):
    try:
        # 检查邮箱是否已存在
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="该邮箱已被注册"
            )

        # 验证密码强度
        is_valid, error_msg = validate_password_strength(user_data.password)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_msg
            )

        # 创建新用户
        hashed_password = get_password_hash(user_data.password)
        new_user = User(
            email=user_data.email,
            hashed_password=hashed_password,
            name=user_data.name
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_user
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to register user")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="注册失败，请稍后重试"
        )


@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute")  # 限制每分钟10次登录尝试
def login(login_data: LoginRequest, request: Request, db: Session = Depends(get_db)):
    # 查找用户
    user = db.query(User).filter(User.email == login_data.email).first()

    # 检查账户是否被锁定
    if user and user.locked_until and user.locked_until > datetime.now(timezone.utc):
        remaining_minutes = int((user.locked_until - datetime.now(timezone.utc)).total_seconds() / 60)
        logger.warning(f"Login attempt on locked account: {login_data.email}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"账户已锁定，请 {remaining_minutes} 分钟后再试"
        )

    if not user or not verify_password(login_data.password, user.hashed_password):
        # 记录失败的登录尝试
        if user:
            user.failed_login_attempts = (user.failed_login_attempts or 0) + 1

            # 如果达到最大失败次数，锁定账户
            if user.failed_login_attempts >= MAX_LOGIN_ATTEMPTS:
                user.locked_until = datetime.now(timezone.utc) + LOCKOUT_DURATION
                db.commit()
                logger.warning(f"Account locked due to failed attempts: {login_data.email}")
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"登录失败次数过多，账户已锁定 {int(LOCKOUT_DURATION.total_seconds() / 60)} 分钟"
                )

            db.commit()

        logger.warning(f"Failed login attempt: {login_data.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="邮箱或密码错误"
        )

    # 登录成功，重置失败计数
    if user.failed_login_attempts:
        user.failed_login_attempts = 0
        user.locked_until = None
        db.commit()

    # 创建 access token 和 refresh token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role},
        expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(data={"sub": user.email})

    logger.info(f"User logged in successfully: {user.email}")
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/refresh", response_model=Token)
def refresh_token(token_request: RefreshTokenRequest, db: Session = Depends(get_db)):
    """刷新访问令牌"""
    from jose import jwt, JWTError

    try:
        payload = jwt.decode(
            token_request.refresh_token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        # 验证是 refresh token
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="无效的令牌类型"
            )
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="无法解析令牌"
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="令牌已过期或无效"
        )

    # 获取用户
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        logger.warning(f"Token refresh failed: user not found for email {email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户不存在"
        )

    # 创建新的 access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role},
        expires_delta=access_token_expires
    )

    logger.info(f"Token refreshed for user: {user.email}")
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user
