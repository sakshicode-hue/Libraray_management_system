import urllib.request
import urllib.error

try:
    with urllib.request.urlopen("http://127.0.0.1:8000/req/books/getall") as response:
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print("Body:", e.read().decode())
except Exception as e:
    print(f"Error: {e}")
