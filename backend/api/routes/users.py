from api import users_ns
from flask import request
from flask_restx import Resource
from fields.usersFields import users_data
from models.cf_models import Users

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
            
            return {
                "Success" : "User login succesful!"
            }, 200
         
        except Exception as e:
            return {"Error", f"Unexpected error {str(e)}"}, 500





