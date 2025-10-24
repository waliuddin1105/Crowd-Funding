"""
Diagnostic tool to identify the issue with your Flask API
"""

import requests
import json

BASE_URL = "http://localhost:5000"

def diagnose():
    print("=" * 60)
    print("DIAGNOSTIC TOOL - Finding the Issue")
    print("=" * 60)
    
    # Test 1: Check if server is running
    print("\n[TEST 1] Checking if server is running...")
    try:
        response = requests.get(BASE_URL, timeout=5)
        print(f"✓ Server responded with status code: {response.status_code}")
        print(f"✓ Content-Type: {response.headers.get('Content-Type', 'Not set')}")
        print(f"✓ Response preview: {response.text[:200]}")
    except requests.exceptions.ConnectionRefusedError:
        print("✗ CONNECTION REFUSED - Flask app is NOT running!")
        print("\nSOLUTION: Start your Flask app first:")
        print("  python app.py")
        return
    except Exception as e:
        print(f"✗ Error: {e}")
        return
    
    # Test 2: Check /chat endpoint exists
    print("\n[TEST 2] Checking if /chat endpoint exists...")
    try:
        response = requests.post(
            f"{BASE_URL}/chat",
            json={"user_id": 999, "message": "test"},
            timeout=5
        )
        print(f"✓ /chat endpoint responded with status: {response.status_code}")
        print(f"✓ Content-Type: {response.headers.get('Content-Type', 'Not set')}")
        print(f"✓ Response text: {response.text[:500]}")
        
        # Try to parse JSON
        try:
            data = response.json()
            print(f"✓ Valid JSON response: {json.dumps(data, indent=2)}")
        except:
            print("✗ Response is NOT valid JSON!")
            print(f"Raw response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("✗ CONNECTION REFUSED - Server is not running or not accessible")
    except requests.exceptions.Timeout:
        print("✗ REQUEST TIMEOUT - Server took too long to respond")
    except Exception as e:
        print(f"✗ Error: {e}")
    
    # Test 3: Check for common issues
    print("\n[TEST 3] Checking common issues...")
    
    # Check if using Flask-RESTX
    print("\n→ Checking Flask-RESTX setup...")
    try:
        response = requests.get(f"{BASE_URL}/", timeout=5)
        if 'swagger' in response.text.lower() or 'api' in response.text.lower():
            print("! Detected Flask-RESTX/Swagger UI")
            print("! Your route might need to be registered with an API namespace")
    except:
        pass
    
    # Test with different endpoints
    print("\n[TEST 4] Testing possible endpoint variations...")
    endpoints = ["/chat", "/api/chat", "/Chat", "/CHAT"]
    
    for endpoint in endpoints:
        try:
            response = requests.post(
                f"{BASE_URL}{endpoint}",
                json={"user_id": 999, "message": "test"},
                timeout=2
            )
            if response.status_code != 404:
                print(f"✓ Found working endpoint: {endpoint} (status: {response.status_code})")
        except:
            pass
    
    print("\n" + "=" * 60)
    print("DIAGNOSIS COMPLETE")
    print("=" * 60)
    
    print("\n📋 NEXT STEPS:")
    print("1. Make sure your Flask app is running")
    print("2. Check if you're using Flask-RESTX (imports from flask_restx)")
    print("3. Verify the route is registered correctly")
    print("4. Share the output above for more specific help")

if __name__ == "__main__":
    diagnose()