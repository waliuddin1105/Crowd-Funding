from api import donations_ns, db
from flask_restx import Resource
from api.fields.donationsFields import donations_data
from api.helpers.security_helper import jwt_required
from flask import request
from api.helpers.donation_helper import create_donation

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
                "Success": "Donation Succesful",
                "Donation" : donation
            }, 200

        except Exception as e:
            return {"Error": f"Unexpected Error {str(e)}"}, 500
            
    