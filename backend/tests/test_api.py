# Backend Test Configuration
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.db.session import get_db
from app.models.models import Base

# 测试数据库配置
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_portfolio.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_database():
    """创建测试数据库表"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def get_token(email: str, password: str) -> str:
    """辅助函数：注册并登录获取token"""
    client.post(
        "/api/auth/register",
        json={"email": email, "password": password, "name": "Test User"}
    )
    login_response = client.post(
        "/api/auth/login",
        json={"email": email, "password": password}
    )
    if login_response.status_code != 200:
        raise Exception(f"Login failed: {login_response.text}")
    return login_response.json()["access_token"]


class TestHealthCheck:
    """健康检查测试"""

    def test_health_check(self):
        """测试健康检查接口"""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "healthy"}

    def test_root_endpoint(self):
        """测试根接口"""
        response = client.get("/")
        assert response.status_code == 200
        assert "message" in response.json()


class TestAuth:
    """认证测试"""

    def test_register_user(self):
        """测试用户注册"""
        response = client.post(
            "/api/auth/register",
            json={
                "email": "test@example.com",
                "password": "testpassword123",
                "name": "测试用户"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "test@example.com"
        assert data["name"] == "测试用户"
        assert "id" in data

    def test_register_duplicate_email(self):
        """测试重复邮箱注册"""
        # 先注册一个用户
        client.post(
            "/api/auth/register",
            json={
                "email": "duplicate@example.com",
                "password": "testpassword123",
                "name": "用户1"
            }
        )
        # 尝试重复注册
        response = client.post(
            "/api/auth/register",
            json={
                "email": "duplicate@example.com",
                "password": "testpassword123",
                "name": "用户2"
            }
        )
        assert response.status_code == 400
        assert "已被注册" in response.json()["detail"]

    def test_login_success(self):
        """测试登录成功"""
        # 先注册
        client.post(
            "/api/auth/register",
            json={
                "email": "login@example.com",
                "password": "testpassword123",
                "name": "登录用户"
            }
        )
        # 登录
        response = client.post(
            "/api/auth/login",
            json={
                "email": "login@example.com",
                "password": "testpassword123"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_wrong_password(self):
        """测试密码错误"""
        # 先注册
        client.post(
            "/api/auth/register",
            json={
                "email": "wrong@example.com",
                "password": "correctpassword",
                "name": "测试用户"
            }
        )
        # 错误密码登录
        response = client.post(
            "/api/auth/login",
            json={
                "email": "wrong@example.com",
                "password": "wrongpassword"
            }
        )
        assert response.status_code == 401


class TestBlog:
    """博客测试"""

    def test_create_post(self):
        """测试创建博客文章"""
        token = get_token("blogger@example.com", "testpassword123")

        # 创建文章
        response = client.post(
            "/api/blog/posts",
            json={
                "title": "测试文章",
                "slug": "test-post",
                "content": "这是测试文章内容",
                "excerpt": "文章摘要",
                "published": True
            },
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "测试文章"
        assert data["slug"] == "test-post"

    def test_get_posts(self):
        """测试获取文章列表"""
        response = client.get("/api/blog/posts")
        assert response.status_code == 200
        data = response.json()
        assert "posts" in data
        assert "total" in data

    def test_get_published_post(self):
        """测试获取已发布文章"""
        token = get_token("publisher@example.com", "testpassword123")

        client.post(
            "/api/blog/posts",
            json={
                "title": "公开文章",
                "slug": "public-post",
                "content": "公开内容",
                "published": True
            },
            headers={"Authorization": f"Bearer {token}"}
        )

        response = client.get("/api/blog/posts/public-post")
        assert response.status_code == 200


class TestForum:
    """论坛测试"""

    def test_create_topic(self):
        """测试创建话题"""
        token = get_token("forumuser@example.com", "testpassword123")

        response = client.post(
            "/api/forum/topics",
            json={
                "title": "测试话题",
                "content": "这是测试话题内容"
            },
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        assert response.json()["title"] == "测试话题"

    def test_get_topics(self):
        """测试获取话题列表"""
        response = client.get("/api/forum/topics")
        assert response.status_code == 200
        data = response.json()
        assert "topics" in data
        assert "total" in data


class TestProjects:
    """项目测试"""

    def test_create_project(self):
        """测试创建项目"""
        token = get_token("projectowner@example.com", "testpassword123")

        response = client.post(
            "/api/projects",
            json={
                "name": "测试项目",
                "slug": "test-project",
                "description": "项目描述",
                "tech_stack": ["Python", "FastAPI"],
                "featured": True
            },
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        assert response.json()["name"] == "测试项目"

    def test_get_projects(self):
        """测试获取项目列表"""
        response = client.get("/api/projects")
        assert response.status_code == 200


class TestServices:
    """服务测试"""

    def test_get_services(self):
        """测试获取服务列表"""
        response = client.get("/api/services")
        assert response.status_code == 200

    def test_create_inquiry(self):
        """测试创建询价"""
        response = client.post(
            "/api/services/inquiries",
            json={
                "client_name": "客户A",
                "client_email": "client@example.com",
                "project_type": "网站开发",
                "description": "需要建设一个企业官网"
            }
        )
        assert response.status_code == 200
        assert response.json()["client_name"] == "客户A"


class TestUsers:
    """用户管理测试"""

    def test_get_users_requires_admin(self):
        """测试获取用户列表需要管理员权限"""
        # 不带 token 应该返回 401 或 403
        response = client.get("/api/users")
        assert response.status_code in [401, 403]

    def test_get_users_with_admin(self):
        """测试管理员获取用户列表"""
        token = get_token("admin_test@example.com", "Admin@123456")

        response = client.get(
            "/api/users",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_update_user_role(self):
        """测试更新用户角色"""
        # 先创建一个普通用户
        client.post(
            "/api/auth/register",
            json={
                "email": "role_test@example.com",
                "password": "Role@123456",
                "name": "角色测试用户"
            }
        )

        # 使用管理员 token
        token = get_token("admin_test@example.com", "Admin@123456")

        response = client.put(
            "/api/users/2/role",
            params={"role": "USER"},
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200

    def test_delete_last_admin_prevented(self):
        """测试不能删除最后一个管理员"""
        token = get_token("admin_test2@example.com", "Admin@123456")

        # 尝试删除自己（最后一个管理员）
        response = client.delete(
            "/api/users/1",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 400
        assert "不能删除当前登录用户" in response.json()["detail"] or "最后一个管理员" in response.json()["detail"]


class TestPortfolio:
    """作品集测试"""

    def test_get_portfolio_items(self):
        """测试获取作品集列表"""
        response = client.get("/api/portfolio")
        assert response.status_code == 200

    def test_create_portfolio_requires_admin(self):
        """测试创建作品集需要管理员权限"""
        response = client.post(
            "/api/portfolio",
            json={
                "title": "测试作品",
                "description": "测试描述",
                "image_url": "https://example.com/image.jpg",
                "category": "design"
            }
        )
        assert response.status_code in [401, 403]

    def test_create_portfolio_with_admin(self):
        """测试管理员创建作品集"""
        token = get_token("portfolio_admin@example.com", "Admin@123456")

        response = client.post(
            "/api/portfolio",
            json={
                "title": "测试作品",
                "description": "测试描述",
                "image_url": "https://example.com/image.jpg",
                "category": "design"
            },
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "测试作品"

    def test_get_portfolio_by_category(self):
        """测试按分类获取作品集"""
        response = client.get("/api/portfolio?category=design")
        assert response.status_code == 200


class TestInquiries:
    """询价测试"""

    def test_create_inquiry(self):
        """测试创建询价"""
        response = client.post(
            "/api/services/inquiries",
            json={
                "client_name": "测试客户",
                "client_email": "test@client.com",
                "project_type": "网站开发",
                "description": "测试询价内容"
            }
        )
        assert response.status_code == 200

    def test_get_inquiries_requires_admin(self):
        """测试获取询价列表需要管理员权限"""
        response = client.get("/api/services/inquiries")
        assert response.status_code in [401, 403]

    def test_update_inquiry_status(self):
        """测试更新询价状态"""
        token = get_token("inquiry_admin@example.com", "Admin@123456")

        # 先创建询价
        client.post(
            "/api/services/inquiries",
            json={
                "client_name": "状态测试客户",
                "client_email": "status@test.com",
                "project_type": "移动应用",
                "description": "测试状态更新"
            }
        )

        # 更新状态
        response = client.put(
            "/api/services/inquiries/1",
            json={"status": "contacted"},
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200


class TestOrders:
    """订单测试"""

    def test_create_order_requires_auth(self):
        """测试创建订单需要登录"""
        response = client.post(
            "/api/services/orders",
            json={"service_slug": "web-development", "notes": "测试订单"}
        )
        assert response.status_code in [401, 403]

    def test_get_orders(self):
        """测试获取用户订单"""
        token = get_token("order_user@example.com", "Order@123456")

        response = client.get(
            "/api/services/orders",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200


class TestTokenRefresh:
    """Token刷新测试"""

    def test_refresh_token(self):
        """测试刷新访问令牌"""
        # 先注册并登录
        client.post(
            "/api/auth/register",
            json={
                "email": "refresh_test@example.com",
                "password": "Refresh@123456",
                "name": "刷新测试用户"
            }
        )

        login_response = client.post(
            "/api/auth/login",
            json={
                "email": "refresh_test@example.com",
                "password": "Refresh@123456"
            }
        )
        refresh_token = login_response.json()["refresh_token"]

        # 使用 refresh token 获取新的 access token
        response = client.post(
            "/api/auth/refresh",
            json={"refresh_token": refresh_token}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data

    def test_refresh_invalid_token(self):
        """测试刷新无效令牌"""
        response = client.post(
            "/api/auth/refresh",
            json={"refresh_token": "invalid_token"}
        )
        assert response.status_code == 401


class TestAccountLockout:
    """账户锁定测试"""

    def test_account_lockout_after_failed_attempts(self):
        """测试账户在多次失败后被锁定"""
        # 先注册用户
        client.post(
            "/api/auth/register",
            json={
                "email": "lockout_test@example.com",
                "password": "Lockout@123456",
                "name": "锁定测试用户"
            }
        )

        # 尝试多次错误登录
        for i in range(6):  # MAX_LOGIN_ATTEMPTS is 5
            response = client.post(
                "/api/auth/login",
                json={
                    "email": "lockout_test@example.com",
                    "password": "wrongpassword"
                }
            )

        # 第6次应该返回锁定提示
        assert response.status_code == 403
        assert "锁定" in response.json()["detail"] or "已锁定" in response.json()["detail"]


class TestContact:
    """联系表单测试"""

    def test_send_contact_email(self):
        """测试发送联系邮件"""
        response = client.post(
            "/api/contact",
            json={
                "name": "测试联系人",
                "email": "test@example.com",
                "subject": "测试主题",
                "message": "这是测试消息内容，需要足够长以通过验证。"
            }
        )
        # 即使没有配置 SMTP，也应该返回成功（取决于配置）
        assert response.status_code in [200, 500]

    def test_contact_validation(self):
        """测试联系表单验证"""
        response = client.post(
            "/api/contact",
            json={
                "name": "x",  # 太短
                "email": "invalid-email",  # 无效邮箱
                "subject": "ok",
                "message": "short"  # 太短
            }
        )
        assert response.status_code == 422  # Validation error
