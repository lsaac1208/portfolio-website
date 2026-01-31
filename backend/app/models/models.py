from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, JSON, Index
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime, timedelta

Base = declarative_base()


def create_indexes():
    """创建复合索引的辅助函数"""
    pass


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    image = Column(String, nullable=True)
    role = Column(String, default="USER")
    failed_login_attempts = Column(Integer, default=0)  # 登录失败次数
    locked_until = Column(DateTime, nullable=True)  # 账户锁定截止时间
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index("idx_users_role", "role"),
    )

    posts = relationship("Post", back_populates="author")
    topics = relationship("Topic", back_populates="author")
    comments = relationship("Comment", back_populates="author")
    projects = relationship("Project", back_populates="author")
    orders = relationship("Order", back_populates="client")


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    slug = Column(String, unique=True, index=True)
    content = Column(Text)
    excerpt = Column(Text, nullable=True)
    cover_image = Column(String, nullable=True)
    published = Column(Boolean, default=False)
    author_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        Index("idx_posts_published", "published"),
        Index("idx_posts_author_id", "author_id"),
        Index("idx_posts_created_at", "created_at"),
    )

    author = relationship("User", back_populates="posts")


class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(Text)
    author_id = Column(Integer, ForeignKey("users.id"))
    views = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        Index("idx_topics_author_id", "author_id"),
        Index("idx_topics_created_at", "created_at"),
        Index("idx_topics_views", "views"),
    )

    author = relationship("User", back_populates="topics")
    comments = relationship("Comment", back_populates="topic")


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)
    author_id = Column(Integer, ForeignKey("users.id"))
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index("idx_comments_author_id", "author_id"),
        Index("idx_comments_topic_id", "topic_id"),
        Index("idx_comments_post_id", "post_id"),
        Index("idx_comments_created_at", "created_at"),
    )

    author = relationship("User", back_populates="comments")
    topic = relationship("Topic", back_populates="comments")
    post = relationship("Post", back_populates="comments")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    slug = Column(String, unique=True, index=True)
    description = Column(Text)
    content = Column(Text, nullable=True)
    cover_image = Column(String, nullable=True)
    tech_stack = Column(JSON)
    github_url = Column(String, nullable=True)
    demo_url = Column(String, nullable=True)
    featured = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)
    author_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        Index("idx_projects_featured", "featured"),
        Index("idx_projects_author_id", "author_id"),
        Index("idx_projects_created_at", "created_at"),
    )

    author = relationship("User", back_populates="projects")


class Portfolio(Base):
    __tablename__ = "portfolio"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    category = Column(String)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    link_url = Column(String, nullable=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index("idx_portfolio_category", "category"),
        Index("idx_portfolio_sort_order", "sort_order"),
    )


class Service(Base):
    """服务项目"""
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    slug = Column(String, unique=True, index=True)
    description = Column(Text)
    content = Column(Text, nullable=True)
    price_type = Column(String)
    price_from = Column(Integer, nullable=True)
    price_to = Column(Integer, nullable=True)
    icon = Column(String, nullable=True)
    features = Column(JSON)
    estimated_days = Column(Integer, nullable=True)
    sort_order = Column(Integer, default=0)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index("idx_services_active", "active"),
        Index("idx_services_sort_order", "sort_order"),
    )


class Inquiry(Base):
    """询价/咨询"""
    __tablename__ = "inquiries"

    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String)
    client_email = Column(String)
    client_phone = Column(String, nullable=True)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=True)
    project_type = Column(String)
    budget = Column(String, nullable=True)
    timeline = Column(String, nullable=True)
    description = Column(Text)
    status = Column(String, default="pending")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        Index("idx_inquiries_status", "status"),
        Index("idx_inquiries_service_id", "service_id"),
        Index("idx_inquiries_created_at", "created_at"),
    )

    service = relationship("Service")


class Order(Base):
    """订单"""
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_no = Column(String, unique=True, index=True)
    client_id = Column(Integer, ForeignKey("users.id"))
    service_id = Column(Integer, ForeignKey("services.id"))
    status = Column(String, default="pending")
    total_amount = Column(Integer)
    deposit = Column(Integer, default=0)
    description = Column(Text)
    requirements = Column(Text, nullable=True)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        Index("idx_orders_status", "status"),
        Index("idx_orders_client_id", "client_id"),
        Index("idx_orders_service_id", "service_id"),
        Index("idx_orders_created_at", "created_at"),
    )

    client = relationship("User", back_populates="orders")
    service = relationship("Service")


# 修复关系
Post.comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")
