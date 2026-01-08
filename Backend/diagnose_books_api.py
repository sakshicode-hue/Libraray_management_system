import sys
import traceback

print("=" * 60)
print("BOOKS API DIAGNOSTIC TEST")
print("=" * 60)

# Test 1: Database connection and book count
print("\n[1] Testing database connection and book count...")
try:
    from app.database import get_connection
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM books")
    count = cursor.fetchone()[0]
    print(f"✓ Database has {count} books")
    
    if count == 0:
        print("✗ ERROR: Database is empty!")
        sys.exit(1)
    
    # Get column names
    cursor.execute("SELECT * FROM books LIMIT 1")
    cols = [desc[0] for desc in cursor.description]
    print(f"✓ Columns: {cols}")
    
    conn.close()
except Exception as e:
    print(f"✗ Database error: {e}")
    traceback.print_exc()
    sys.exit(1)

# Test 2: Test the get_books controller function
print("\n[2] Testing get_books() controller function...")
try:
    from app.controllers.books import get_books
    books = get_books()
    print(f"✓ get_books() returned {len(books)} books")
    
    if len(books) == 0:
        print("✗ ERROR: get_books() returned empty list!")
        sys.exit(1)
    
    # Show first book structure
    print(f"✓ First book structure:")
    first_book = books[0]
    for key, value in first_book.items():
        print(f"    {key}: {value}")
    
except Exception as e:
    print(f"✗ Controller error: {e}")
    traceback.print_exc()
    sys.exit(1)

# Test 3: Test the API endpoint directly
print("\n[3] Testing /req/books/getall API endpoint...")
try:
    import urllib.request
    import urllib.error
    import json
    
    try:
        with urllib.request.urlopen("http://127.0.0.1:8000/req/books/getall") as response:
            data = response.read().decode()
            books_data = json.loads(data)
            print(f"✓ API returned {len(books_data)} books")
            print(f"✓ Response type: {type(books_data)}")
            
            if isinstance(books_data, list) and len(books_data) > 0:
                print(f"✓ First book from API:")
                for key, value in books_data[0].items():
                    print(f"    {key}: {value}")
            elif len(books_data) == 0:
                print("✗ ERROR: API returned empty array!")
            
    except urllib.error.HTTPError as e:
        print(f"✗ HTTP Error: {e.code}")
        print(f"   Body: {e.read().decode()}")
        if e.code == 401:
            print("   NOTE: This is expected - endpoint requires authentication")
            print("   The frontend should handle this with cookies")
        sys.exit(1)
        
except Exception as e:
    print(f"✗ API test error: {e}")
    traceback.print_exc()
    sys.exit(1)

print("\n" + "=" * 60)
print("✓ ALL TESTS PASSED - API is working correctly!")
print("=" * 60)
print("\nIf the frontend still shows no books, the issue is likely:")
print("1. Authentication cookies not being sent")
print("2. Frontend data parsing/display issue")
print("3. Browser console errors")
