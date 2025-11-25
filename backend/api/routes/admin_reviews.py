from flask_restx import Resource
from flask import  request
from api import db,admin_reviews_ns
from api.models.cf_models import Campaigns, Users,Comments,AdminReviews,CampaignStatus
from api.helpers.security_helper import jwt_required
from api.fields.adminReviewsFields import admin_reviews_data
decision_to_status = {
    "approved": CampaignStatus.active,
    "rejected": CampaignStatus.rejected,
    "pending": CampaignStatus.pending
}

@admin_reviews_ns.route('/handle-campaign-status')
class CampaignStatusHandler(Resource):

    @admin_reviews_ns.expect(admin_reviews_data)
    def post(self):
        try:
            data = request.get_json()

            admin_id = data.get("admin_id")
            campaign_id = data.get("campaign_id")
            decision = data.get("decision")
            comments = data.get("comments")

            if not admin_id or not campaign_id or not decision:
                return {"status": "error",
                        "message": "admin_id, campaign_id, and decision are required"}, 400

            campaign = Campaigns.query.get(campaign_id)
            if not campaign:
                return {"status": "error", "message": "Campaign not found"}, 404

            status_enum = decision_to_status.get(decision.lower())
            if not status_enum:
                return {"status": "error", "message": "Invalid decision"}, 400

            review = AdminReviews(
                admin_id=admin_id,
                campaign_id=campaign_id,
                decision=decision,
                comments=comments
            )
            db.session.add(review)

            campaign.status = status_enum
            db.session.commit()

            return {
                "status": "success",
                "message": "Campaign status updated and review saved",
                "review": review.to_dict()
            }, 201

        except Exception as e:
            db.session.rollback()
            return {"status": "error", "message": str(e)}, 500