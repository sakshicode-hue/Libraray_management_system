
import requests
import json

def test_add_book():
    url = "http://localhost:3000/books"
    # Assuming user is authenticated, we need a token.
    # But for quick test, I'll check if I can register/login or just use the token from local storage if I could, but I can't access browser local storage.
    
    # I need to login first to get a token because add_book requires authentication/librarian role.
    
    # Login as the user I just promoted (or any user)
    # I'll use the user found in check_users.py: "test_debug_final@example.com" (I need to know the password, likely "password123" from seed or registration)
    # Actually, I don't know the password.
    
    # Alternatively, I can temporarily disable auth dependency on the route? No, that's hacking code.
    
    # I will try to create a new admin user first, get token, then add book.
    
    # Register new admin
    register_url = "http://localhost:3000/auth/register"
    user_data = {
        "email": "temp_admin@test.com",
        "password": "password123",
        "full_name": "Temp Admin",
        "role": "admin"
    }
    
    # Try to register (might fail if exists)
    try:
        requests.post(register_url, json=user_data)
    except:
        pass

    # Login
    login_url = "http://localhost:3000/auth/login"
    login_data = {
        "email": "temp_admin@test.com",
        "password": "password123"
    }
    
    login_res = requests.post(login_url, json=login_data)
    if login_res.status_code != 200:
        print(f"Login failed: {login_res.text}")
        return

    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Add Book Payload
    book_payload = {
        "title": "Test Book Integration",
        "author": "Test Author",
        "isbn": "123-456-7890", # Unique ISBN
        "category": "Science",
        "publisher": "Test Pub",
        "publication_year": 2024,
        "total_copies": 5,
        "description": "A test book"
    }
    
    print(f"Sending payload: {json.dumps(book_payload, indent=2)}")
    
    res = requests.post(url, json=book_payload, headers=headers)
    
    print(f"Status Code: {res.status_code}")
    print(f"Response: {res.text}")

if __name__ == "__main__":
    test_add_book()
