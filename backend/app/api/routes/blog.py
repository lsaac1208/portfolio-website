import logging
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_

from app.db.session import get_db
from app.models.models import Post, User
from app.schemas.post import PostCreate, PostUpdate, PostResponse, PostListResponse
from app.core.security import get_current_user
from app.api.deps import get_admin_user
from app.core.limiter import limiter

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/blog", tags=["博客"])


# ============ 公开端点（无需登录） ============

@router.get("/posts", response_model=PostListResponse)
@limiter.limit("60/minute")  # 限制每分钟60次请求
def get_posts(
    request: Request,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str = None,
    db: Session = Depends(get_db)
):
    """获取已发布的文章列表（公开）"""
    query = db.query(Post).filter(Post.published == True).options(joinedload(Post.author))

    if search:
        query = query.filter(
            or_(
                Post.title.contains(search),
                Post.content.contains(search)
            )
        )

    total = query.count()
    posts = query.order_by(Post.created_at.desc()) \
        .offset((page - 1) * limit) \
        .limit(limit) \
        .all()

    return {"posts": posts, "total": total, "page": page, "limit": limit}


@router.get("/posts/{slug}", response_model=PostResponse)
@limiter.limit("120/minute")  # 限制每分钟120次请求
def get_post(request: Request, slug: str, db: Session = Depends(get_db)):
    """获取文章详情（公开，仅已发布的文章）"""
    post = db.query(Post).filter(Post.slug == slug, Post.published == True).options(joinedload(Post.author)).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="文章不存在")
    return post


# ============ 管理端点（需要管理员权限） ============

@router.post("/posts", response_model=PostResponse)
def create_post(
    post_data: PostCreate,
    current_user: User = Depends(get_admin_user),  # 仅管理员可创建
    db: Session = Depends(get_db)
):
    try:
        post = Post(**post_data.model_dump(), author_id=current_user.id)
        db.add(post)
        db.commit()
        db.refresh(post)
        return post
    except Exception as e:
        db.rollback()
        logger.exception("Failed to create post")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="创建失败，请稍后重试")


@router.put("/posts/{slug}", response_model=PostResponse)
def update_post(
    slug: str,
    post_data: PostUpdate,
    current_user: User = Depends(get_admin_user),  # 仅管理员可更新
    db: Session = Depends(get_db)
):
    try:
        post = db.query(Post).filter(Post.slug == slug).first()
        if not post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="文章不存在")

        for key, value in post_data.model_dump(exclude_unset=True).items():
            setattr(post, key, value)

        db.commit()
        db.refresh(post)
        return post
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to update post")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="更新失败，请稍后重试")


@router.delete("/posts/{slug}")
def delete_post(
    slug: str,
    current_user: User = Depends(get_admin_user),  # 仅管理员可删除
    db: Session = Depends(get_db)
):
    try:
        post = db.query(Post).filter(Post.slug == slug).first()
        if not post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="文章不存在")

        db.delete(post)
        db.commit()
        return {"message": "删除成功"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to delete post")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="删除失败，请稍后重试")
