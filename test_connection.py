import requests

def test_urls():
    urls = [
        "http://localhost:5000/health",
        "http://localhost:5173/"
    ]
    for url in urls:
        try:
            r = requests.get(url)
            print(f"URL: {url} - Status: {r.status_code}")
            if r.status_code == 200:
                print(f"Content snippet: {r.text[:50]}...")
        except Exception as e:
            print(f"URL: {url} - Error: {e}")

if __name__ == "__main__":
    test_urls()
