# Try to import Resource from flask_restx (preferred) or fallback to flask_restful if not available.
try:
    from flask_restx import Resource
except Exception:
    try:
        from flask_restful import Resource  # fallback for environments without flask-restx
    except Exception:
        raise ImportError(
            "Neither 'flask_restx' nor 'flask_restful' is available; "
            "install one of them (pip install flask-restx) to use API resources."
        )
from api.models.cf_models import (
    Users,
    CampaignCategory,
    Campaigns,  
    Comments,
    CampaignStatus,
    Payments,
    CampaignUpdates
)
from flask import jsonify, request
from api import db, campaigns_ns
from api.models.cf_models import Campaigns, Users
from sqlalchemy.orm import joinedload
from sqlalchemy import func, text
from datetime import datetime
from ..helpers import campaign_helper


@campaigns_ns.route('/') # AllCampaigns.jsx
class AllCampaigns(Resource):
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


@campaigns_ns.route('/create')
class CreateCampaign(Resource):
    def options(self):
        """Handle CORS preflight for create campaign"""
        return {'status': 'ok'}, 200
    
    def post(self):
        """Create a new campaign"""
        try:
            data = request.get_json()
            print("Received data:", data)

            default_img_url = 'https://res.cloudinary.com/sajjadahmed/image/upload/v1761242807/klxazxpkipxvyxuurpaq.png'

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

            # Handle date parsing
            start_date_str = data['start_date']
            end_date_str = data['end_date']
            
            # Remove 'Z' and parse
            if isinstance(start_date_str, str):
                start_date = datetime.fromisoformat(start_date_str.replace("Z", "+00:00"))
            else:
                start_date = start_date_str
                
            if isinstance(end_date_str, str):
                end_date = datetime.fromisoformat(end_date_str.replace("Z", "+00:00"))
            else:
                end_date = end_date_str

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

            db.session.add(campaign)
            db.session.commit()
            return {
                "success": True,
                "message": "Campaign created successfully",
                "campaign": campaign.to_dict()
            }, 201

        except Exception as e:
            db.session.rollback()
            print('Error creating campaign:', str(e))
            import traceback
            traceback.print_exc()
            return {"success": False, "error": str(e)}, 500


@campaigns_ns.route('/fully-funded')
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


@campaigns_ns.route('/<int:campaign_id>')
class CampaignOperations(Resource):
    def get(self, campaign_id):
        """get campaign by id"""
        try:
            campaign = campaign_helper.view_campaign_by_campaign_id(campaign_id)
            return {
                "success": True,
                "campaign": campaign
            }, 200
        except ValueError as ve:
            return {"success": False, "error": str(ve)}, 404
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }, 500
    
    def delete(self, campaign_id):
        """Delete a campaign"""
        try:
            result = campaign_helper.delete_campaign(campaign_id)
            return {
                "success": True,
                "message": result["message"]
            }, 200
        except ValueError as ve:
            return {"success": False, "error": str(ve)}, 404
        except Exception as e:
            return {"success": False, "error": str(e)}, 500


@campaigns_ns.route('')
class CreatorCampaignList(Resource):
    def get(self):
        """Get campaigns by creator"""
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


@campaigns_ns.route('/<int:campaign_id>/comments')
class GetCampaignComments(Resource):
    def get(self, campaign_id):
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
        except ValueError as ve:
            return {"success": False, "error": str(ve)}, 404
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }, 500

#API: POST http://{BACKEND_URL}/campaigns/comments/{comment_id}/like
@campaigns_ns.route('/comments/<int:comment_id>/like')
class CommentLike(Resource):
    def post(self, comment_id):
        """Post a like on a comment"""
        try:
            comment = Comments.query.filter_by(comment_id=comment_id).first()

            if not comment:
                raise ValueError(f"No comment found with id {comment_id}")

            comment.likes = (comment.likes or 0) + 1

            db.session.commit()

            return {
                "success": True,
                "comment_id": comment_id,
                "likes": comment.likes
            }, 200

        except ValueError as ve:
            db.session.rollback()
            return {"success": False, "error": str(ve)}, 404

        except Exception as e:
            db.session.rollback()
            return {"success": False, "error": str(e)}, 500

# API: POST http://{BACKEND_URL}/campaigns/fully-funded
@campaigns_ns.route('/fully-funded')
class FullyFundedCampaigns(Resource): #Home.jsx
    def get(self):
        """Get fully funded campaigns"""
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
                .filter(Campaigns.status == 'completed')
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
        
@campaigns_ns.route('/stats') #for HOme page
class CampaignStats(Resource):
    def get(self):
        try:
            # total raised
            total_raised = db.session.query(func.sum(Payments.amount))\
                .filter(Payments.payment_status == 'successful').scalar() or 0
            total_raised = float(total_raised)

            # total donors
            total_donors = db.session.query(func.count(Users.user_id))\
                .filter(Users.role == 'donor').scalar() or 0

            # success rate
            total_campaigns = db.session.query(func.count(Campaigns.campaign_id)).scalar() or 1
            completed_campaigns = db.session.query(func.count(Campaigns.campaign_id))\
                .filter(Campaigns.status == "completed").scalar() or 0

            success_rate = (completed_campaigns / total_campaigns) * 100

            # active campaigns
            active_campaigns = db.session.query(func.count(Campaigns.campaign_id))\
                .filter(Campaigns.status == 'active').scalar() or 0

            return {
                "success": True,
                "stats": {
                    "total_raised": round(total_raised, 2),
                    "total_donors": total_donors,
                    "success_rate": round(success_rate, 2),
                    "active_campaigns": active_campaigns
                }
            }, 200

        except Exception as e:
            db.session.rollback()
            return {"success": False, "error": str(e)}, 500

@campaigns_ns.route('/get-updates/<int:campaign_id>')
class GetUpdates(Resource):
    def get(self, campaign_id):
        try:
            query = (
                db.session.query(CampaignUpdates)
                .filter(CampaignUpdates.campaign_id == campaign_id)
                .all()
            )

            # Convert all updates to dictionary form
            updates = [u.to_dict() for u in query]

            return {"success": True, "updates": updates}, 200

        except ValueError as ve:
            return {"success": False, "error": str(ve)}, 404
        except Exception as e:
            return {"success": False, "error": str(e)}, 500
