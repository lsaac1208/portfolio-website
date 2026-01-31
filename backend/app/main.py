import logging
import time
from datetime import datetime, timezone
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from app.core.config import settings
from app.core.logging_config import setup_logging
from app.core.limiter import limiter
from app.db.base import create_tables
from app.api.routes import auth, blog, forum, projects, portfolio, services, contact, users

# 配置日志
setup_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    logger.info("数据库表创建完成")
    logger.info("API 服务启动成功")
    yield
    logger.info("API 服务关闭")


app = FastAPI(
    title="个人能力展示网站 API",
    description="集博客、论坛、项目展示、作品集展示于一体的综合性个人网站",
    version="1.0.0",
    lifespan=lifespan,
)

# 添加速率限制中间件
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)


# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
)


# 安全响应头中间件
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


# 请求日志中间件
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    client_ip = request.client.host if request.client else "unknown"

    # 记录请求开始
    logger.info(f"请求开始: {request.method} {request.url.path} - IP: {client_ip}")

    try:
        response = await call_next(request)
        process_time = time.time() - start_time

        # 记录请求完成
        status_code = response.status_code
        logger.info(
            f"请求完成: {request.method} {request.url.path} - 状态: {status_code} - "
            f"耗时: {process_time*1000:.2f}ms - IP: {client_ip}"
        )

        # 添加响应时间头
        response.headers["X-Process-Time"] = str(process_time)
        return response
    except Exception as e:
        process_time = time.time() - start_time
        logger.error(
            f"请求失败: {request.method} {request.url.path} - 错误: {str(e)} - "
            f"耗时: {process_time*1000:.2f}ms - IP: {client_ip}"
        )
        raise


# 速率限制异常处理
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    if exc.status_code == 429:
        return JSONResponse(
            status_code=429,
            content={"detail": "请求过于频繁，请稍后再试"}
        )
    raise exc


# 注册路由
app.include_router(auth.router, prefix="/api")
app.include_router(blog.router, prefix="/api")
app.include_router(forum.router, prefix="/api")
app.include_router(projects.router, prefix="/api")
app.include_router(portfolio.router, prefix="/api")
app.include_router(services.router, prefix="/api")
app.include_router(contact.router, prefix="/api")
app.include_router(users.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "欢迎访问个人能力展示网站 API", "docs": "/docs"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/health/detailed")
def health_check_detailed():
    """详细健康检查"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
