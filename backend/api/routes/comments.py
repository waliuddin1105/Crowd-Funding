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

@comments_ns.route('/get-comments/<int:campaign_id>')
class GetComments(Resource):
    def get(self, campaign_id):
        try:
            
            comments = (
                db.session.query(
                    Users.username,
                    Users.user_id,
                    Users.profile_image,
                    Comments.likes,
                    Comments.comment_id,
                    Comments.content,
                    Comments.created_at
                )
                .join(Users, Users.user_id == Comments.user_id)
                .join(Campaigns, Campaigns.campaign_id == Comments.campaign_id)
                .filter(Comments.campaign_id == campaign_id)
                .order_by(Comments.created_at.desc())
                .all()
            )

            result = [
                {
                    "comment_id": c.comment_id,
                    "username": c.username,
                    "user_id": c.user_id,
                    "profile_image": c.profile_image,
                    "likes": c.likes,
                    "content": c.content,
                    "created_at": c.created_at.isoformat() if c.created_at else None
                }
                for c in comments
            ]

            return {"success": True,
                    "comments": result}, 200
        except Exception as e:
            db.session.rollback()
            return {"success": False, "error": str(e)}, 500



@comments_ns.route('/post-like/<int:user_id>/<int:comment_id>')
class LikeHandle(Resource):
    def post(self,user_id,comment_id):
        try:
            comment = db.session.query(Comments).filter(Comments.comment_id== comment_id).first()

            comment.likes = (comment.likes or 0) + 1
            print(comment.likes)
            db.session.commit()
            
            return {"success": True, "likes": comment.likes}, 200
        except Exception as e:
            db.session.rollback()
            import traceback
            traceback.print_exc() 
            return {"success": False, "error": str(e)}, 500
