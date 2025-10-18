from api import campaigns_ns
from flask_restx import fields

campaigns_data = campaigns_ns.fields = (
    "Campaigns Data",
    {
        "title" : fields.String(required = True, description = "Enter campaign title"),
        "description" : fields.String(required = True, description = "Enter campaign description"),
        "goal_amount" : fields.Float(required = True, description = "Enter goal amount"),
        "start_date" : fields.DateTime(required = True, description = "Enter campaign start date"),
        "end_date" : fields.DateTime(required = True, description = "Enter campaign end date"),
        "created_at" : fields.DateTime(required = False, description = "Campaign creation timestamp"),
        "updated_at" : fields.DateTime(required = False, description = "Last campaign update timestamp")
    }
)