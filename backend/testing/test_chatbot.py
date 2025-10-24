"""
Test script for RAG chatbot API
Run this script to test your chatbot endpoints without a frontend.

Usage:
    python test_chatbot.py
"""

import requests
import json
from datetime import datetime
import time

# Configuration
BASE_URL = "http://localhost:5000"  # Change this to your Flask app URL
TEST_USER_ID = 1  # Test user ID


class Colors:
    """ANSI color codes for terminal output"""
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


def print_header(text):
    """Print a formatted header"""
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{text.center(60)}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}\n")


def print_success(text):
    """Print success message"""
    print(f"{Colors.OKGREEN}✓ {text}{Colors.ENDC}")


def print_error(text):
    """Print error message"""
    print(f"{Colors.FAIL}✗ {text}{Colors.ENDC}")


def print_info(text):
    """Print info message"""
    print(f"{Colors.OKCYAN}ℹ {text}{Colors.ENDC}")


def print_bot_response(response):
    """Print bot response in a formatted way"""
    print(f"\n{Colors.OKBLUE}{Colors.BOLD}Bot:{Colors.ENDC} {response}\n")


def send_message(user_id, message):
    """
    Send a message to the chatbot
    
    Returns:
        dict: Response from the API
    """
    url = f"{BASE_URL}/chat"
    payload = {
        "user_id": user_id,
        "message": message
    }
    
    try:
        response = requests.post(url, json=payload)
        return response.json(), response.status_code
    except requests.exceptions.RequestException as e:
        print_error(f"Connection error: {e}")
        return None, None


def get_chat_history(user_id, limit=None):
    """
    Get chat history for a user
    
    Returns:
        dict: Chat history from the API
    """
    url = f"{BASE_URL}/chat/history/{user_id}"
    if limit:
        url += f"?limit={limit}"
    
    try:
        response = requests.get(url)
        return response.json(), response.status_code
    except requests.exceptions.RequestException as e:
        print_error(f"Connection error: {e}")
        return None, None


def delete_chat_history(user_id):
    """
    Delete chat history for a user
    
    Returns:
        dict: Response from the API
    """
    url = f"{BASE_URL}/chat/history/{user_id}"
    
    try:
        response = requests.delete(url)
        return response.json(), response.status_code
    except requests.exceptions.RequestException as e:
        print_error(f"Connection error: {e}")
        return None, None


def test_basic_connectivity():
    """Test if the server is running"""
    print_header("Testing Server Connectivity")
    
    try:
        response = requests.get(f"{BASE_URL}/")
        print_success(f"Server is running! Status code: {response.status_code}")
        return True
    except requests.exceptions.RequestException as e:
        print_error(f"Cannot connect to server at {BASE_URL}")
        print_error(f"Error: {e}")
        print_info("Make sure your Flask app is running!")
        return False


def test_small_talk():
    """Test small talk responses"""
    print_header("Testing Small Talk")
    
    small_talk_messages = ["hi", "hello", "thanks", "bye"]
    
    for msg in small_talk_messages:
        print(f"\n{Colors.BOLD}User:{Colors.ENDC} {msg}")
        response, status = send_message(TEST_USER_ID, msg)
        
        if response and status == 200:
            print_bot_response(response.get('reply', 'No reply'))
            print_success("Small talk test passed")
        else:
            print_error(f"Small talk test failed for '{msg}'")
            if response:
                print_error(f"Response: {response}")


def test_conversation_flow():
    """Test a multi-turn conversation"""
    print_header("Testing Conversation Flow")
    
    conversation = [
        "What is this platform about?",
        "How can I donate?",
        "What payment methods do you support?",
        "Can you remind me what you told me about the platform?"
    ]
    
    for i, msg in enumerate(conversation, 1):
        print(f"\n{Colors.BOLD}Turn {i} - User:{Colors.ENDC} {msg}")
        response, status = send_message(TEST_USER_ID, msg)
        
        if response and status == 200:
            print_bot_response(response.get('reply', 'No reply'))
            print_success(f"Turn {i} successful")
        else:
            print_error(f"Turn {i} failed")
            if response:
                print_error(f"Response: {response}")
        
        time.sleep(1)  # Small delay between messages


def test_history_retrieval():
    """Test retrieving chat history"""
    print_header("Testing History Retrieval")
    
    response, status = get_chat_history(TEST_USER_ID)
    
    if response and status == 200:
        history = response.get('history', [])
        print_success(f"Retrieved {len(history)} messages")
        
        print(f"\n{Colors.BOLD}Chat History:{Colors.ENDC}")
        for msg in history[-6:]:  # Show last 6 messages
            role_color = Colors.OKGREEN if msg['role'] == 'User' else Colors.OKBLUE
            print(f"{role_color}{msg['role']}:{Colors.ENDC} {msg['message']}")
            print(f"  {Colors.WARNING}[{msg['timestamp']}]{Colors.ENDC}")
    else:
        print_error("Failed to retrieve history")
        if response:
            print_error(f"Response: {response}")


