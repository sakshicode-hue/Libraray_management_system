
import requests
import json

def test_login():
    url = "http://localhost:3000/auth/login"
    login_data = {
        "email": "temp_admin@test.com",
        "password": "password123"
    }
    
    print(f"Attempting login with: {login_data['email']}")
    try:
        res = requests.post(url, json=login_data)
        print(f"Status Code: {res.status_code}")
        print(f"Response: {res.text}")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_login()
