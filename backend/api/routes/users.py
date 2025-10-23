from api import users_ns, db, bcrypt
from flask import request
from flask_restx import Resource
from api.fields.usersFields import users_data
from api.models.cf_models import Users
from api.helpers.security_helper import generate_jwt, jwt_required

#/users/login
@users_ns.route('/login')
class LoginUser(Resource):
    @users_ns.doc('Login a user')
    @users_ns.expect(users_data)
    def post(self):
        try:
            data = request.json
            attempted_user = Users.query.filter_by(username = data['username']).first()

            if not data['username'] or not data['password']:
                return {"Error" : "Username or password missing"}, 400
            
            if not attempted_user or not attempted_user.checkHashedPassword(data['password']):
                return {"Error" : "Incorrect username or password"}, 401
            
            access_token = generate_jwt(attempted_user.user_id, attempted_user.role.value)

            return {
                "Success" : "User login succesful!",
                "access token" : access_token,
                "user" : {
                    "user_id" : attempted_user.user_id,
                    "username" : attempted_user.username,
                    "user role" : attempted_user.role.value
                }
            }, 200
         
        except Exception as e:
            return {"Error": f"Unexpected error {str(e)}"}, 500


#/users/logout
@users_ns.route('/logout')
class UserLogout(Resource):
    @jwt_required
    @users_ns.doc('User logout')
    def post(self):
        return {"Sucess" : "User succesfully logged out"}, 200


#/users/register
@users_ns.route('/register')
class RegisterUser(Resource):
    @users_ns.doc('Register a user')
    @users_ns.expect(users_data)
    def post(self):
        data = request.json

        if not data['username']:
            return {"Error" : "Please enter a username"}, 400
        if not data['email']:
            return {"Error" : "Please enter a valid email address"}, 400
        if not data['password']:
            return {"Error" : "Please enter a valid password"}, 400
        role = data.get('role')
        if not role or role.lower() not in ['donor', 'creator', 'admin']:
            return {"Error" : "Please select a valid user role"}, 400
        
        if Users.query.filter_by(username = data['username']).first():
            return {"Error" : "Username already exists! Please choose a unique username"}, 400
        if Users.query.filter_by(email = data ['email']).first():
            return {"Error" : "An existing account is already associated with the provided email"}, 400

        new_user = Users(username = data['username'], email = data['email'], role = data['role'])
        new_user.setPasswordHash(data['password'])
        new_user.profile_image = data.get('profile_image', None)

        db.session.add(new_user)
        db.session.commit()

        return {
            "Success" : "User registered succesfully!",
            "user_id" : new_user.user_id
        }, 200
        
#users/profile
@users_ns.route('/profile/<int:user_id>')
class GetUserProfile(Resource):
    @users_ns.doc("Get user profile")
    @jwt_required
    def get(self, user_id):
        attempted_user = Users.query.filter_by(user_id = user_id).first()

        if not attempted_user:
            return {"Error" : "User does not exist!"}, 404
        
        return {
            "success" : True,
            "user" : {
                "user_id" : attempted_user.user_id,
                "username" : attempted_user.username,
                "email" : attempted_user.email,
                "role" : attempted_user.role.value,
                "profile_image" : attempted_user.profile_image
            }
        }, 200