def test_error_handling():
    """Test error handling with invalid inputs"""
    print_header("Testing Error Handling")
    
    # Test empty message
    print(f"\n{Colors.BOLD}Testing empty message:{Colors.ENDC}")
    response, status = send_message(TEST_USER_ID, "")
    if status == 400:
        print_success("Empty message correctly rejected")
    else:
        print_error(f"Empty message not handled properly. Status: {status}")
    
    # Test missing user_id
    print(f"\n{Colors.BOLD}Testing missing user_id:{Colors.ENDC}")
    url = f"{BASE_URL}/chat"
    try:
        response = requests.post(url, json={"message": "test"})
        if response.status_code == 400:
            print_success("Missing user_id correctly rejected")
        else:
            print_error(f"Missing user_id not handled properly. Status: {response.status_code}")
    except Exception as e:
        print_error(f"Error: {e}")


def test_history_deletion():
    """Test deleting chat history"""
    print_header("Testing History Deletion")
    
    response, status = delete_chat_history(TEST_USER_ID)
    
    if response and status == 200:
        print_success("Chat history deleted successfully")
        print_info(response.get('message', ''))
    else:
        print_error("Failed to delete history")
        if response:
            print_error(f"Response: {response}")


def interactive_mode():
    """Interactive chat mode"""
    print_header("Interactive Chat Mode")
    print_info("Type 'quit' to exit, 'history' to see history, 'clear' to clear history")
    print_info(f"Chatting as user_id: {TEST_USER_ID}\n")
    
    while True:
        try:
            user_input = input(f"{Colors.OKGREEN}You: {Colors.ENDC}")
            
            if user_input.lower() == 'quit':
                print_info("Goodbye!")
                break
            
            if user_input.lower() == 'history':
                response, status = get_chat_history(TEST_USER_ID, limit=10)
                if response and status == 200:
                    history = response.get('history', [])
                    print(f"\n{Colors.BOLD}Last {len(history)} messages:{Colors.ENDC}")
                    for msg in history:
                        role_color = Colors.OKGREEN if msg['role'] == 'User' else Colors.OKBLUE
                        print(f"{role_color}{msg['role']}:{Colors.ENDC} {msg['message']}")
                print()
                continue
            
            if user_input.lower() == 'clear':
                response, status = delete_chat_history(TEST_USER_ID)
                if response and status == 200:
                    print_success("History cleared!")
                print()
                continue
            
            if not user_input.strip():
                continue
            
            response, status = send_message(TEST_USER_ID, user_input)
            
            if response and status == 200:
                print_bot_response(response.get('reply', 'No reply'))
            else:
                print_error("Failed to get response")
                if response:
                    print_error(f"Error: {response.get('error', 'Unknown error')}")
        
        except KeyboardInterrupt:
            print_info("\nGoodbye!")
            break
        except Exception as e:
            print_error(f"Error: {e}")


def main():
    """Main test function"""
    print(f"\n{Colors.HEADER}{Colors.BOLD}")
    print("╔════════════════════════════════════════════════════════════╗")
    print("║          RAG CHATBOT API TESTING SUITE                    ║")
    print("╚════════════════════════════════════════════════════════════╝")
    print(f"{Colors.ENDC}")
    
    print_info(f"Testing server at: {BASE_URL}")
    print_info(f"Test user ID: {TEST_USER_ID}")
    
    # Check connectivity first
    if not test_basic_connectivity():
        return
    
    # Menu
    while True:
        print(f"\n{Colors.BOLD}Test Options:{Colors.ENDC}")
        print("1. Run all automated tests")
        print("2. Test small talk only")
        print("3. Test conversation flow only")
        print("4. Test history retrieval")
        print("5. Test error handling")
        print("6. Clear test user history")
        print("7. Interactive chat mode")
        print("8. Exit")
        
        choice = input(f"\n{Colors.OKCYAN}Select option (1-8): {Colors.ENDC}")
        
        if choice == '1':
            # Clean slate
            delete_chat_history(TEST_USER_ID)
            test_small_talk()
            test_conversation_flow()
            test_history_retrieval()
            test_error_handling()
            print_header("All Tests Complete!")
        
        elif choice == '2':
            test_small_talk()
        
        elif choice == '3':
            test_conversation_flow()
        
        elif choice == '4':
            test_history_retrieval()
        
        elif choice == '5':
            test_error_handling()
        
        elif choice == '6':
            test_history_deletion()
        
        elif choice == '7':
            interactive_mode()
        
        elif choice == '8':
            print_info("Goodbye!")
            break
        
        else:
            print_error("Invalid option. Please select 1-8.")


if __name__ == "__main__":
    main()