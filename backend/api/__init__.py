from flask import Flask
from flask_restx import Api, Namespace
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from configparser import ConfigParser

app = Flask(__name__)
api = Api (
    app,
    version = '1.0',
    title = "Crowdfunding platform",
    description = "Api for crowdfunding platform"
)

from flask_cors import CORS
from configparser import ConfigParser

app = Flask(__name__)

# Configure CORS
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Load configuration
config_parser = ConfigParser(interpolation=None)
config_parser.read('config.cfg')
app.config['SQLALCHEMY_DATABASE_URI'] = config_parser.get('global', 'SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = config_parser.get('global', 'SECRET_KEY')

# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
migrate = Migrate(app, db)

users_ns = Namespace('Users', description='Data about the users')
campaigns_ns = Namespace('Campaigns', description="Data about the campaigns")
donations_ns = Namespace('Donations', description='Data about the donations')
payments_ns = Namespace('Payments', description='Data about the payments')
updates_ns = Namespace('Updates', description="Data about the updates")

api.add_namespace(users_ns, '/users')
api.add_namespace(campaigns_ns, '/campaigns')
api.add_namespace(donations_ns, '/donations')
api.add_namespace(payments_ns, '/payments')
api.add_namespace(updates_ns, '/updates')


import api.models.cf_models
# Initialize API
api = Api(
    app,
    version='1.0',
    title="Crowdfunding platform",
    description="Api for crowdfunding platform"
)

# Create namespaces
users_ns = Namespace('Users', description='Data about the users')
campaigns_ns = Namespace('Campaigns', description="Data about the campaigns")
comments_ns = Namespace('Comments', description="Data about the comments")
payments_ns = Namespace('Payments', description='Data about the payments')
donations_ns = Namespace('Donations', description='Data about the donations')
follows_ns = Namespace('Follows', description='Data about user follows')
campaignUpdates_ns = Namespace('Campaign Updates', description="Data about the campaign updates")
adminReviews_ns = Namespace('Admin Reviews', description='Data about admin reviews')

# Add namespaces to API
api.add_namespace(users_ns, '/users')
api.add_namespace(campaigns_ns, '/campaigns')
api.add_namespace(comments_ns, '/comments')
api.add_namespace(payments_ns, '/payments')
api.add_namespace(donations_ns, '/donations')
api.add_namespace(follows_ns, '/follows')
api.add_namespace(campaignUpdates_ns, '/campaign-updates')
api.add_namespace(adminReviews_ns, '/admin-reviews')

# Import models (must be before routes)
import api.models.cf_models

# Import routes (must be last)
from api.routes import campaigns
# Uncomment as you add more routes:
# from api.routes import users
# from api.routes import comments
# from api.routes import payments
# from api.routes import donations
# from api.routes import follows
# from api.routes import campaign_updates
# from api.routes import admin_reviews

# Test DB Connection
try:
    with app.app_context():
        db.session.execute(db.text("SELECT 1"))
    print("✅ Database connection successful!")
except Exception as e:
    print("❌ Database connection failed:")
    print(e)
