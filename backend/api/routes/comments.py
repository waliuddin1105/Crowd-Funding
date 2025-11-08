from flask_restx import Resource
from flask import jsonify, request
from api import db, comments_ns
from api.models.cf_models import Campaigns, Users,Comments
from sqlalchemy.orm import joinedload
from sqlalchemy import func, text
from datetime import datetime
from api.helpers.security_helper import jwt_required

@comments_ns.route('/post-comment/<int:user_id>/<int:campaign_id>')
class CommentDetails(Resource):
    @jwt_required
    def post(self, user_id, campaign_id):
        try:
            data = request.get_json()
            message = data.get("message")

            if not message or not message.strip():
                return {"success": False, "error": "Comment message is required."}, 400

            new_comment = Comments(
                user_id=user_id,
                campaign_id=campaign_id,
                content=message.strip(),
                created_at=datetime.utcnow()
            )

            db.session.add(new_comment)
            db.session.commit()

            return {
                "success": True,
                "comment": new_comment.to_dict()
            }, 201

        except Exception as e:
            db.session.rollback()
            return {"success": False, "error": str(e)}, 500
