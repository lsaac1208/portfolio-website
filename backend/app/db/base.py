from app.models.models import Base
from app.db.session import engine

# 创建所有表
def create_tables():
    Base.metadata.create_all(bind=engine)
