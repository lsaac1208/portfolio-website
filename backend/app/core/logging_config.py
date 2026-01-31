import logging
import sys
from pathlib import Path
from logging.handlers import RotatingFileHandler, TimedRotatingFileHandler

# 确保 logs 目录存在
logs_dir = Path(__file__).parent.parent.parent / "logs"
logs_dir.mkdir(exist_ok=True)


def setup_logging():
    """配置应用日志"""
    # 获取根日志器
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)

    # 清除现有处理器
    root_logger.handlers.clear()

    # 配置文件日志处理器 (按大小轮转, 10MB)
    file_handler = RotatingFileHandler(
        logs_dir / "app.log",
        maxBytes=10 * 1024 * 1024,
        backupCount=10,
        encoding="utf-8"
    )
    file_handler.setLevel(logging.INFO)

    # 控制台处理器
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)

    # 错误日志处理器 (按时间轮转, 每天)
    error_file_handler = TimedRotatingFileHandler(
        logs_dir / "error.log",
        when="midnight",
        interval=1,
        backupCount=30,
        encoding="utf-8"
    )
    error_file_handler.setLevel(logging.ERROR)

    # 配置日志格式
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )

    # 应用格式
    file_handler.setFormatter(formatter)
    console_handler.setFormatter(formatter)
    error_file_handler.setFormatter(formatter)

    # 添加处理器到根日志器
    root_logger.addHandler(file_handler)
    root_logger.addHandler(console_handler)
    root_logger.addHandler(error_file_handler)

    # 配置 FastAPI 日志
    fastapi_logger = logging.getLogger("fastapi")
    fastapi_logger.setLevel(logging.INFO)

    # 配置 SQLAlchemy 日志
    sqlalchemy_logger = logging.getLogger("sqlalchemy")
    sqlalchemy_logger.setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    """获取指定名称的日志器"""
    return logging.getLogger(name)
