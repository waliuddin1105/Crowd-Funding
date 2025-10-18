from flask import Flask
from flask_restx import Api, Namespace
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from configparser import ConfigParser
from flask_cors import CORS

app = Flask(__name__)
api = Api(
    app,
    version='1.0',
    title="Crowdfunding platform",
    description="Api for crowdfunding platform"
)
# Create alias for external use (avoid naming conflict with package name)
api_instance = api

CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

config_parser = ConfigParser(interpolation=None)
config_parser.read('config.cfg')

app.config['SQLALCHEMY_DATABASE_URI'] = config_parser.get('global', 'SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = config_parser.get('global', 'SECRET_KEY')

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
migrate = Migrate(app, db)

# Define namespaces (except chat_ns which is in api.routes.rag)
users_ns = Namespace('Users', description='Data about the users')
campaigns_ns = Namespace('Campaigns', description="Data about the campaigns")
donations_ns = Namespace('Donations', description='Data about the donations')
payments_ns = Namespace('Payments', description='Data about the payments')
updates_ns = Namespace('Updates', description="Data about the updates")

# Register existing namespaces
api.add_namespace(users_ns, '/users')
api.add_namespace(campaigns_ns, '/campaigns')
api.add_namespace(donations_ns, '/donations')
api.add_namespace(payments_ns, '/payments')
api.add_namespace(updates_ns, '/updates')

# Import models first (chat_ns needs db to be initialized)
import api.models.cf_models

# Force SQLAlchemy to configure all mappers
try:
    from sqlalchemy.orm import configure_mappers
    configure_mappers()
except Exception as e:
    print(f"Warning: Mapper configuration issue: {e}")
    print("Continuing anyway - this might cause issues with some models")