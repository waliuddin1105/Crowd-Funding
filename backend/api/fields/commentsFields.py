from api import comments_ns
from flask_restx import fields

comments_data = comments_ns.fields = (
    "Comments Data",
    {
        "user_id" : fields.Integer(required = True, description = "Enter a valid user ID"),
        "campaign_id" : fields.Integer(required = True, description = "Enter a valid campaign ID"),
        "comment_text" : fields.String(required = True, description = "Enter comment text"),
        "created_at" : fields.DateTime(required = False, description = "Comment creation timestamp"),
        "updated_at" : fields.DateTime(required = False, description = "Last comment update timestamp")
    }
)