import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

# Load .env for local development (no-op in Docker)
load_dotenv()

# Email configuration from environment variables
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def send_email(receiver_email, subject, template_name, **kwargs):
    """Send an email using SMTP. Credentials are checked at runtime."""
    SENDER_EMAIL = os.getenv("SENDER_EMAIL")
    SENDER_PASSKEY = os.getenv("SENDER_PASSKEY")
    
    if not SENDER_EMAIL or not SENDER_PASSKEY:
        raise ValueError("SENDER_EMAIL and SENDER_PASSKEY environment variables must be set")
    
    template_path = os.path.join(BASE_DIR, "email_templates", template_name)

    if not os.path.exists(template_path):
        raise FileNotFoundError(f"Email template not found: {template_path}")

    with open(template_path, "r", encoding="utf-8") as f:
        html_template = f.read()

    for key, value in kwargs.items():
        html_template = html_template.replace(f"{{{{{key}}}}}", str(value))

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg["To"] = receiver_email
    msg.attach(MIMEText(html_template, "html"))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSKEY)
        server.sendmail(SENDER_EMAIL, receiver_email, msg.as_string())
        server.quit()
        return {"message": f"Email sent to {receiver_email}"}
    except Exception as e:
        raise RuntimeError(f"Could not send email. Error: {e}")