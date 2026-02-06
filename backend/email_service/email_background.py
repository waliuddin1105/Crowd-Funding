import threading
from email_service.email_sender import send_email

def send_email_background(*args, **kwargs):
    thread = threading.Thread(target=send_email, args=args, kwargs=kwargs)
    thread.daemon = True
    thread.start()
