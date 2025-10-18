from datetime import datetime
from api import db
from api.models.cf_models import ChatHistory


def add_message(user_id, role, message):
    """
    Stores a chat message (user or assistant) in the database.
    """
    try:
        msg = ChatHistory(
            user_id=user_id, role=role, message=message, timestamp=datetime.utcnow()
        )
        db.session.add(msg)
        db.session.commit()
        return msg
    except Exception as e:
        db.session.rollback()
        raise RuntimeError(f"Could not add message for user {user_id}. Error: {e}")


def build_chat_history(user_id, limit=5):
    """
    Builds the last few chat messages for the user into a formatted string.
    Useful for feeding into your chatbot model.
    """
    messages = (
        ChatHistory.query.filter_by(user_id=user_id)
        .order_by(ChatHistory.timestamp.desc())
        .limit(limit)
        .all()
    )

    messages.reverse()
    history = "\n".join([f"{m.role}: {m.message}" for m in messages])
    return history


def get_chat_history(user_id, limit=None):
    """
    Retrieves chat messages as a list of dictionaries.
    """
    query = ChatHistory.query.filter_by(user_id=user_id).order_by(
        ChatHistory.timestamp.asc()
    )

    if limit:
        query = query.limit(limit)

    messages = query.all()
    return [
        {
            "role": msg.role,
            "message": msg.message,
            "timestamp": msg.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
        }
        for msg in messages
    ]


def delete_chat_history(user_id):
    """
    Deletes all chat messages belonging to the given user.
    """
    try:
        ChatHistory.query.filter_by(user_id=user_id).delete(synchronize_session=False)
        db.session.commit()
        return f"Chat history for user {user_id} deleted successfully."
    except Exception as e:
        db.session.rollback()
        raise RuntimeError(
            f"Could not delete chat history of user {user_id}. Error: {e}"
        )
