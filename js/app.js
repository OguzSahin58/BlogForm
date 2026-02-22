const API_URL = 'data/posts.json';

// Format date utility
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Fetch list of posts for the home page
async function fetchPosts() {
    const container = document.getElementById('posts-container');
    if (!container) return;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch posts');

        let posts = [];
        try {
            posts = await response.json();
        } catch (e) { /* Empty JSON */ }

        if (posts.length === 0) {
            container.innerHTML = '<p class="text-secondary">No recorded transmissions found in the archives.</p>';
            return;
        }

        container.innerHTML = posts.map(post => `
            <article class="post-item">
                <time class="post-date">${formatDate(post.created_at)}</time>
                <a href="post.html?slug=${post.url_slug}" class="post-item-link lightsaber-hover">${post.title}</a>
            </article>
        `).join('');
    } catch (error) {
        console.error('Error fetching posts:', error);
        container.innerHTML = '<p style="color: var(--accent-red);">Error connecting to the Jedi Holocron... Ensure manage_blog.py is running or static files are deployed.</p>';
    }
}

// Fetch single post for the post page
async function fetchPost(slug) {
    const container = document.getElementById('post-content');
    if (!container) return;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch posts data');

        const posts = await response.json();
        const post = posts.find(p => p.url_slug === slug);

        if (!post) {
            container.innerHTML = '<h2>Transmission Not Found (404)</h2><p>This record has been deleted from the archives.</p>';
            return;
        }

        container.innerHTML = `
            <h1 class="post-title">${post.title}</h1>
            <time class="post-date">${formatDate(post.created_at)}</time>
            <div class="post-body">
                ${post.content}
            </div>
        `;
        document.title = `Oguz Sahin | ${post.title}`;
    } catch (error) {
        console.error('Error fetching post:', error);
        container.innerHTML = '<p style="color: var(--accent-red);">Error decoding the transmission... Ensure manage_blog.py is running or static files are deployed.</p>';
    }
}

// Initialize home page
if (document.getElementById('posts-container')) {
    document.addEventListener('DOMContentLoaded', fetchPosts);
}

// Fetch About page content
async function fetchAbout() {
    const container = document.getElementById('about-content-container');
    if (!container) return;

    try {
        const response = await fetch('data/about.json');
        if (!response.ok) throw new Error('Failed to fetch about data');

        const data = await response.json();

        if (data && data.markdown) {
            container.innerHTML = marked.parse(data.markdown);
        } else {
            container.innerHTML = '<p class="text-secondary">Biography is currently empty.</p>';
        }
    } catch (error) {
        console.error('Error fetching about:', error);
        container.innerHTML = '<p style="color: var(--text-secondary);">The Jedi Archives have no record of this entity.</p>';
    }
}

// Initialize About page
if (document.getElementById('about-content-container')) {
    document.addEventListener('DOMContentLoaded', fetchAbout);
}

// --- Starfield Canvas Logic ---
const canvas = document.getElementById('starfield');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    const numStars = 400; // total stars onscreen
    let mouse = { x: -1000, y: -1000 };
    let animationId;

    // Save stars before page unload to feel continuous
    window.addEventListener('beforeunload', () => {
        sessionStorage.setItem('starfieldState', JSON.stringify({
            stars: stars,
            savedWidth: width,
            savedHeight: height
        }));
    });

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    function initStars() {
        // Try to load preserved state
        const savedStateJson = sessionStorage.getItem('starfieldState');
        if (savedStateJson) {
            try {
                const savedState = JSON.parse(savedStateJson);
                // Only reuse if window hasn't drastically changed size to prevent clipping
                if (Math.abs(savedState.savedWidth - window.innerWidth) < 100 &&
                    Math.abs(savedState.savedHeight - window.innerHeight) < 100) {
                    stars = savedState.stars;
                    return;
                }
            } catch (e) { /* ignore parse error */ }
        }

        // Fresh init
        stars = [];
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                z: Math.random() * 1.5 + 0.5, // Used for speed and size layer
                vx: 0,
                vy: 0
            });
        }
    }

    function updateAndDraw() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#FFF';

        // Distance within which stars are repelled (smaller radius so it's less annoying)
        const repulsionRadius = 50;
        const repulsionForce = 0.5;

        for (let star of stars) {
            // Check distance to mouse
            const dx = star.x - mouse.x;
            const dy = star.y - mouse.y;
            const distSq = dx * dx + dy * dy;

            // Apply repulsion force if near mouse
            if (distSq < repulsionRadius * repulsionRadius) {
                const dist = Math.sqrt(distSq);
                // Inverse force (stronger closer to mouse)
                const force = (repulsionRadius - dist) / repulsionRadius;

                const angle = Math.atan2(dy, dx);
                star.vx += Math.cos(angle) * force * repulsionForce;
                star.vy += Math.sin(angle) * force * repulsionForce;
            }

            // Move star by its current momentum
            star.x += star.vx;
            star.y += star.vy;

            // Apply friction to slow down over time back to normal speed
            star.vx *= 0.95;
            star.vy *= 0.95;

            // Baseline downward drift (parallax effect) - Slower falling speed 
            star.y += star.z * 0.1;

            // Wrap around edges to maintain constant star count
            if (star.y > height) {
                star.y = 0;
                star.x = Math.random() * width;
                star.vy = 0;
                star.vx = 0;
            } else if (star.y < 0 && star.vy < 0) {
                // if pushed off top by mouse
                star.y = height;
            }

            if (star.x < 0) {
                star.x = width;
                star.vx = 0;
            } else if (star.x > width) {
                star.x = 0;
                star.vx = 0;
            }

            // Draw the star
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.z * 0.8, 0, Math.PI * 2);
            ctx.fill();
        }

        animationId = requestAnimationFrame(updateAndDraw);
    }

    // Re-initialize on window resize to ensure full coverage
    window.addEventListener('resize', () => {
        resize();
        // If window resizes significantly, re-init stars to cover new space
        if (Math.abs(width - canvas.width) > 100 || Math.abs(height - canvas.height) > 100) {
            initStars();
        }
    });

    // Track mouse position
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    resize();
    initStars();
    updateAndDraw();
}
