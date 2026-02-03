import os
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_restx import Api, Namespace
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_cors import CORS

# Load .env for local development (no-op in Docker/Railway)
load_dotenv()

# Print environment variable status for Railway debugging
print("=" * 50)
print("ENVIRONMENT VARIABLE STATUS:")
print(f"  DATABASE_URL: {'SET' if os.getenv('DATABASE_URL') else 'MISSING'}")
print(f"  SECRET_KEY: {'SET' if os.getenv('SECRET_KEY') else 'MISSING'}")
print(f"  JWT_SECRET_KEY: {'SET' if os.getenv('JWT_SECRET_KEY') else 'MISSING'}")
print("=" * 50)

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
    security='bearer authorizations' 
)

# Get DATABASE_URL from environment (Railway standard)
db_uri = os.getenv('DATABASE_URL')
secret_key = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

# Fix for SQLAlchemy compatibility: postgres:// -> postgresql+psycopg2://
if db_uri:
    if db_uri.startswith('postgres://'):
        db_uri = db_uri.replace('postgres://', 'postgresql+psycopg2://', 1)
    elif db_uri.startswith('postgresql://') and 'psycopg2' not in db_uri:
        db_uri = db_uri.replace('postgresql://', 'postgresql+psycopg2://', 1)

if not db_uri:
    print("WARNING: DATABASE_URL not set. Using fallback for local development.")
    db_uri = 'postgresql://postgres:111@localhost:5432/crowdfunding_platform'

app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = secret_key

# Connection pooling for production
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_size': 5,
    'pool_recycle': 300,
    'pool_pre_ping': True
}

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
migrate = Migrate(app, db)

# Health endpoint that checks database connection
@app.route('/health')
def health_check():
    try:
        # Test database connection
        db.session.execute(db.text('SELECT 1'))
        return jsonify({
            'status': 'healthy',
            'database': 'connected'
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'database': 'disconnected',
            'error': str(e)
        }), 500

users_ns = Namespace('Users', description='Data about the users')
campaigns_ns = Namespace('Campaigns', description="Data about the campaigns")
donations_ns = Namespace('Donations', description='Data about the donations')
comments_ns = Namespace('Comments', description="Data about the comments")
payments_ns = Namespace('Payments', description='Data about the payments')
updates_ns = Namespace('Updates', description="Data about the updates")
follows_ns = Namespace('Follows', description = 'Data about user follows')
campaign_updates_ns = Namespace('Campaign Updates', description="Data about the campaign updates")
admin_reviews_ns = Namespace('Admin Reviews', description = 'Data about admin reviews')
creator_ns = Namespace('Creator', description= "Creator dashboard")

api.add_namespace(users_ns, '/users')
api.add_namespace(campaigns_ns, '/campaigns')
api.add_namespace(donations_ns, '/donations')
api.add_namespace(comments_ns, '/comments')
api.add_namespace(payments_ns, '/payments')
api.add_namespace(updates_ns, '/updates')
api.add_namespace(follows_ns, '/follows')
api.add_namespace(campaign_updates_ns, '/campaign-updates')
api.add_namespace(admin_reviews_ns,'/admin-reviews')
api.add_namespace(creator_ns,'/creator')

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
import api.routes.payments
import api.routes.follows
import api.routes.admin_reviews  