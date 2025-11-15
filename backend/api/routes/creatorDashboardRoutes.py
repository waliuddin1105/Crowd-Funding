from api import db, creator_ns
from flask import request
from flask_restx import Resource
from api.helpers.security_helper import jwt_required
from api.models.cf_models import Users, Campaigns, Donations, CampaignStatus
from sqlalchemy import func

@creator_ns.route('/dashboard')
class displayCreatorDashboard(Resource):
    @jwt_required
    @creator_ns.doc('Creator Dashboard')
    def get(self):
        from flask import g

        creator = Users.query.get(g.user_id)

        if not creator:
            return {"Error" : "No such user exists"}, 400
        
        role = creator.role.value.lower()

        if role != 'creator':
            return {"Error" : "Nothing to show"}, 403
        
        campaigns = Campaigns.query.filter(
            Campaigns.creator_id == creator.creator_id, Campaigns.status == CampaignStatus.active
            ).all()

        total_raised = 0
        active_campaigns = len(campaigns)

        for campaign in campaigns:
            total_raised = db.session.query(db.func.sum(Donations.amount))\
                           .filter(Donations.campaign_id == campaign.campaign_id).scalar()
            
        donors = db.session.query(
                Campaigns, Donations            
        ).join(Donations,Campaigns.campaign_id == Donations.campaign_id)\
        .filter(Campaigns.creator_id == creator.creator_id,
                Campaigns.status == CampaignStatus.active).all()
        
        total_donors = len(donors)

)