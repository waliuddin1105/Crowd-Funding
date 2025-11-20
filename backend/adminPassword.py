import configparser
from api import bcrypt

config = configparser.ConfigParser()
config.read('config.cfg')

admin_pw = config['global']['ADMIN_PASSWORD']

hashed_password = bcrypt.generate_password_hash(admin_pw).decode('utf-8')

print("Admin password hash:", hashed_password)
