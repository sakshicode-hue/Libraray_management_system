import sys
import traceback

# Test 1: Check if we can import the database module
try:
    from app.database import get_connection
    print("✓ Successfully imported get_connection")
except Exception as e:
    print(f"✗ Failed to import get_connection: {e}")
    sys.exit(1)

# Test 2: Check if we can connect to the database
try:
    conn = get_connection()
    print("✓ Successfully connected to database")
    cursor = conn.cursor()
except Exception as e:
    print(f"✗ Failed to connect to database: {e}")
    traceback.print_exc()
    sys.exit(1)

# Test 3: Check if books table exists and get column names
try:
    cursor.execute("SELECT * FROM books LIMIT 0")
    colnames = [desc[0] for desc in cursor.description]
    print(f"✓ Books table exists with columns: {colnames}")
except Exception as e:
    print(f"✗ Failed to query books table: {e}")
    traceback.print_exc()
    conn.close()
    sys.exit(1)

# Test 4: Count books in the table
try:
    cursor.execute("SELECT COUNT(*) FROM books")
    count = cursor.fetchone()[0]
    print(f"✓ Books table has {count} rows")
except Exception as e:
    print(f"✗ Failed to count books: {e}")
    traceback.print_exc()
    conn.close()
    sys.exit(1)

# Test 5: Try to fetch all books using the controller function
try:
    conn.close()  # Close previous connection
    from app.controllers.books import get_books
    books = get_books()
    print(f"✓ get_books() returned {len(books)} books")
    if len(books) > 0:
        print(f"  First book keys: {list(books[0].keys())}")
    else:
        print("  ⚠ No books found in database!")
except Exception as e:
    print(f"✗ Failed to call get_books(): {e}")
    traceback.print_exc()
    sys.exit(1)

print("\n✓ All tests passed!")
