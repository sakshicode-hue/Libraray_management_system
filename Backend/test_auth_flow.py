import requests
import random
import string

BASE_URL = "http://127.0.0.1:8000"

def generate_email():
    return f"test_user_{random.randint(1000, 9999)}@example.com"

def test_auth_flow():
    # 1. Generate random user credentials
    email = generate_email()
    password = "TestPassword@123"
    name = "Test User"
    
    print(f"--- Testing Auth Flow for {email} ---")
    
    # 2. Test Signup
    print("\n1. Testing Signup (/req/users/signup)...")
    signup_payload = {
        "name": name,
        "email": email,
        "password": password
    }
    try:
        resp = requests.post(f"{BASE_URL}/req/users/signup", json=signup_payload)
        if resp.status_code == 200:
            print("✅ Signup Successful!")
            print(f"Response: {resp.json()}")
        else:
            print(f"❌ Signup Failed: {resp.status_code}")
            print(resp.text)
            return
    except Exception as e:
        print(f"❌ Error connecting to server: {e}")
        return

    # 3. Test Login
    print("\n2. Testing Login (/req/users/login)...")
    login_payload = {
        "email": email,
        "password": password
    }
    try:
        resp = requests.post(f"{BASE_URL}/req/users/login", json=login_payload)
        if resp.status_code == 200:
            print("✅ Login Successful!")
            print(f"Response: {resp.json()}")
            
            # Check for cookie (if applicable)
            if 'token' in resp.cookies:
                print("✅ Token Cookie received!")
            else:
                print("ℹ️ Note: No cookie in response (might be HttpOnly or not set).")
        else:
            print(f"❌ Login Failed: {resp.status_code}")
            print(resp.text)
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_auth_flow()
