import http.server
import socketserver
import json
import os
import urllib.parse
from datetime import datetime, timezone

PORT = 8000
DIRECTORY = "."

class BlogAdminHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_POST(self):
        # We only handle the specific API endpoint used by the editor
        if self.path == '/api/posts':
            self._handle_create_post()
        else:
            self.send_error(404, "Endpoint not found")

    def _handle_create_post(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
        except json.JSONDecodeError:
            self.send_error(400, "Invalid JSON data")
            return

        # Very basic auth lock (checked locally)
        token = self.headers.get('X-Auth-Token')
        if token != "vader":
            self.send_response(401)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"detail": "Unauthorized. Incorrect Jedi Code."}')
            return

        title = data.get('title')
        slug = data.get('slug')
        content = data.get('content')

        if not title or not slug or not content:
            self.send_error(400, "Missing required fields")
            return

        posts_file = os.path.join(DIRECTORY, "data", "posts.json")
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(posts_file), exist_ok=True)

        posts = []
        if os.path.exists(posts_file):
            with open(posts_file, 'r', encoding='utf-8') as f:
                try:
                    posts = json.load(f)
                except json.JSONDecodeError:
                    posts = []

        # Check for slug collision
        if any(p.get('url_slug') == slug for p in posts):
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"detail": "A post with this slug already exists."}')
            return

        new_post = {
            "title": title,
            "url_slug": slug,
            "content": content,
            "created_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
        }

        posts.insert(0, new_post) # Add to top

        with open(posts_file, 'w', encoding='utf-8') as f:
            json.dump(posts, f, indent=4)

        self.send_response(201)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(new_post).encode('utf-8'))


if __name__ == '__main__':
    # Change to the directory containing this script
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), BlogAdminHandler) as httpd:
        print(f"===========================================================")
        print(f"Jedi Archives: Local Admin Server running at port {PORT}")
        print(f"-----------------------------------------------------------")
        print(f"To preview the live site, go to: http://localhost:{PORT}/")
        print(f"To write a new post, go to:      http://localhost:{PORT}/local_admin_editor.html")
        print(f"===========================================================")
        print(f"WARNING: When you are done, press CTRL+C to stop the server.")
        print(f"Then run 'git push' to deploy your new posts.json to GitHub Pages.")
        print(f"===========================================================")
        httpd.serve_forever()
