from datetime import datetime
from api.models.cf_models import ChatHistory


def add_message(user_id, role, message):
    from api import db
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


def get_chat_history(user_id, limit=10):
    try:
        messages = (
            ChatHistory.query.filter_by(user_id=user_id)
            .order_by(ChatHistory.timestamp.asc())
            .limit(limit)
            .all()
        )

        return [{"role": msg.role, "message": msg.message} for msg in messages]
    except Exception as e:
        print(f"Error retrieving chat history for user {user_id}: {e}")
        return []


def get_chat_history_with_timestamps(user_id, limit=None):
    try:
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
    except Exception as e:
        print(f"Error retrieving chat history with timestamps for user {user_id}: {e}")
        return []


def delete_chat_history(user_id):
    from api import db
    try:
        ChatHistory.query.filter_by(user_id=user_id).delete(synchronize_session=False)
        db.session.commit()
        return f"Chat history for user {user_id} deleted successfully."
    except Exception as e:
        db.session.rollback()
        raise RuntimeError(
            f"Could not delete chat history of user {user_id}. Error: {e}"
        )


def get_recent_context(user_id, limit=5):
    try:
        messages = (
            ChatHistory.query.filter_by(user_id=user_id)
            .order_by(ChatHistory.timestamp.desc())
            .limit(limit)
            .all()
        )

        messages.reverse()
        return "\n".join([f"{m.role}: {m.message}" for m in messages])
    except Exception as e:
        print(f"Error building context for user {user_id}: {e}")
        return ""
