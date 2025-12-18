// ===========================================
// VISITOR ANALYTICS DASHBOARD
// Display and analyze visitor data
// ===========================================

// Configuration
const DASHBOARD_PASSWORD = "admin123"; // Change this to your secure password
const API_ENDPOINT = "https://your-backend-api.com/api/visitors"; // Replace with your backend

// Global state
let visitorsData = [];
let charts = {};
let isAuthenticated = false;
let currentPage = "overview";

// ===========================================
// ROUTING & NAVIGATION
// ===========================================

function navigateTo(page, event) {
  if (event) {
    event.preventDefault();
  }

  // Update current page
  currentPage = page;

  // Hide all pages
  document.querySelectorAll(".page-content").forEach((p) => {
    p.classList.remove("active");
  });

  // Show selected page
  const selectedPage = document.getElementById(`page-${page}`);
  if (selectedPage) {
    selectedPage.classList.add("active");
  }

  // Update navigation
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });
  const activeNavItem = document.querySelector(
    `.nav-item[data-page="${page}"]`
  );
  if (activeNavItem) {
    activeNavItem.classList.add("active");
  }

  // Update page title
  updatePageTitle(page);

  // Load page-specific data
  loadPageData(page);

  // Update URL hash
  window.location.hash = page;
}

function updatePageTitle(page) {
  const titles = {
    overview: {
      icon: "chart-line",
      title: "Dashboard Overview",
      subtitle: "Real-time insights into your portfolio visitors",
    },
    visitors: {
      icon: "users",
      title: "Visitor Details",
      subtitle: "Comprehensive visitor tracking and analysis",
    },
    analytics: {
      icon: "chart-bar",
      title: "Advanced Analytics",
      subtitle: "Deep insights into visitor behavior and trends",
    },
    reports: {
      icon: "file-alt",
      title: "Reports & Exports",
      subtitle: "Generate and download detailed reports",
    },
    settings: {
      icon: "cog",
      title: "Dashboard Settings",
      subtitle: "Customize your analytics dashboard",
    },
  };

  const pageInfo = titles[page] || titles.overview;
  document.getElementById(
    "pageTitle"
  ).innerHTML = `<i class="fas fa-${pageInfo.icon}"></i> ${pageInfo.title}`;
  document.getElementById("pageSubtitle").textContent = pageInfo.subtitle;
}

function loadPageData(page) {
  switch (page) {
    case "overview":
      updateDashboard();
      break;
    case "visitors":
      loadVisitorsPage();
      break;
    case "analytics":
      loadAnalyticsPage();
      break;
    case "reports":
      loadReportsPage();
      break;
    case "settings":
      loadSettingsPage();
      break;
  }
}

function toggleNav() {
  const nav = document.querySelector(".dashboard-nav");
  nav.classList.toggle("active");
}

// Handle browser back/forward buttons
window.addEventListener("hashchange", () => {
  const hash = window.location.hash.slice(1);
  if (hash && hash !== currentPage) {
    navigateTo(hash);
  }
});

// Initialize routing on page load
window.addEventListener("load", () => {
  const hash = window.location.hash.slice(1);
  if (hash) {
    navigateTo(hash);
  }
});
// ===========================================
// AUTHENTICATION
// ===========================================

document.addEventListener("DOMContentLoaded", () => {
  checkAuthentication();
  setupAuthForm();
});

function checkAuthentication() {
  const authToken = sessionStorage.getItem("dashboard_auth");
  if (authToken === "authenticated") {
    isAuthenticated = true;
    showDashboard();
  } else {
    showAuthModal();
  }
}

function setupAuthForm() {
  const authForm = document.getElementById("authForm");
  authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = document.getElementById("dashboardPassword").value;

    if (password === DASHBOARD_PASSWORD) {
      sessionStorage.setItem("dashboard_auth", "authenticated");
      isAuthenticated = true;
      showDashboard();
    } else {
      showError("Incorrect password. Please try again.");
    }
  });
}

function showAuthModal() {
  document.getElementById("authModal").style.display = "flex";
  document.getElementById("dashboardContent").style.display = "none";
}

function showDashboard() {
  document.getElementById("authModal").style.display = "none";
  document.getElementById("dashboardContent").style.display = "block";
  loadDashboardData();
}

