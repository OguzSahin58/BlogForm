# Oguz Sahin | Personal Blog

A personal blog created fully with Google Antigravity IDE.

## Features
- **Static Site:** Fast, lightweight, and simple to host.
- **Dynamic Content:** Posts and About section are loaded dynamically via JSON.
- **Starfield Canvas:** Interactive and animated background.
- **Local CMS:** Includes a local Python server (`manage_blog.py`) to add, edit, and delete posts easily.

## Getting Started

### Prerequisites
- Python 3.x (for running the local admin panel)

### Development
1. Clone the repository.
2. Run the local server and admin panel:
   ```bash
   python manage_blog.py
   ```
3. Open `http://localhost:8000/local_admin_editor.html` in your browser to manage content.

### Deployment
To deploy, simply upload the static files to any static hosting provider (e.g., GitHub Pages, Netlify, Vercel).

## Project Structure
- `index.html`: The main blog page.
- `post.html`: Template for individual posts.
- `about.html`: The about me page.
- `manage_blog.py`: Simple Python script to manage posts and generate JSON.
- `data/`: Contains `posts.json` and `about.json`.
- `js/app.js`: Main JavaScript file handling the dynamic fetching and canvas animation.
