# FastAPI 后端 - 测试配置文件

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool

# 使用内存 SQLite 进行测试
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"


@pytest.fixture(scope="session")
def db_engine():
    """创建测试数据库引擎"""
    from app.models.models import Base

    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    return engine


@pytest.fixture(scope="function")
def db_session(db_engine):
    """创建测试数据库会话"""
    from app.models.models import Base

    # 创建所有表
    Base.metadata.create_all(bind=db_engine)

    session = sessionmaker(autocommit=False, autoflush=False, bind=db_engine)()
    try:
        yield session
    finally:
        session.rollback()
        session.close()
        # 清除所有数据
        Base.metadata.drop_all(bind=db_engine)


@pytest.fixture(scope="function")
def client(db_engine):
    """创建测试客户端"""
    from fastapi.testclient import TestClient
    from app.db.session import get_db
    from app.main import app

    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=db_engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as c:
        yield c

    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def admin_user(client):
    """创建并返回管理员用户和token"""
    # 注册管理员用户
    client.post(
        "/api/auth/register",
        json={
            "email": "pytest_admin@test.com",
            "password": "Admin@123456",
            "name": "PyTest Admin"
        }
    )

    # 登录获取 token
    response = client.post(
        "/api/auth/login",
        json={
            "email": "pytest_admin@test.com",
            "password": "Admin@123456"
        }
    )

    token = response.json()["access_token"]
    return {"token": token}


@pytest.fixture(scope="function")
def normal_user(client):
    """创建并返回普通用户和token"""
    # 注册普通用户
    client.post(
        "/api/auth/register",
        json={
            "email": "pytest_user@test.com",
            "password": "User@123456",
            "name": "PyTest User"
        }
    )

    # 登录获取 token
    response = client.post(
        "/api/auth/login",
        json={
            "email": "pytest_user@test.com",
            "password": "User@123456"
        }
    )

    token = response.json()["access_token"]
    return {"token": token}


def get_auth_header(token: str) -> dict:
    """生成认证请求头"""
    return {"Authorization": f"Bearer {token}"}