function showError(message) {
  const errorElement = document.getElementById("errorMessage");
  errorElement.textContent = message;
  errorElement.style.display = "block";

  setTimeout(() => {
    errorElement.style.display = "none";
  }, 3000);
}

function logout() {
  sessionStorage.removeItem("dashboard_auth");
  isAuthenticated = false;
  showAuthModal();
}

// ===========================================
// DATA LOADING
// ===========================================

async function loadDashboardData() {
  showLoading(true);

  try {
    // Try to fetch from backend first
    const backendData = await fetchFromBackend();

    if (backendData && backendData.length > 0) {
      visitorsData = backendData;
    } else {
      // Fallback to localStorage
      visitorsData = VisitorTracker.getStoredVisitors();
    }

    // Add mock data if no visitors yet (for demo purposes)
    if (visitorsData.length === 0) {
      visitorsData = generateMockData();
    }

    updateDashboard();
  } catch (error) {
    console.error("Error loading data:", error);
    // Use localStorage as fallback
    visitorsData = VisitorTracker.getStoredVisitors();

    if (visitorsData.length === 0) {
      visitorsData = generateMockData();
    }

    updateDashboard();
  } finally {
    showLoading(false);
  }
}

async function fetchFromBackend() {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Backend not available:", error);
    return null;
  }
}

function showLoading(show) {
  const spinner = document.getElementById("loadingSpinner");
  spinner.style.display = show ? "flex" : "none";
}

// ===========================================
// DASHBOARD UPDATES
// ===========================================

function updateDashboard() {
  updateStats();
  updateCharts();
  updateTables();
  updateDeviceBrowserStats();
}

function updateStats() {
  const totalVisitors = visitorsData.length;
  const totalPageViews = visitorsData.reduce(
    (sum, v) => sum + (v.interactions?.pageViews || 1),
    0
  );
  const avgTimeOnSite = calculateAvgTime();
  const uniqueCountries = getUniqueCountries().length;

  document.getElementById("totalVisitors").textContent =
    formatNumber(totalVisitors);
  document.getElementById("totalPageViews").textContent =
    formatNumber(totalPageViews);
  document.getElementById("avgTime").textContent = avgTimeOnSite;
  document.getElementById("totalCountries").textContent = uniqueCountries;

  // Calculate changes (compared to previous period)
  const changes = calculateChanges();
  updateStatChange("visitorsChange", changes.visitors);
  updateStatChange("pageviewsChange", changes.pageviews);
}

function updateStatChange(elementId, value) {
  const element = document.getElementById(elementId);
  if (value === 0) {
    element.textContent = "--";
    element.className = "stat-change";
  } else {
    const sign = value > 0 ? "+" : "";
    element.textContent = `${sign}${value}%`;
    element.className =
      value > 0 ? "stat-change positive" : "stat-change negative";
  }
}

function calculateAvgTime() {
  if (visitorsData.length === 0) return "0m 0s";

  const totalTime = visitorsData.reduce((sum, v) => {
    return sum + (v.interactions?.timeOnPage || 0);
  }, 0);

  const avgSeconds = Math.round(totalTime / visitorsData.length);
  const minutes = Math.floor(avgSeconds / 60);
  const seconds = avgSeconds % 60;

  return `${minutes}m ${seconds}s`;
}

function getUniqueCountries() {
  const countries = new Set();
  visitorsData.forEach((v) => {
    if (v.location?.country) {
      countries.add(v.location.country);
    }
  });
  return Array.from(countries);
}

function calculateChanges() {
  const today = new Date();
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);

  const thisWeek = visitorsData.filter(
    (v) => new Date(v.timestamp) >= lastWeek
  );
  const previousWeek = visitorsData.filter((v) => {
    const date = new Date(v.timestamp);
    return date >= twoWeeksAgo && date < lastWeek;
  });

  const visitorsChange = calculatePercentageChange(
    thisWeek.length,
    previousWeek.length
  );
  const pageviewsChange = calculatePercentageChange(
    thisWeek.reduce((sum, v) => sum + (v.interactions?.pageViews || 1), 0),
    previousWeek.reduce((sum, v) => sum + (v.interactions?.pageViews || 1), 0)
  );

  return { visitors: visitorsChange, pageviews: pageviewsChange };
}

function calculatePercentageChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

// ===========================================
// CHARTS
// ===========================================

function updateCharts() {
  createVisitorsChart();
  createLocationsChart();
}

function createVisitorsChart() {
  const ctx = document.getElementById("visitorsChart");
  const days = parseInt(document.getElementById("timeRange")?.value || 7);

  const chartData = prepareVisitorsChartData(days);

  if (charts.visitorsChart) {
    charts.visitorsChart.destroy();
  }

  charts.visitorsChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: "Visitors",
          data: chartData.data,
          borderColor: "#0a66c2",
          backgroundColor: "rgba(10, 102, 194, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
        },
      },
    },
  });
}

function prepareVisitorsChartData(days) {
  const labels = [];
  const data = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const dateStr = date.toISOString().split("T")[0];
    labels.push(formatDate(date));

    const count = visitorsData.filter((v) => {
      const vDate = new Date(v.timestamp).toISOString().split("T")[0];
      return vDate === dateStr;
    }).length;

    data.push(count);
  }

  return { labels, data };
}

function createLocationsChart() {
  const ctx = document.getElementById("locationsChart");
  const locationData = prepareLocationData();

  if (charts.locationsChart) {
    charts.locationsChart.destroy();
  }

  charts.locationsChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: locationData.labels,
      datasets: [
        {
          data: locationData.data,
          backgroundColor: [
            "#0a66c2",
            "#00a0dc",
            "#5e5e5e",
            "#86888a",
            "#a0a0a0",
            "#c0c0c0",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
        },
      },
    },
  });
}

function prepareLocationData() {
  const locationCounts = {};

  visitorsData.forEach((v) => {
    const country = v.location?.country || "Unknown";
    locationCounts[country] = (locationCounts[country] || 0) + 1;
  });

  const sorted = Object.entries(locationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return {
    labels: sorted.map(([country]) => country),
    data: sorted.map(([, count]) => count),
  };
}

// ===========================================
// TABLES
// ===========================================

function updateTables() {
  updateVisitorsTable();
  updateSourcesTable();
}

function updateVisitorsTable() {
  const tbody = document.getElementById("visitorsTableBody");
  tbody.innerHTML = "";

  const recentVisitors = [...visitorsData]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 50);

  recentVisitors.forEach((visitor) => {
    const row = createVisitorRow(visitor);
    tbody.appendChild(row);
  });
}

function createVisitorRow(visitor) {
  const tr = document.createElement("tr");

  const time = formatDateTime(new Date(visitor.timestamp));
  const location = `${visitor.location?.city || "Unknown"}, ${
    visitor.location?.country || "Unknown"
  }`;
  const device = getDeviceType(visitor.userAgent);
  const browser = getBrowser(visitor.userAgent);
  const referrer = formatReferrer(visitor.referrer);
  const duration = formatDuration(visitor.interactions?.timeOnPage || 0);

  tr.innerHTML = `
    <td>${time}</td>
    <td><i class="fas fa-map-marker-alt"></i> ${location}</td>
    <td><i class="fas fa-${getDeviceIcon(device)}"></i> ${device}</td>
    <td><i class="fab fa-${getBrowserIcon(browser)}"></i> ${browser}</td>
    <td>${referrer}</td>
    <td>${duration}</td>
  `;

  return tr;
}

