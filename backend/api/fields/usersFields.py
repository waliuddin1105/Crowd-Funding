from api import users_ns
from flask_restx import fields

users_data = users_ns.fields = (
    "Users Data",
    {
        "username" : fields.Integer(required = True, description = "Enter a unique username"),
        "email" : fields.String(required = True, description = "Enter email"),
        "password" : fields.String(required = True, description = "Enter a strong password"),
        "role" : fields.String(required = True, description = "Enter role"),
        "profile_image" : fields.String(required = False, description = "Enter profile image URL"),
        "created_at" : fields.DateTime(required = False, description = "Account creation timestamp"),
        "updated_at" : fields.DateTime(required = False, description = "Last account update timestamp")
    }
)
