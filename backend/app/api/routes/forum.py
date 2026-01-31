import logging
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload

from app.db.session import get_db
from app.models.models import Topic, Comment, User
from app.schemas.topic import TopicCreate, TopicUpdate, TopicResponse, TopicListResponse, CommentCreate, CommentResponse
from app.core.security import get_current_user
from app.api.deps import get_admin_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/forum", tags=["论坛"])


@router.get("/topics", response_model=TopicListResponse)
def get_topics(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    total = db.query(Topic).count()
    topics = db.query(Topic).options(joinedload(Topic.author)) \
        .order_by(Topic.created_at.desc()) \
        .offset((page - 1) * limit) \
        .limit(limit) \
        .all()

    return {"topics": topics, "total": total, "page": page, "limit": limit}


@router.get("/topics/{topic_id}", response_model=TopicResponse)
def get_topic(topic_id: int, db: Session = Depends(get_db)):
    topic = db.query(Topic).options(joinedload(Topic.author)) \
        .filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="话题不存在")

    # 增加浏览量
    topic.views += 1
    db.commit()

    return topic


@router.post("/topics", response_model=TopicResponse)
def create_topic(
    topic_data: TopicCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        topic = Topic(**topic_data.model_dump(), author_id=current_user.id)
        db.add(topic)
        db.commit()
        db.refresh(topic)
        return topic
    except Exception as e:
        db.rollback()
        logger.exception("Failed to create topic")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="创建失败，请稍后重试")


@router.put("/topics/{topic_id}", response_model=TopicResponse)
def update_topic(
    topic_id: int,
    topic_data: TopicUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        topic = db.query(Topic).filter(Topic.id == topic_id).first()
        if not topic:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="话题不存在")
        if topic.author_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="无权修改此话题")

        for key, value in topic_data.model_dump(exclude_unset=True).items():
            setattr(topic, key, value)

        db.commit()
        db.refresh(topic)
        return topic
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to update topic")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="更新失败，请稍后重试")


@router.delete("/topics/{topic_id}")
def delete_topic(
    topic_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        topic = db.query(Topic).filter(Topic.id == topic_id).first()
        if not topic:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="话题不存在")
        if topic.author_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="无权删除此话题")

        db.delete(topic)
        db.commit()
        return {"message": "删除成功"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to delete topic")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="删除失败，请稍后重试")


@router.post("/topics/{topic_id}/comments", response_model=CommentResponse)
def add_comment(
    topic_id: int,
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        topic = db.query(Topic).filter(Topic.id == topic_id).first()
        if not topic:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="话题不存在")

        comment = Comment(**comment_data.dict(), author_id=current_user.id, topic_id=topic_id)
        db.add(comment)
        db.commit()
        db.refresh(comment)
        return comment
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to add comment")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="评论失败，请稍后重试")


@router.get("/topics/{topic_id}/comments", response_model=list[CommentResponse])
def get_comments(topic_id: int, db: Session = Depends(get_db)):
    comments = db.query(Comment).options(joinedload(Comment.author)) \
        .filter(Comment.topic_id == topic_id) \
        .order_by(Comment.created_at.desc()).all()
    return comments


# ============ 管理端点（需要管理员权限） ============

@router.get("/admin/topics", response_model=list[TopicResponse])
def admin_get_all_topics(
    search: str = None,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """获取所有话题（仅管理员）"""
    from sqlalchemy import or_
    query = db.query(Topic).options(joinedload(Topic.author))

    if search:
        query = query.filter(Topic.title.contains(search))

    topics = query.order_by(Topic.created_at.desc()).all()
    return topics


@router.delete("/admin/topics/{topic_id}")
def admin_delete_topic(
    topic_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """删除话题（仅管理员）"""
    try:
        topic = db.query(Topic).filter(Topic.id == topic_id).first()
        if not topic:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="话题不存在")

        db.delete(topic)
        db.commit()
        return {"message": "删除成功"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to delete topic (admin)")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="删除失败，请稍后重试")


@router.get("/admin/comments", response_model=list[CommentResponse])
def admin_get_all_comments(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """获取所有评论（仅管理员）"""
    comments = db.query(Comment).options(joinedload(Comment.author)) \
        .order_by(Comment.created_at.desc()).all()
    return comments


@router.delete("/admin/comments/{comment_id}")
def admin_delete_comment(
    comment_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """删除评论（仅管理员）"""
    try:
        comment = db.query(Comment).filter(Comment.id == comment_id).first()
        if not comment:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="评论不存在")

        db.delete(comment)
        db.commit()
        return {"message": "删除成功"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to delete comment (admin)")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="删除失败，请稍后重试")
