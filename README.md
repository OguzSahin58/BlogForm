# Oguz Sahin | Personal Blog

This is a personal blog with a custom Python backend (FastAPI) and a highly styled Vanilla HTML/JS frontend.

## 🚀 Running the App Locally

The easiest way to start the blog is to use the provided startup scripts. This will automatically set up the Python environment, start the FastAPI backend on port 8000, and launch the frontend on port 3000.

### On Mac, Linux, or Git Bash
```bash
./start.sh
```

### On Windows (Command Prompt / PowerShell)
Double-click `start.bat` or run:
```cmd
start.bat
```

Once running, you can view the blog at `http://localhost:3000`.

## 🔒 Secret Admin Editor
The editor interface has been completely removed from the `frontend` web directory to guarantee it is never accidentally served to normal users. 

To write a new transmission, do not use the `localhost:3000` web server. Instead, go to the project root folder (`AntiGravity/BlogForm`) and double-click the `local_admin_editor.html` file to open it directly in your browser.

---

## ✍️ How to Add New Blog Posts

Since we removed the hardcoded initial posts, your blog starts completely empty. You are the only one who provides content. Right now, there is no "admin" UI pane, so you interact with your API directly to create posts.

You can post new entries by sending a simple JSON `POST` request to your FastAPI backend.

### Option A: Using PowerShell (Windows)

While the backend is running, open a new PowerShell window and run the following command:

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:8000/api/posts" -ContentType "application/json" -Body '{
    "title": "My First Real Post",
    "content": "<p>I am controlling the backend directly now. The database is empty no more!</p><p>Because this takes raw HTML, you can add <strong>bold text</strong> or <em>italics</em> very easily.</p>",
    "slug": "my-first-real-post"
}'
```

*Note: The `slug` is the URL-friendly version of the name. If the title is "My Post", the slug should be `my-post`, as no spaces are allowed.*

### Option B: Using Swagger UI / FastAPI Docs (Easy Visual Method)

FastAPI automatically generates an interactive documentation page where you can test your APIs in the browser!

1. Make sure the backend server (`uvicorn`) is running.
2. Open your browser and go to: `http://localhost:8000/docs`
3. Click on the green **`POST /api/posts/`** endpoint to expand it.
4. Click the **"Try it out"** button in the top right of the section.
5. In the "Request body" text area, enter your post data in JSON format:
   ```json
   {
     "title": "Welcome to the Dark Side",
     "content": "<p>We have cookies.</p>",
     "slug": "welcome-dark-side"
   }
   ```
6. Click the large blue **Execute** button.
7. Return to your blog at `http://localhost:3000` and refresh the page. You'll instantly see your new post!
