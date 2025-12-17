// ===========================================
// LINKEDIN-STYLE PORTFOLIO - JAVASCRIPT
// Feed Interactions & Dynamic Content
// ===========================================

// Sample posts data with projects, blogs, and updates
const feedPosts = [
  {
    id: 1,
    type: "project",
    author: "Jayanta Mardi",
    headline: "Software Developer at National Informatics Centre",
    avatar: "assets/images/index.jpg",
    timestamp: "2 days ago",
    content:
      "🚀 Excited to share my latest project: Microservices Architecture with ASP.NET Core!\n\nBuilt a scalable microservices system with:\n✅ ASP.NET Core Web API\n✅ RabbitMQ for message queuing\n✅ Docker containerization\n✅ OpenTelemetry for observability\n✅ PostgreSQL database\n\nThis architecture improved system scalability by 60% and reduced deployment time by 40%.",
    tags: ["#AspNetCore", "#Microservices", "#Docker", "#RabbitMQ"],
    image: null,
    link: null,
    likes: 156,
    comments: 23,
    shares: 12,
  },
  {
    id: 2,
    type: "blog",
    author: "Jayanta Mardi",
    headline: "Software Developer at National Informatics Centre",
    avatar: "assets/images/index.jpg",
    timestamp: "5 days ago",
    content:
      '📝 New Blog Post: "Clean Architecture in .NET - A Practical Guide"\n\nI wrote an in-depth article about implementing Clean Architecture principles in ASP.NET Core applications. Topics covered:\n\n• Separation of Concerns\n• Dependency Inversion\n• SOLID Principles\n• Repository Pattern\n• CQRS Implementation\n\nRead the full article here! 👇',
    tags: ["#CleanArchitecture", "#DotNet", "#SoftwareEngineering"],
    image: null,
    link: {
      title: "Clean Architecture in .NET - A Practical Guide",
      description:
        "Learn how to implement Clean Architecture principles in ASP.NET Core applications with real-world examples.",
      image:
        "https://via.placeholder.com/400x200/0a66c2/ffffff?text=Clean+Architecture",
    },
    likes: 243,
    comments: 45,
    shares: 28,
  },
  {
    id: 3,
    type: "update",
    author: "Jayanta Mardi",
    headline: "Software Developer at National Informatics Centre",
    avatar: "assets/images/index.jpg",
    timestamp: "1 week ago",
    content:
      '🎓 Just completed the "Advanced Docker and Kubernetes" course!\n\nLearned advanced concepts including:\n• Multi-stage Docker builds\n• Docker Compose orchestration\n• Kubernetes deployment strategies\n• Container security best practices\n\nReady to implement these in production! 💪',
    tags: ["#Docker", "#Kubernetes", "#DevOps", "#Learning"],
    image: null,
    link: null,
    likes: 189,
    comments: 31,
    shares: 15,
  },
  {
    id: 4,
    type: "project",
    author: "Jayanta Mardi",
    headline: "Software Developer at National Informatics Centre",
    avatar: "assets/images/index.jpg",
    timestamp: "2 weeks ago",
    content:
      "🔒 Enhanced Security Implementation for ePanchayat Platform\n\nImplemented AES-encrypted JWT middleware and claim-based authorization:\n\n• Increased API security by 60%\n• Zero security incidents in production\n• Improved authentication flow\n• Role-based access control\n\nServing 20,000+ users with enterprise-grade security! 🛡️",
    tags: ["#Security", "#JWT", "#AspNetCore", "#Authentication"],
    image: null,
    link: null,
    likes: 312,
    comments: 52,
    shares: 34,
  },
  {
    id: 5,
    type: "blog",
    author: "Jayanta Mardi",
    headline: "Software Developer at National Informatics Centre",
    avatar: "assets/images/index.jpg",
    timestamp: "3 weeks ago",
    content:
      "💡 Performance Optimization Tips for ASP.NET Core APIs\n\nJust published a comprehensive guide on optimizing API performance. Key takeaways:\n\n1️⃣ EF Core optimization techniques\n2️⃣ Response caching strategies\n3️⃣ Async/await best practices\n4️⃣ Database query optimization\n5️⃣ Load balancing strategies\n\nAchieved 40% performance improvement in production! 🚀",
    tags: ["#Performance", "#AspNetCore", "#Optimization", "#BestPractices"],
    image: null,
    link: {
      title: "ASP.NET Core API Performance Optimization Guide",
      description:
        "Learn practical techniques to optimize your ASP.NET Core APIs and improve response times.",
      image:
        "https://via.placeholder.com/400x200/764ba2/ffffff?text=Performance+Tips",
    },
    likes: 428,
    comments: 67,
    shares: 51,
  },
  {
    id: 6,
    type: "achievement",
    author: "Jayanta Mardi",
    headline: "Software Developer at National Informatics Centre",
    avatar: "assets/images/index.jpg",
    timestamp: "1 month ago",
    content:
      "🎉 Proud to announce that our team successfully delivered the ePension platform!\n\n📊 Impact:\n• 100+ production APIs\n• 20,000+ active users\n• 30% reduction in defects\n• Zero downtime in 6 months\n\nThanks to my amazing team at NIC for this incredible journey! 🙏",
    tags: ["#TeamWork", "#Achievement", "#eGovernance", "#Success"],
    image: null,
    link: null,
    likes: 567,
    comments: 89,
    shares: 42,
  },
];

