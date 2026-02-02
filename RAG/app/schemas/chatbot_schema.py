from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    user_message: str
    chat_history: Optional[List[dict]] = None