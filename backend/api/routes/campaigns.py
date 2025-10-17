# api/routes/campaigns.py
from flask_restx import Resource
from flask import jsonify
from api import db, campaigns_ns
from api.models.cf_models import Campaigns, Users

@campaigns_ns.route('/')
class CampaignList(Resource):
    def get(self):
        """Get all campaigns with their creator's name"""
        print('inside a method')
        try:
            # Use SQLAlchemy ORM instead of raw SQL
            query = db.text("""
                SELECT 
                    c.campaign_id,
                    c.title,
                    c.description,
                    c.category,
                    c.goal_amount,
                    c.raised_amount,
                    c.status,
                    c.created_at,
                    c.updated_at,
                    u.username AS creator_name
                FROM campaigns c
                JOIN users u ON c.creator_id = u.user_id
            """)
            
            result = db.session.execute(query)
            campaigns = result.fetchall()

            campaigns_list = [{
                "campaign_id": c.campaign_id,
                "title": c.title,
                "description": c.description,
                "category": c.category,
                "goal_amount": float(c.goal_amount) if c.goal_amount else 0.0,
                "raised_amount": float(c.raised_amount) if c.raised_amount else 0.0,
                "status": c.status,
                "created_at": c.created_at.isoformat() if c.created_at else None,
                "updated_at": c.updated_at.isoformat() if c.updated_at else None,
                "creator_name": c.creator_name
            } for c in campaigns]

            response = {
                "success": True,
                "campaigns": campaigns_list
            }

            return response, 200

        except Exception as e:
            print("Error fetching campaigns:", e)
            return {"success": False, "error": str(e)}, 500