// ===========================================
// THEME TOGGLE
// ===========================================

function toggleTheme() {
  const body = document.body;
  const themeIcon = document.getElementById("theme-icon");

  if (body.getAttribute("data-theme") === "light") {
    body.setAttribute("data-theme", "dark");
    themeIcon.className = "fas fa-moon";
    localStorage.setItem("theme", "dark");
  } else {
    body.setAttribute("data-theme", "light");
    themeIcon.className = "fas fa-sun";
    localStorage.setItem("theme", "light");
  }
}

// Load saved theme
document.addEventListener("DOMContentLoaded", function () {
  const savedTheme = localStorage.getItem("theme") || "light";
  const themeIcon = document.getElementById("theme-icon");

  document.body.setAttribute("data-theme", savedTheme);
  themeIcon.className = savedTheme === "light" ? "fas fa-sun" : "fas fa-moon";

  // Load feed posts
  loadFeedPosts();
});

// ===========================================
// FEED POST RENDERING
// ===========================================

function loadFeedPosts() {
  const feedContainer = document.getElementById("feed-posts");

  feedPosts.forEach((post) => {
    const postElement = createPostElement(post);
    feedContainer.appendChild(postElement);
  });
}

function createPostElement(post) {
  const postDiv = document.createElement("div");
  postDiv.className = "feed-post card";
  postDiv.innerHTML = `
    <div class="post-header">
      <img src="${post.avatar}" alt="${post.author}" class="post-avatar" />
      <div class="post-author-info">
        <div class="post-author-name">${post.author}</div>
        <div class="post-author-headline">${post.headline}</div>
        <div class="post-timestamp">
          <span>${post.timestamp}</span>
          <span>•</span>
          <i class="fas fa-globe-americas"></i>
        </div>
      </div>
      <button class="post-menu-btn">
        <i class="fas fa-ellipsis-h"></i>
      </button>
    </div>

    <div class="post-content">
      <div class="post-text">${post.content.replace(/\n/g, "<br>")}</div>
      ${
        post.tags
          ? `
        <div class="post-tags">
          ${post.tags
            .map((tag) => `<span class="post-tag">${tag}</span>`)
            .join("")}
        </div>
      `
          : ""
      }
      ${
        post.image
          ? `<img src="${post.image}" alt="Post image" class="post-image" />`
          : ""
      }
      ${
        post.link
          ? `
        <div class="post-link-preview">
          <img src="${post.link.image}" alt="${post.link.title}" class="link-preview-image" />
          <div class="link-preview-content">
            <div class="link-preview-title">${post.link.title}</div>
            <div class="link-preview-description">${post.link.description}</div>
          </div>
        </div>
      `
          : ""
      }
    </div>

    <div class="post-stats">
      <div class="post-likes">
        <span class="like-icon"><i class="fas fa-thumbs-up"></i></span>
        <span>${post.likes}</span>
      </div>
      <div class="post-engagement">
        <span>${post.comments} comments</span>
        <span>•</span>
        <span>${post.shares} shares</span>
      </div>
    </div>

    <div class="post-actions">
      <button class="action-btn like-btn" onclick="toggleLike(${
        post.id
      }, this)">
        <i class="far fa-thumbs-up"></i>
        <span>Like</span>
      </button>
      <button class="action-btn">
        <i class="far fa-comment"></i>
        <span>Comment</span>
      </button>
      <button class="action-btn">
        <i class="fas fa-share"></i>
        <span>Share</span>
      </button>
      <button class="action-btn">
        <i class="fas fa-paper-plane"></i>
        <span>Send</span>
      </button>
    </div>
  `;

  return postDiv;
}

// ===========================================
// POST INTERACTIONS
// ===========================================

