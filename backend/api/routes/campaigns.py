from flask_restx import Resource
from api.models.cf_models import (
    Users,
    CampaignCategory,
    Campaigns,  
    CampaignStatus,
    CampaignUpdates,
)
from flask import jsonify,request
from api import db, campaigns_ns
from api.models.cf_models import Campaigns, Users
from sqlalchemy.orm import joinedload
from sqlalchemy import func,text
from datetime import datetime
from ..helpers import campaign_helper


@campaigns_ns.route('/') # AllCampaigns.jsx
class AllCampaigns(Resource):
#testing completed        
    def get(self):
        """Get all campaigns with their creator's name"""
        try:
            campaigns = (
                db.session.query(
                    Campaigns.campaign_id,
                    Campaigns.title,
                    Campaigns.description,
                    Campaigns.category,
                    Campaigns.goal_amount,
                    Campaigns.raised_amount,
                    Campaigns.status,
                    Campaigns.created_at,
                    Campaigns.updated_at,
                    Campaigns.image,
                    Users.username.label("creator_name")
                )
                .join(Users, Campaigns.creator_id == Users.user_id)
                .filter(Campaigns.status != 'pending')
                .all()
            )
            
            campaigns_list = [{
                "campaign_id": c.campaign_id,
                "title": c.title,
                "description": c.description,
                "category": c.category.value if hasattr(c.category, "value") else c.category,
                "goal_amount": float(c.goal_amount) if c.goal_amount else 0.0,
                "raised_amount": float(c.raised_amount) if c.raised_amount else 0.0,
                "status": c.status.value if hasattr(c.status, "value") else c.status,
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
    #testing completed 
    def post(self):
        """Create a new campaign"""
        data = request.get_json()
        print(data)

        default_img_url = 'https://res.cloudinary.com/sajjadahmed/image/upload/v1761242807/klxazxpkipxvyxuurpaq.png'

        try:
            goal_amount = float(data['goal_amount'])
            image = data.get('image') or default_img_url
            category_value = data['category'].strip().lower()
            status_value = data.get('status', 'pending').strip().lower()

            try:
                category_enum = CampaignCategory(category_value)
            except ValueError:
                return {"success": False, "error": f"Invalid category '{category_value}'"}, 400

            try:
                status_enum = CampaignStatus(status_value)
            except ValueError:
                return {"success": False, "error": f"Invalid status '{status_value}'"}, 400

            start_date = datetime.fromisoformat(data['start_date'].replace("Z", "+00:00"))
            end_date = datetime.fromisoformat(data['end_date'].replace("Z", "+00:00"))

            print('Creating campaign...')
            campaign = Campaigns(
                creator_id=data['creator_id'],
                title=data['title'],
                description=data['description'],
                image=image,
                category=category_enum,
                goal_amount=goal_amount,
                raised_amount=0,
                start_date=start_date,
                end_date=end_date,
                status=status_enum
            )

            print('Campaign to add:', campaign)

            # ✅ Save to DB
            db.session.add(campaign)
            db.session.commit()

            print('Campaign added successfully!')

            return {
                "success": True,
                "message": "Campaign created successfully",
                "campaign": campaign.to_dict()
            }, 201

        except Exception as e:
            db.session.rollback()
            print('Error creating campaign:', str(e))
            return {"success": False, "error": str(e)}, 500





@campaigns_ns.route('/fully-funded') #for Home.jsx
class FullyFundedCampaigns(Resource):
    def get(self):
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
class DeleteCampaign(Resource):
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


#http://{BACKEND_URL}/campaigns?creator_id={user_id}
@campaigns_ns.route('') #CreatorDashboard.jsx --display campaigns of creator
class CreatorCampaignList(Resource):
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

#GET http://{BACKEND_URL}/campaigns/{campaign_id}
@campaigns_ns.route('/<int:campaign_id>') #CampaignDetails.jsx
class GetCampaignByID(Resource):
    def get(self,campaign_id):
        """get campaign by id"""
        try:
            campaign = campaign_helper.view_campaign_by_campaign_id(campaign_id)
            return {
                "success": True,
                "campaign": campaign
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }, 500
        except ValueError as ve:
            return {"success": False, "error": str(ve)}, 404
        
        
#Purpose: Retrieve all comments related to a campaign
# API: GET http://{BACKEND_URL}/campaigns/{campaign_id}/comments
@campaigns_ns.route('/<int:campaign_id>/comments')
class GetCampaignComments(Resource): #CampaignDetails.jsx
    def get(self,campaign_id):
        """Get all comments of a campaign"""
        try:
            query = text("""
                SELECT 
                    u.username, 
                    u.profile_image, 
                    cm.comment_id, 
                    cm.content, 
                    cm.created_at, 
                    cm.likes
                FROM comments cm
                JOIN users u ON u.user_id = cm.user_id
                JOIN campaigns c ON c.campaign_id = cm.campaign_id
                WHERE c.campaign_id = :campaign_id
                ORDER BY cm.created_at DESC
            """)
            result = db.session.execute(query, {"campaign_id": campaign_id}).fetchall()
            comments = [dict(row._mapping) for row in result]
            return {"success": True, "comments": comments}, 200
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }, 500
        except ValueError as ve:
            return {"success": False, "error": str(ve)}, 404

# Purpose: Toggle a like on a specific comment
# API: POST http://{BACKEND_URL}/campaigns/comments/{comment_id}/like

@campaigns_ns.route('/comments/<int:comment_id>/like')
class CommentLike(Resource):
    def post(self,comment_id):
        """post a like on a comment"""
        try:
            print('f')
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }, 500
        except ValueError as ve:
            return {"success": False, "error": str(ve)}, 404