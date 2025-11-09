from api import donations_ns, db
from flask_restx import Resource
from api.fields.donationsFields import donations_data
from api.helpers.security_helper import jwt_required
from flask import request
from api.helpers.donation_helper import create_donation,view_all_donations_by_campaign

@donations_ns.route('')
class Donate(Resource):
    # @jwt_required
    @donations_ns.doc("Make a donation to a campaign")
    @donations_ns.expect(donations_data)
    def post(self):
        try:
            data = request.json

            donation = create_donation(data['user_id'], data['campaign_id'], data['amount'])

            return {
                "success": True,
                "donation" : donation
            }, 200

        except Exception as e:
            return {"success":False, "Error": f"Unexpected Error {str(e)}"}, 500
@donations_ns.route('/recent-donors/<int:campaign_id>')
class RecentDonors(Resource):
    def get(self, campaign_id):
        try:
            all_donations =view_all_donations_by_campaign(campaign_id)
            all_donations.sort(key=lambda d: d['created_at'], reverse=True)

            recent_donations = all_donations[:5]

            
            return {"donors": recent_donations}, 200

        except ValueError:
            return {"donors": []}, 200
        except Exception as e:
            db.session.rollback()
            return {"success": False, "error": str(e)}, 500

    