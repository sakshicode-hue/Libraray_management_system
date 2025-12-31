import requests
import os
import sys

BASE_URL = "http://localhost:3000"

def register_admin(email, password):
    """Register a new admin user if login fails"""
    try:
        print(f"Attempting to register new admin: {email}")
        response = requests.post(f"{BASE_URL}/auth/register", json={
            "email": email,
            "password": password,
            "role": "admin",
            "full_name": "Setup Admin",
            "phone": "0000000000"
        })
        if response.status_code == 200 or response.status_code == 201:
            print("✅ Registration successful!")
            return True
        else:
            print(f"Registration failed (might already exist): {response.text}")
            return False
    except Exception as e:
        print(f"Registration error: {e}")
        return False

def login(email, password):
    """Login to get access token"""
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json={
            "email": email,
            "password": password
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        else:
            print(f"Login failed: {response.text}")
            return None
    except Exception as e:
        print(f"Connection error: {e}")
        return None

def create_dummy_pdf(filename, title):
    """Create a valid-ish dummy PDF file"""
    content = f"%PDF-1.4\n%âãÏÓ\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Resources <<\n/Font <<\n/F1 4 0 R\n>>\n>>\n/Contents 5 0 R\n>>\nendobj\n4 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\n5 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 24 Tf\n100 700 Td\n({title}) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000010 00000 n\n0000000060 00000 n\n0000000117 00000 n\n0000000216 00000 n\n0000000303 00000 n\ntrailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n406\n%%EOF".encode('latin-1')
    
    with open(filename, 'wb') as f:
        f.write(content)
    return filename

def upload_ebook(token, file_path, title, author, category):
    """Upload ebook file"""
    headers = {
        "Authorization": f"Bearer {token}"
    }

    try:
        with open(file_path, 'rb') as f:
            files = {'file': (f"{title}.pdf", f, 'application/pdf')}
            data = {
                'title': title,
                'author': author,
                'category': category
            }
            response = requests.post(
                f"{BASE_URL}/ebooks/upload",
                headers=headers,
                files=files,
                data=data
            )
            
            if response.status_code == 200:
                print(f"✅ Uploaded: {title}")
            else:
                print(f"❌ Failed: {title} - {response.text}")

    except Exception as e:
        print(f"Error uploading {title}: {e}")

if __name__ == "__main__":
    # USER CONFIGURATION
    ADMIN_EMAIL = "setup_admin@temp.com"
    ADMIN_PASS = "setup123" 
    
    SAMPLE_BOOKS = [
        {"title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "category": "Classic"},
        {"title": "1984", "author": "George Orwell", "category": "Dystopian"},
        {"title": "Pride and Prejudice", "author": "Jane Austen", "category": "Romance"},
        {"title": "The Hobbit", "author": "J.R.R. Tolkien", "category": "Fantasy"},
        {"title": "To Kill a Mockingbird", "author": "Harper Lee", "category": "Classic"},
        {"title": "Brave New World", "author": "Aldous Huxley", "category": "Dystopian"},
        {"title": "Moby Dick", "author": "Herman Melville", "category": "Adventure"},
        {"title": "War and Peace", "author": "Leo Tolstoy", "category": "Classic"},
        {"title": "The Catcher in the Rye", "author": "J.D. Salinger", "category": "Classic"},
        {"title": "The Lord of the Rings", "author": "J.R.R. Tolkien", "category": "Fantasy"}
    ]

    print("--- Seeding Library with Dummy E-Books ---")
    
    # 1. Login
    print(f"Logging in as {ADMIN_EMAIL}...")
    token = login(ADMIN_EMAIL, ADMIN_PASS)
    
    if not token:
        # Try registering if login fails
        register_admin(ADMIN_EMAIL, ADMIN_PASS)
        token = login(ADMIN_EMAIL, ADMIN_PASS)
    
    if token:
        # 2. Upload Books
        for book in SAMPLE_BOOKS:
            dummy_filename = "temp_dummy.pdf"
            create_dummy_pdf(dummy_filename, book['title'])
            
            upload_ebook(
                token, 
                dummy_filename, 
                book['title'], 
                book['author'], 
                book['category']
            )
            
            # Clean up
            if os.path.exists(dummy_filename):
                os.remove(dummy_filename)
            
        print("\n--- Seeding Complete ---")
    else:
        print("Could not log in even after registration attempt.")
