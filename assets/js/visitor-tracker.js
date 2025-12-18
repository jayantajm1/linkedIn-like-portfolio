// ===========================================
// VISITOR TRACKING MODULE
// Tracks portfolio visitors and stores data
// ===========================================

class VisitorTracker {
  constructor() {
    this.apiEndpoint = "https://your-backend-api.com/api/visitors"; // Replace with your backend
    this.sessionId = this.getOrCreateSessionId();
    this.visitorData = null;
  }

  // Generate unique session ID
  getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem("visitor_session_id");
    if (!sessionId) {
      sessionId =
        "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem("visitor_session_id", sessionId);
    }
    return sessionId;
  }

  // Get visitor information
  async getVisitorInfo() {
    const visitorInfo = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer || "Direct",
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      platform: navigator.platform,
      cookiesEnabled: navigator.cookieEnabled,
      onlineStatus: navigator.onLine,
    };

    // Get geolocation (if permitted)
    try {
      const geoData = await this.getGeolocation();
      visitorInfo.location = geoData;
    } catch (error) {
      visitorInfo.location = await this.getIPBasedLocation();
    }

    return visitorInfo;
  }

  // Get geolocation from browser (requires user permission)
  getGeolocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation not supported");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            type: "gps",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          reject(error.message);
        },
        { timeout: 5000 }
      );
    });
  }

  // Get approximate location from IP (using free API)
  async getIPBasedLocation() {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      return {
        type: "ip",
        country: data.country_name,
        city: data.city,
        region: data.region,
        ip: data.ip,
        latitude: data.latitude,
        longitude: data.longitude,
      };
    } catch (error) {
      return {
        type: "unknown",
        error: "Unable to fetch location",
      };
    }
  }

  // Track page visit
  async trackVisit() {
    try {
      this.visitorData = await this.getVisitorInfo();

      // Send to backend using localStorage as fallback
      const success = await this.sendToBackend(this.visitorData);

      if (!success) {
        // Fallback: Store locally
        this.storeLocally(this.visitorData);
      }

      // Track page interactions
      this.trackInteractions();

      console.log("✅ Visitor tracked successfully");
      return true;
    } catch (error) {
      console.error("❌ Error tracking visitor:", error);
      return false;
    }
  }

  // Send visitor data to backend
  async sendToBackend(data) {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Backend unavailable:", error);
      return false;
    }
  }

  // Store visitor data locally (fallback)
  storeLocally(data) {
    try {
      const visitors = JSON.parse(
        localStorage.getItem("portfolio_visitors") || "[]"
      );
      visitors.push(data);

      // Keep only last 100 visitors
      if (visitors.length > 100) {
        visitors.shift();
      }

      localStorage.setItem("portfolio_visitors", JSON.stringify(visitors));
    } catch (error) {
      console.error("Error storing locally:", error);
    }
  }

  // Track user interactions
  trackInteractions() {
    const interactions = {
      clicks: 0,
      timeOnPage: 0,
      scrollDepth: 0,
      pagesViewed: [],
    };

    // Track clicks
    document.addEventListener("click", (e) => {
      interactions.clicks++;
      this.logInteraction("click", {
        element: e.target.tagName,
        classes: e.target.className,
      });
    });

    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener("scroll", () => {
      const scrollPercentage = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
          100
      );
      if (scrollPercentage > maxScroll) {
        maxScroll = scrollPercentage;
        interactions.scrollDepth = maxScroll;
      }
    });

    // Track time on page
    const startTime = Date.now();
    window.addEventListener("beforeunload", () => {
      interactions.timeOnPage = Math.round((Date.now() - startTime) / 1000);
      this.sendInteractionData(interactions);
    });

    // Track visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        interactions.timeOnPage = Math.round((Date.now() - startTime) / 1000);
        this.sendInteractionData(interactions);
      }
    });
  }

  // Log individual interactions
  logInteraction(type, data) {
    const interactionLog = {
      sessionId: this.sessionId,
      type,
      data,
      timestamp: new Date().toISOString(),
    };

    // Store in session for later sending
    const logs = JSON.parse(sessionStorage.getItem("interaction_logs") || "[]");
    logs.push(interactionLog);
    sessionStorage.setItem("interaction_logs", JSON.stringify(logs));
  }

  // Send interaction data to backend
  async sendInteractionData(data) {
    try {
      await fetch(`${this.apiEndpoint}/interactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          interactions: data,
          logs: JSON.parse(sessionStorage.getItem("interaction_logs") || "[]"),
        }),
      });
    } catch (error) {
      console.error("Error sending interaction data:", error);
    }
  }

  // Get all stored visitors (for dashboard)
  static getStoredVisitors() {
    try {
      return JSON.parse(localStorage.getItem("portfolio_visitors") || "[]");
    } catch (error) {
      return [];
    }
  }

  // Clear stored visitor data
  static clearStoredData() {
    localStorage.removeItem("portfolio_visitors");
    sessionStorage.removeItem("interaction_logs");
  }
}

// Initialize and track visitor when page loads
document.addEventListener("DOMContentLoaded", () => {
  const tracker = new VisitorTracker();
  tracker.trackVisit();
});

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = VisitorTracker;
}
