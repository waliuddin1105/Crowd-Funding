import os
import configparser
from api import bcrypt

# Try environment variable first (for Docker), fallback to config.cfg (for local dev)
admin_pw = os.getenv('ADMIN_PASSWORD')

if not admin_pw:
    config = configparser.ConfigParser()
    config.read('config.cfg')
    admin_pw = config['global']['ADMIN_PASSWORD']

hashed_password = bcrypt.generate_password_hash(admin_pw).decode('utf-8')

print("Admin password hash:", hashed_password)