function updateSourcesTable() {
  const tbody = document.getElementById("sourcesTableBody");
  tbody.innerHTML = "";

  const sources = calculateSources();

  sources.forEach((source) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${source.name}</strong></td>
      <td>${source.count}</td>
      <td>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${source.percentage}%"></div>
          <span>${source.percentage}%</span>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function calculateSources() {
  const sourceCounts = {};

  visitorsData.forEach((v) => {
    const source = categorizeReferrer(v.referrer);
    sourceCounts[source] = (sourceCounts[source] || 0) + 1;
  });

  const total = visitorsData.length;

  return Object.entries(sourceCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

// ===========================================
// DEVICE & BROWSER STATS
// ===========================================

function updateDeviceBrowserStats() {
  updateDeviceStats();
  updateBrowserStats();
}

function updateDeviceStats() {
  const container = document.getElementById("deviceStats");
  container.innerHTML = "";

  const deviceCounts = {};
  visitorsData.forEach((v) => {
    const device = getDeviceType(v.userAgent);
    deviceCounts[device] = (deviceCounts[device] || 0) + 1;
  });

  const total = visitorsData.length;

  Object.entries(deviceCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([device, count]) => {
      const percentage = Math.round((count / total) * 100);
      const item = createStatItem(
        device,
        count,
        percentage,
        getDeviceIcon(device)
      );
      container.appendChild(item);
    });
}

function updateBrowserStats() {
  const container = document.getElementById("browserStats");
  container.innerHTML = "";

  const browserCounts = {};
  visitorsData.forEach((v) => {
    const browser = getBrowser(v.userAgent);
    browserCounts[browser] = (browserCounts[browser] || 0) + 1;
  });

  const total = visitorsData.length;

  Object.entries(browserCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([browser, count]) => {
      const percentage = Math.round((count / total) * 100);
      const item = createStatItem(
        browser,
        count,
        percentage,
        getBrowserIcon(browser)
      );
      container.appendChild(item);
    });
}

function createStatItem(name, count, percentage, icon) {
  const div = document.createElement("div");
  div.className = "stat-item";
  div.innerHTML = `
    <div class="stat-item-header">
      <i class="fas fa-${icon}"></i>
      <span>${name}</span>
    </div>
    <div class="stat-item-bar">
      <div class="bar-fill" style="width: ${percentage}%"></div>
    </div>
    <div class="stat-item-footer">
      <span>${count} visitors</span>
      <span>${percentage}%</span>
    </div>
  `;
  return div;
}

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

function getDeviceType(userAgent) {
  if (/mobile/i.test(userAgent)) return "Mobile";
  if (/tablet|ipad/i.test(userAgent)) return "Tablet";
  return "Desktop";
}

function getDeviceIcon(device) {
  const icons = {
    Mobile: "mobile-alt",
    Tablet: "tablet-alt",
    Desktop: "desktop",
  };
  return icons[device] || "laptop";
}

function getBrowser(userAgent) {
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
    return "Safari";
  if (userAgent.includes("Edge")) return "Edge";
  if (userAgent.includes("Opera")) return "Opera";
  return "Other";
}

function getBrowserIcon(browser) {
  const icons = {
    Chrome: "chrome",
    Firefox: "firefox",
    Safari: "safari",
    Edge: "edge",
    Opera: "opera",
  };
  return icons[browser] || "globe";
}

function categorizeReferrer(referrer) {
  if (!referrer || referrer === "Direct") return "Direct";
  if (referrer.includes("google")) return "Google";
  if (referrer.includes("linkedin")) return "LinkedIn";
  if (referrer.includes("github")) return "GitHub";
  if (referrer.includes("facebook")) return "Facebook";
  if (referrer.includes("twitter") || referrer.includes("x.com"))
    return "Twitter/X";
  return "Other";
}

function formatReferrer(referrer) {
  if (!referrer || referrer === "Direct") return "<em>Direct</em>";
  try {
    const url = new URL(referrer);
    return url.hostname;
  } catch {
    return referrer.substring(0, 30) + "...";
  }
}

function formatDate(date) {
  const options = { month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

function formatDateTime(date) {
  const now = new Date();
  const diff = now - date;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDuration(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}m ${secs}s`;
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

// ===========================================
// USER ACTIONS
// ===========================================

function refreshData() {
  loadDashboardData();
}

function exportData() {
  const dataStr = JSON.stringify(visitorsData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });

  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `visitors-data-${
    new Date().toISOString().split("T")[0]
  }.json`;
  link.click();

  URL.revokeObjectURL(url);
}

function filterVisitors() {
  const searchTerm = document
    .getElementById("searchVisitors")
    .value.toLowerCase();
  const rows = document.querySelectorAll("#visitorsTableBody tr");

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm) ? "" : "none";
  });
}

// ===========================================
// MOCK DATA (for demonstration)
// ===========================================

function generateMockData() {
  const mockData = [];
  const countries = [
    "United States",
    "India",
    "United Kingdom",
    "Canada",
    "Germany",
    "France",
    "Australia",
  ];
  const cities = {
    "United States": ["New York", "San Francisco", "Los Angeles", "Seattle"],
    India: ["Mumbai", "Bangalore", "Delhi", "Hyderabad"],
    "United Kingdom": ["London", "Manchester", "Birmingham"],
    Canada: ["Toronto", "Vancouver", "Montreal"],
    Germany: ["Berlin", "Munich", "Hamburg"],
    France: ["Paris", "Lyon", "Marseille"],
    Australia: ["Sydney", "Melbourne", "Brisbane"],
  };
  const browsers = ["Chrome", "Firefox", "Safari", "Edge"];
  const devices = ["Mobile", "Desktop", "Tablet"];
  const referrers = [
    "Direct",
    "https://google.com",
    "https://linkedin.com",
    "https://github.com",
  ];

  for (let i = 0; i < 100; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - daysAgo);
    timestamp.setHours(Math.floor(Math.random() * 24));

    const country = countries[Math.floor(Math.random() * countries.length)];
    const city =
      cities[country][Math.floor(Math.random() * cities[country].length)];

    mockData.push({
      sessionId: `session_${Date.now()}_${i}`,
      timestamp: timestamp.toISOString(),
      url: "https://yourportfolio.com",
      referrer: referrers[Math.floor(Math.random() * referrers.length)],
      userAgent: `Mozilla/5.0 ${
        devices[Math.floor(Math.random() * devices.length)]
      } ${browsers[Math.floor(Math.random() * browsers.length)]}`,
      language: "en-US",
      screenResolution: "1920x1080",
      location: {
        type: "ip",
        country: country,
        city: city,
        latitude: Math.random() * 180 - 90,
        longitude: Math.random() * 360 - 180,
      },
      interactions: {
        timeOnPage: Math.floor(Math.random() * 600),
        clicks: Math.floor(Math.random() * 50),
        scrollDepth: Math.floor(Math.random() * 100),
        pageViews: Math.floor(Math.random() * 5) + 1,
      },
    });
  }

  return mockData;
}

// ===========================================
// PAGE-SPECIFIC FUNCTIONS
// ===========================================

function loadVisitorsPage() {
  // Update visitors table for visitors page
  const tbody = document.getElementById("visitorsTableBodyPage");
  if (!tbody) return;

  tbody.innerHTML = "";

  const allVisitors = [...visitorsData].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  allVisitors.forEach((visitor) => {
    const row = createVisitorRow(visitor);
    // Add action button
    const actionCell = document.createElement("td");
    actionCell.innerHTML = `
      <button class="btn-small" onclick="viewVisitorDetails('${visitor.sessionId}')">
        <i class="fas fa-eye"></i> View
      </button>
    `;
    row.appendChild(actionCell);
    tbody.appendChild(row);
  });

  // Populate country filter
  const countryFilter = document.getElementById("filterCountry");
  if (countryFilter) {
    const countries = [
      ...new Set(visitorsData.map((v) => v.location?.country).filter(Boolean)),
    ];
    countryFilter.innerHTML = '<option value="">All Countries</option>';
    countries.forEach((country) => {
      countryFilter.innerHTML += `<option value="${country}">${country}</option>`;
    });
  }
}

function applyFilters() {
  const deviceFilter = document.getElementById("filterDevice")?.value;
  const countryFilter = document.getElementById("filterCountry")?.value;
  const dateFilter = document.getElementById("filterDate")?.value;

  let filtered = [...visitorsData];

  if (deviceFilter) {
    filtered = filtered.filter(
      (v) => getDeviceType(v.userAgent) === deviceFilter
    );
  }

  if (countryFilter) {
    filtered = filtered.filter((v) => v.location?.country === countryFilter);
  }

  if (dateFilter) {
    filtered = filtered.filter((v) => {
      const vDate = new Date(v.timestamp).toISOString().split("T")[0];
      return vDate === dateFilter;
    });
  }

  // Update table with filtered data
  const tbody = document.getElementById("visitorsTableBodyPage");
  if (!tbody) return;

  tbody.innerHTML = "";
  filtered.forEach((visitor) => {
    const row = createVisitorRow(visitor);
    const actionCell = document.createElement("td");
    actionCell.innerHTML = `
      <button class="btn-small" onclick="viewVisitorDetails('${visitor.sessionId}')">
        <i class="fas fa-eye"></i> View
      </button>
    `;
    row.appendChild(actionCell);
    tbody.appendChild(row);
  });
}

function viewVisitorDetails(sessionId) {
  const visitor = visitorsData.find((v) => v.sessionId === sessionId);
  if (!visitor) return;

  alert(
    `Visitor Details:\n\nSession: ${sessionId}\nLocation: ${
      visitor.location?.city
    }, ${visitor.location?.country}\nDevice: ${getDeviceType(
      visitor.userAgent
    )}\nBrowser: ${getBrowser(visitor.userAgent)}\nTime: ${formatDateTime(
      new Date(visitor.timestamp)
    )}`
  );
}

function loadAnalyticsPage() {
  // Create advanced charts
  createPeakHoursChart();
  createWeeklyTrendsChart();
  createDeviceDistributionChart();
  createBrowserMarketChart();
  updateEngagementMetrics();
}

function createPeakHoursChart() {
  const ctx = document.getElementById("peakHoursChart");
  if (!ctx) return;

  const hours = Array(24).fill(0);
  visitorsData.forEach((v) => {
    const hour = new Date(v.timestamp).getHours();
    hours[hour]++;
  });

  if (charts.peakHoursChart) charts.peakHoursChart.destroy();

  charts.peakHoursChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: hours.map((_, i) => `${i}:00`),
      datasets: [
        {
          label: "Visitors",
          data: hours,
          backgroundColor: "rgba(10, 102, 194, 0.6)",
          borderColor: "#0a66c2",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
    },
  });
}

function createWeeklyTrendsChart() {
  const ctx = document.getElementById("weeklyTrendsChart");
  if (!ctx) return;

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayCounts = Array(7).fill(0);

  visitorsData.forEach((v) => {
    const day = new Date(v.timestamp).getDay();
    dayCounts[day]++;
  });

  if (charts.weeklyTrendsChart) charts.weeklyTrendsChart.destroy();

  charts.weeklyTrendsChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: days,
      datasets: [
        {
          label: "Visitors",
          data: dayCounts,
          borderColor: "#0a66c2",
          backgroundColor: "rgba(10, 102, 194, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
    },
  });
}

function createDeviceDistributionChart() {
  const ctx = document.getElementById("deviceDistributionChart");
  if (!ctx) return;

  const deviceCounts = {};
  visitorsData.forEach((v) => {
    const device = getDeviceType(v.userAgent);
    deviceCounts[device] = (deviceCounts[device] || 0) + 1;
  });

  if (charts.deviceDistributionChart) charts.deviceDistributionChart.destroy();

  charts.deviceDistributionChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(deviceCounts),
      datasets: [
        {
          data: Object.values(deviceCounts),
          backgroundColor: ["#0a66c2", "#00a0dc", "#5e5e5e"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

function createBrowserMarketChart() {
  const ctx = document.getElementById("browserMarketChart");
  if (!ctx) return;

  const browserCounts = {};
  visitorsData.forEach((v) => {
    const browser = getBrowser(v.userAgent);
    browserCounts[browser] = (browserCounts[browser] || 0) + 1;
  });

  if (charts.browserMarketChart) charts.browserMarketChart.destroy();

  charts.browserMarketChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: Object.keys(browserCounts),
      datasets: [
        {
          data: Object.values(browserCounts),
          backgroundColor: [
            "#0a66c2",
            "#00a0dc",
            "#5e5e5e",
            "#86888a",
            "#a0a0a0",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

function updateEngagementMetrics() {
  const totalClicks = visitorsData.reduce(
    (sum, v) => sum + (v.interactions?.clicks || 0),
    0
  );
  const avgClicks =
    visitorsData.length > 0 ? Math.round(totalClicks / visitorsData.length) : 0;

  const totalScroll = visitorsData.reduce(
    (sum, v) => sum + (v.interactions?.scrollDepth || 0),
    0
  );
  const avgScroll =
    visitorsData.length > 0 ? Math.round(totalScroll / visitorsData.length) : 0;

  const bounceCount = visitorsData.filter(
    (v) => (v.interactions?.timeOnPage || 0) < 10
  ).length;
  const bounceRate =
    visitorsData.length > 0
      ? Math.round((bounceCount / visitorsData.length) * 100)
      : 0;

  document.getElementById("avgClicks").textContent = avgClicks;
  document.getElementById("avgScroll").textContent = avgScroll + "%";
  document.getElementById("bounceRate").textContent = bounceRate + "%";
  document.getElementById("returnVisitors").textContent = "0%"; // Would need session tracking
}

function loadReportsPage() {
  // Reports page is mostly static with action buttons
  console.log("Reports page loaded");
}

function loadSettingsPage() {
  // Load current settings
  const emailNotif = localStorage.getItem("emailNotifications") === "true";
  const autoRefresh = localStorage.getItem("autoRefresh") === "true";
  const trackIP = localStorage.getItem("trackIP") !== "false";
  const trackLocation = localStorage.getItem("trackLocation") !== "false";
  const gdprMode = localStorage.getItem("gdprMode") === "true";

  document.getElementById("emailNotifications").checked = emailNotif;
  document.getElementById("autoRefresh").checked = autoRefresh;
  document.getElementById("trackIP").checked = trackIP;
  document.getElementById("trackLocation").checked = trackLocation;
  document.getElementById("gdprMode").checked = gdprMode;

  // Add event listeners to save settings
  document
    .getElementById("emailNotifications")
    ?.addEventListener("change", (e) => {
      localStorage.setItem("emailNotifications", e.target.checked);
    });
  document.getElementById("autoRefresh")?.addEventListener("change", (e) => {
    localStorage.setItem("autoRefresh", e.target.checked);
  });
  document.getElementById("trackIP")?.addEventListener("change", (e) => {
    localStorage.setItem("trackIP", e.target.checked);
  });
  document.getElementById("trackLocation")?.addEventListener("change", (e) => {
    localStorage.setItem("trackLocation", e.target.checked);
  });
  document.getElementById("gdprMode")?.addEventListener("change", (e) => {
    localStorage.setItem("gdprMode", e.target.checked);
  });
}

// Settings Actions
function changePassword() {
  const newPassword = document.getElementById("newPassword")?.value;
  if (!newPassword) {
    alert("Please enter a new password");
    return;
  }
  alert(
    "Password change functionality would be implemented with backend. For now, update the DASHBOARD_PASSWORD constant in dashboard.js"
  );
}

function clearAllData() {
  if (
    confirm(
      "Are you sure you want to clear all visitor data? This action cannot be undone."
    )
  ) {
    localStorage.removeItem("portfolio_visitors");
    sessionStorage.removeItem("interaction_logs");
    visitorsData = [];
    alert("All data has been cleared!");
    loadDashboardData();
  }
}

function changeTheme() {
  const theme = document.getElementById("themeSelect")?.value;
  alert(
    `Theme switching to ${theme} - Would be implemented with CSS variables`
  );
}

// Report Functions
function generatePDFReport() {
  alert(
    "PDF generation would require a library like jsPDF. For now, use Export JSON."
  );
}

function exportCSV() {
  const csv = convertToCSV(visitorsData);
  downloadFile(csv, "visitors-data.csv", "text/csv");
}

function convertToCSV(data) {
  if (data.length === 0) return "";

  const headers = [
    "Timestamp",
    "Location",
    "Device",
    "Browser",
    "Referrer",
    "Duration",
  ];
  const rows = data.map((v) => [
    v.timestamp,
    `${v.location?.city || ""}, ${v.location?.country || ""}`,
    getDeviceType(v.userAgent),
    getBrowser(v.userAgent),
    v.referrer || "Direct",
    v.interactions?.timeOnPage || 0,
  ]);

  return [headers, ...rows].map((row) => row.join(",")).join("\n");
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function setupEmailReports() {
  const email = prompt("Enter your email address for weekly reports:");
  if (email) {
    alert(
      `Email reports would be sent to ${email}. This requires backend integration.`
    );
  }
}
