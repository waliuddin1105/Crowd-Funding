from flask_restx import Resource
from api.models.cf_models import (
    Follows
)
from flask import jsonify, request
from api import db, follows_ns
from api.models.cf_models import Campaigns, Users
from sqlalchemy.orm import joinedload
from sqlalchemy import func, text
from datetime import datetime
from ..helpers import follow_helper

from flask_restx import Resource
from api import follows_ns, db
from api.models.cf_models import Follows
from sqlalchemy.exc import IntegrityError

@follows_ns.route('/toggle-follow/<int:user_id>/<int:campaign_id>')
class ToggleFollowCampaign(Resource):
    @follows_ns.doc("Toggle follow/unfollow a campaign")
    def post(self, user_id, campaign_id):
        """Toggle follow/unfollow for a user and campaign"""
        try:
            existing_follow = Follows.query.filter_by(user_id=user_id, campaign_id=campaign_id).first()

            if existing_follow:
                print('Already follow exists')
                db.session.delete(existing_follow)
                db.session.commit()
                return {
                    "success": True,
                    "action": "unfollowed",
                    "user_id": user_id,
                    "campaign_id": campaign_id
                }, 200
            else:
                print('Creating a follow entry')
                follow = Follows(user_id=user_id, campaign_id=campaign_id)
                db.session.add(follow)
                db.session.commit()
                return {
                    "success": True,
                    "action": "followed",
                    "user_id": user_id,
                    "campaign_id": campaign_id
                }, 201

        except IntegrityError:
            db.session.rollback()
            return {
                "success": False,
                "message": "Database integrity error. Could not toggle follow."
            }, 500
        except Exception as e:
            db.session.rollback()
            return {
                "success": False,
                "message": f"Unexpected error: {str(e)}"
            }, 500
