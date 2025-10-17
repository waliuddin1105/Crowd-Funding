from flask_restx import Resource
from flask import jsonify,request
from api import db, campaigns_ns
from api.models.cf_models import Campaigns, Users
from sqlalchemy.orm import joinedload
from sqlalchemy import func
from ..helpers import campaign_helper
@campaigns_ns.route('/') # AllCampaigns.jsx
class CampaignList(Resource):
    def get(self):
        """Get all campaigns with their creator's name"""
        try:
            campaigns = (
                db.session.query(
                    Campaigns.campaign_id,
                    Campaigns.title,
                    Campaigns.description,
                    func.upper(Campaigns.category).label("category"),
                    Campaigns.goal_amount,
                    Campaigns.raised_amount,
                    func.upper(Campaigns.status).label("status"),
                    Campaigns.created_at,
                    Campaigns.updated_at,
                    Campaigns.image,
                    Users.username.label("creator_name")
                )
                .join(Users, Campaigns.creator_id == Users.user_id)
                .all()
            )
            
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
                "creator_name": c.creator_name,
                "image": c.image
            } for c in campaigns]

            response = {
                "success": True,
                "campaigns": campaigns_list
            }

            return response, 200

        except Exception as e:
            print("Error fetching campaigns:", e)
            return {"success": False, "error": str(e)}, 500
        
@campaigns_ns.route('/create') #CreateCampaign.jsx
class CreateCampaign(Resource):
    def post(self):
        """create campaign"""
        data = request.get_json()
        try:
            new_campaign = campaign_helper.create_campaign(
                creator_id=data['creator_id'],
                title=data['title'],
                description=data['description'],
                goal_amount=data['goal_amount'],
                image=data['image'],
                category=data['category'],
                raised_amount=0,
                start_date=data['start_date'],
                end_date=data['end_date'],
                status='PENDING'
            )

            return {
                "success": True,
                "message": "Campaign created successfully",
                "campaign": new_campaign  # already a dict from your helper
            }, 201

        except ValueError as ve:
            return {"success": False, "error": str(ve)}, 400
        except Exception as e:
            return {"success": False, "error": str(e)}, 500

@campaigns_ns.route('/fully-funded') #for Home.jsx
class FullyFundedCampaigns(Resource):
    def get():
        """return fully-funded campaigns"""
        try:
            campaigns = campaign_helper.view_all_completed_campaigns()
            return {
                "success": True,
                "count": len(campaigns),
                "campaigns": campaigns
            }, 200
        except Exception as e:
            return {"success": False, "error": str(e)}, 500
        

@campaigns_ns.route('/<int:campaign_id>') #AdminDashBoard.jsx --delete campaign
class CampaignDetail(Resource):
    def delete(self,campaign_id):
        try:
            result=campaign_helper.delete_campaign(campaign_id)
            return{
                "success": True,
                "message": result["message"]
            },200
            
        except ValueError as ve:
            return {"success": False, "error": str(ve)},404
        except Exception as e:
            return {"success": False, "error": str(e)},500


@campaigns_ns.route('') #CreatorDashboard.jsx --display campaigns of creator
class CampaignList(Resource):
    def get(self):
        creator_id = request.args.get('creator_id')

        try:
            res = campaign_helper.view_all_campaigns_by_creator(creator_id)
            return {
                "success": True,
                "count": len(res),
                "data": res
            }, 200
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }, 500

        