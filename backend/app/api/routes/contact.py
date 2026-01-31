import logging
from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel, EmailStr, Field
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.core.config import settings
from app.core.limiter import limiter

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/contact", tags=["联系"])


class ContactForm(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="联系人姓名")
    email: EmailStr = Field(..., description="联系邮箱")
    subject: str = Field(..., min_length=3, max_length=200, description="邮件主题")
    message: str = Field(..., min_length=10, max_length=5000, description="消息内容")


@router.post("")
@limiter.limit("3/minute")  # 限制每分钟3次联系表单提交
def send_contact_email(form: ContactForm, request: Request):
    """发送联系表单邮件"""
    try:
        msg = MIMEMultipart()
        msg["From"] = settings.FROM_EMAIL
        msg["To"] = settings.FROM_EMAIL
        msg["Subject"] = f"来自 {form.name} 的联系 - {form.subject}"

        body = f"""
        姓名: {form.name}
        邮箱: {form.email}
        主题: {form.subject}

        消息内容:
        {form.message}
        """
        msg.attach(MIMEText(body, "plain", "utf-8"))

        if settings.SMTP_HOST:
            server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
            server.quit()

        logger.info(f"Contact email sent from {form.email}")
        return {"message": "邮件发送成功"}
    except Exception as e:
        logger.exception("Failed to send contact email")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="邮件发送失败，请稍后重试")