function toggleLike(postId, button) {
  const icon = button.querySelector("i");
  const isLiked = button.classList.contains("liked");

  if (isLiked) {
    button.classList.remove("liked");
    icon.className = "far fa-thumbs-up";
  } else {
    button.classList.add("liked");
    icon.className = "fas fa-thumbs-up";
  }

  // Update like count in data
  const post = feedPosts.find((p) => p.id === postId);
  if (post) {
    post.likes += isLiked ? -1 : 1;
    updatePostStats(postId);
  }
}

function updatePostStats(postId) {
  const post = feedPosts.find((p) => p.id === postId);
  if (post) {
    const postElement = document.querySelector(`[data-post-id="${postId}"]`);
    if (postElement) {
      const likesElement = postElement.querySelector(
        ".post-likes span:last-child"
      );
      if (likesElement) {
        likesElement.textContent = post.likes;
      }
    }
  }
}

// ===========================================
// POST MODAL
// ===========================================

function openPostModal() {
  const modal = document.getElementById("postModal");
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closePostModal() {
  const modal = document.getElementById("postModal");
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
  document.getElementById("postContent").value = "";
}

function createPost() {
  const content = document.getElementById("postContent").value.trim();

  if (!content) {
    alert("Please write something to post!");
    return;
  }

  const newPost = {
    id: feedPosts.length + 1,
    type: "update",
    author: "Jayanta Mardi",
    headline: "Software Developer at National Informatics Centre",
    avatar: "assets/images/index.jpg",
    timestamp: "Just now",
    content: content,
    tags: extractHashtags(content),
    image: null,
    link: null,
    likes: 0,
    comments: 0,
    shares: 0,
  };

  feedPosts.unshift(newPost);

  const feedContainer = document.getElementById("feed-posts");
  const postElement = createPostElement(newPost);
  feedContainer.insertBefore(postElement, feedContainer.firstChild);

  closePostModal();

  // Show success message
  showNotification("Post published successfully!");
}

function extractHashtags(text) {
  const hashtags = text.match(/#\w+/g);
  return hashtags || [];
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 70px;
    right: 20px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-md);
    padding: 16px 24px;
    box-shadow: var(--shadow-md);
    z-index: 3000;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById("postModal");
  if (event.target === modal) {
    closePostModal();
  }
};

// ===========================================
// SEARCH FUNCTIONALITY
// ===========================================

const searchInput = document.querySelector(".search-bar input");
if (searchInput) {
  searchInput.addEventListener("input", function (e) {
    const searchTerm = e.target.value.toLowerCase();

    if (searchTerm.length === 0) {
      loadFeedPosts();
      return;
    }

    const filteredPosts = feedPosts.filter(
      (post) =>
        post.content.toLowerCase().includes(searchTerm) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    );

    const feedContainer = document.getElementById("feed-posts");
    feedContainer.innerHTML = "";

    if (filteredPosts.length === 0) {
      feedContainer.innerHTML = `
        <div class="card" style="padding: 40px; text-align: center;">
          <i class="fas fa-search" style="font-size: 48px; color: var(--text-muted); margin-bottom: 16px;"></i>
          <h3 style="color: var(--text-primary); margin-bottom: 8px;">No posts found</h3>
          <p style="color: var(--text-secondary);">Try searching with different keywords</p>
        </div>
      `;
    } else {
      filteredPosts.forEach((post) => {
        const postElement = createPostElement(post);
        feedContainer.appendChild(postElement);
      });
    }
  });
}

// ===========================================
// SMOOTH SCROLLING
// ===========================================

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// ===========================================
// ANIMATIONS
// ===========================================

const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ===========================================
// LAZY LOADING
// ===========================================

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove("lazy");
      observer.unobserve(img);
    }
  });
});

document.querySelectorAll("img[data-src]").forEach((img) => {
  imageObserver.observe(img);
});

// ===========================================
// KEYBOARD SHORTCUTS
// ===========================================

document.addEventListener("keydown", function (e) {
  // Ctrl/Cmd + K to focus search
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    searchInput?.focus();
  }

  // Ctrl/Cmd + N to create new post
  if ((e.ctrlKey || e.metaKey) && e.key === "n") {
    e.preventDefault();
    openPostModal();
  }

  // Escape to close modal
  if (e.key === "Escape") {
    closePostModal();
  }
});

console.log("LinkedIn-style Portfolio loaded successfully! 🚀");
console.log(`📊 ${feedPosts.length} posts loaded`);
console.log(
  "💡 Keyboard shortcuts: Ctrl+K (Search), Ctrl+N (New Post), Esc (Close)"
);
