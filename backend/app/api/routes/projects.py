import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.models import Project, User
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from app.core.security import get_current_user
from app.api.deps import get_admin_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/projects", tags=["项目"])


@router.get("", response_model=list[ProjectResponse])
def get_projects(featured: bool = None, db: Session = Depends(get_db)):
    query = db.query(Project)
    if featured is not None:
        query = query.filter(Project.featured == featured)
    projects = query.order_by(Project.sort_order.asc(), Project.created_at.desc()).all()
    return projects


@router.get("/{slug}", response_model=ProjectResponse)
def get_project(slug: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.slug == slug).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="项目不存在")
    return project


@router.post("", response_model=ProjectResponse)
def create_project(
    project_data: ProjectCreate,
    current_user: User = Depends(get_admin_user),  # 仅管理员可创建
    db: Session = Depends(get_db)
):
    try:
        project = Project(**project_data.model_dump(), author_id=current_user.id)
        db.add(project)
        db.commit()
        db.refresh(project)
        return project
    except Exception as e:
        db.rollback()
        logger.exception("Failed to create project")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="创建失败，请稍后重试")


@router.put("/{slug}", response_model=ProjectResponse)
def update_project(
    slug: str,
    project_data: ProjectUpdate,
    current_user: User = Depends(get_admin_user),  # 仅管理员可更新
    db: Session = Depends(get_db)
):
    try:
        project = db.query(Project).filter(Project.slug == slug).first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="项目不存在")

        for key, value in project_data.model_dump(exclude_unset=True).items():
            setattr(project, key, value)

        db.commit()
        db.refresh(project)
        return project
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to update project")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="更新失败，请稍后重试")


@router.delete("/{slug}")
def delete_project(
    slug: str,
    current_user: User = Depends(get_admin_user),  # 仅管理员可删除
    db: Session = Depends(get_db)
):
    try:
        project = db.query(Project).filter(Project.slug == slug).first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="项目不存在")

        db.delete(project)
        db.commit()
        return {"message": "删除成功"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to delete project")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="删除失败，请稍后重试")
