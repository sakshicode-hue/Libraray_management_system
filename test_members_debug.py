
import requests
import json

def test_members():
    # 1. Login to get token
    login_url = "http://localhost:3000/auth/login"
    login_data = {
        "email": "temp_admin@test.com",
        "password": "password123"
    }
    
    print("Logging in...")
    try:
        login_res = requests.post(login_url, json=login_data)
        if login_res.status_code != 200:
            print(f"Login failed: {login_res.text}")
            return
        
        token = login_res.json()["access_token"]
        print("Login successful. Token received.")
        
        # 2. Fetch Members
        url = "http://localhost:3000/members/?page=1&page_size=1"
        headers = {"Authorization": f"Bearer {token}"}
        
        print("\nFetching members with token...")
        res = requests.get(url, headers=headers)
        print(f"Status Code: {res.status_code}")
        if res.status_code == 200:
            print("Success! (Partial output):", res.text[:200])
        else:
            print("Failed:", res.text)
            
        # 3. Test without token (Expect 403)
        print("\nFetching members WITHOUT token...")
        res_no_auth = requests.get(url)
        print(f"Status Code: {res_no_auth.status_code}")
        print("Response:", res_no_auth.text)

    except Exception as e:
        print(f"Test failed: {e}")

if __name__ == "__main__":
    test_members()
