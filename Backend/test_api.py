import requests
import time
import sys

BASE_URL = "http://127.0.0.1:8000"

def wait_for_server():
    print("Waiting for server to start...")
    for _ in range(10):
        try:
            response = requests.get(BASE_URL)
            if response.status_code == 200:
                print("✅ Server is up!")
                return True
        except requests.exceptions.ConnectionError:
            time.sleep(1)
    print("❌ Server failed to respond.")
    return False

def test_get_books():
    print("\nTesting GET /req/books/getall ...")
    try:
        response = requests.get(f"{BASE_URL}/req/books/getall")
        if response.status_code == 200:
            books = response.json()
            print(f"✅ Success! Retrieved {len(books)} books.")
            if len(books) > 0:
                print(f"Sample Book: {books[0]}")
            else:
                print("No books found in database (but query worked).")
        else:
            print(f"❌ Failed: Status {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    if wait_for_server():
        test_get_books()
    else:
        sys.exit(1)
