from api import users_ns
from flask import request
from flask_restx import Resource
from api.fields.usersFields import users_data
from api.models.cf_models import Users
from api.helpers.security_helper import generate_jwt

#/users/login
@users_ns.route('/login')
class loginUser(Resource):
    @users_ns.doc('Login a user')
    @users_ns.expect(users_data)
    def post(self):
        try:
            data = request.json
            attempted_user = Users.query.filter_by(username = data['username']).first()

            if not data['username'] or not data['password']:
                return {"Error" : "Username or password required"}, 400
            
            if not attempted_user or not attempted_user.checkHashedPassword(data['password']):
                return {"Error" : "Incorrect username or password"}, 401
            
            access_token = generate_jwt(attempted_user.user_id, attempted_user.role)

            return {
                "Success" : "User login succesful!",
                "access token" : access_token,
                "user" : {
                    "user_id" : attempted_user.user_id,
                    "username" : attempted_user.username,
                    "user role" : attempted_user.role
                }
            }, 200
         
        except Exception as e:
            return {"Error", f"Unexpected error {str(e)}"}, 500


#/users/logout



