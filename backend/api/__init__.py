from flask import Flask
from flask_restx import Api, Namespace
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from configparser import ConfigParser
from flask_cors import CORS

authorizations = {
    'bearer authorizations':
    {
        'type' : 'apiKey',
        'in' : 'header',
        'name' : 'Authorization',
        'description' : '*Bearer* <type your bearer token here>'
    }
}

app = Flask(__name__)

# Configure CORS BEFORE creating the API
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Type", "Authorization"],
        "supports_credentials": False
    }
})

api = Api(
    app,
    version='1.0',
    title="Crowdfunding platform",
    description="Api for crowdfunding platform",
    authorizations=authorizations,
    security='bearer authorizations' #this makes sure that we dont need to authorize for every route every time
)

config_parser = ConfigParser(interpolation=None)
config_parser.read('config.cfg')

app.config['SQLALCHEMY_DATABASE_URI'] = config_parser.get('global', 'SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = config_parser.get('global', 'SECRET_KEY')

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
migrate = Migrate(app, db)

users_ns = Namespace('Users', description='Data about the users')
campaigns_ns = Namespace('Campaigns', description="Data about the campaigns")
donations_ns = Namespace('Donations', description='Data about the donations')
comments_ns = Namespace('Comments', description="Data about the comments")
payments_ns = Namespace('Payments', description='Data about the payments')
updates_ns = Namespace('Updates', description="Data about the updates")
donations_ns = Namespace('Donations', description='Data about the donations')
follows_ns = Namespace('Follows', description = 'Data about user follows')
campaign_updates_ns = Namespace('Campaign Updates', description="Data about the campaign updates")
admin_reviews_ns = Namespace('Admin Reviews', description = 'Data about admin reviews')
creator_ns = Namespace('Creator', description= "Creator dashboard")
# chat_ns = Namespace('Chat', description='Data about RAG chat') # for RAG folder

api.add_namespace(users_ns, '/users')
api.add_namespace(campaigns_ns, '/campaigns')
api.add_namespace(donations_ns, '/donations')
api.add_namespace(comments_ns, '/comments')
api.add_namespace(payments_ns, '/payments')
api.add_namespace(updates_ns, '/updates')
api.add_namespace(donations_ns, '/donations')
api.add_namespace(follows_ns, '/follows')
api.add_namespace(campaign_updates_ns, '/campaign-updates')
api.add_namespace(admin_reviews_ns,'/admin-reviews')
api.add_namespace(creator_ns,'/creator')
# api.add_namespace(chat_ns, '/chat') #penda ne rag mei dali hoyi, ab isko chherio nh saad

# Force SQLAlchemy to configure all mappers
try:
    from sqlalchemy.orm import configure_mappers
    configure_mappers()
except Exception as e:
    print(f"Warning: Mapper configuration issue: {e}")
    print("Continuing anyway - this might cause issues with some models")


import api.models.cf_models
import api.routes.usersRoutes
import api.routes.campaigns  
import api.routes.comments
import api.routes.donationsRoutes
import api.routes.creatorDashboardRoutes
# import api.routes.payments
# import api.routes.updates
import api.routes.follows
# import api.routes.campaign_updates
import api.routes.admin_reviews
# from api.routes.rag import chat_ns  #in RAG folder so created different namespace