"""
Create a test user for chatbot testing
Run this from the backend/testing directory: python create_test_user.py
"""

import sys
import os

# Add backend directory to path (parent of testing directory)
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

# Change working directory to backend so config.cfg can be found
os.chdir(backend_dir)

from api import app, db
from api.models.cf_models import Users, UserRole


def create_test_user():
    """Create or get a test user for chatbot testing"""
    
    with app.app_context():
        # Check if test user already exists
        test_user = Users.query.filter_by(username='chatbot_tester').first()
        
        if test_user:
            print(f"✓ Test user already exists!")
            print(f"  User ID: {test_user.user_id}")
            print(f"  Username: {test_user.username}")
            print(f"  Email: {test_user.email}")
            return test_user.user_id
        
        # Create new test user
        test_user = Users(
            username='chatbot_tester',
            email='chatbot_test@example.com',
            role=UserRole.DONOR,
            profile_image=None
        )
        test_user.setPasswordHash('test123')  # Simple password for testing
        
        try:
            db.session.add(test_user)
            db.session.commit()
            
            print("✓ Test user created successfully!")
            print(f"  User ID: {test_user.user_id}")
            print(f"  Username: {test_user.username}")
            print(f"  Email: {test_user.email}")
            print(f"  Password: test123")
            print("\nℹ  Use this user_id in your tests!")
            
            return test_user.user_id
            
        except Exception as e:
            db.session.rollback()
            print(f"✗ Error creating test user: {e}")
            return None


def list_existing_users():
    """List first 5 users in the database"""
    
    with app.app_context():
        users = Users.query.limit(5).all()
        
        if not users:
            print("No users found in database.")
            return None
        
        print("\n📋 Existing users in database:")
        print("-" * 50)
        for user in users:
            print(f"ID: {user.user_id} | Username: {user.username} | Email: {user.email}")
        print("-" * 50)
        
        return users[0].user_id


def main():
    print("=" * 60)
    print("CHATBOT TEST USER SETUP")
    print("=" * 60)
    
    print("\nOptions:")
    print("1. Create new test user (chatbot_tester)")
    print("2. List existing users")
    print("3. Both (create test user and list existing)")
    
    choice = input("\nSelect option (1-3): ").strip()
    
    if choice == '1':
        user_id = create_test_user()
        if user_id:
            print(f"\n✓ Update TEST_USER_ID in test_chatbot.py to: {user_id}")
    
    elif choice == '2':
        first_user_id = list_existing_users()
        if first_user_id:
            print(f"\n✓ You can use user_id {first_user_id} for testing")
            print(f"  Update TEST_USER_ID in test_chatbot.py to: {first_user_id}")
    
    elif choice == '3':
        user_id = create_test_user()
        print()
        list_existing_users()
        if user_id:
            print(f"\n✓ Update TEST_USER_ID in test_chatbot.py to: {user_id}")
    
    else:
        print("Invalid option")


if __name__ == "__main__":
    main()