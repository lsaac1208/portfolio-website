# 速率限制器配置

from slowapi import Limiter
from slowapi.util import get_remote_address

# 创建速率限制器
limiter = Limiter(key_func=get_remote_address, default_limits=["200/day", "50/hour"])
