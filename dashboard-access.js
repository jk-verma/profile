(function () {
  const DASHBOARD_PASSWORD_HASH = "10d33bb628c4184e65e78c0473060aa2365e3ebd1906af51a1534dd0143a781c";
  const ACCESS_KEY = "jkvDashboardAccess";
  const DASHBOARD_PATH = "dashboard.html";

  async function sha256(value) {
    const bytes = new TextEncoder().encode(value);
    const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hashBuffer))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  function hasAccess() {
    return sessionStorage.getItem(ACCESS_KEY) === "granted";
  }

  async function requestAccess() {
    if (hasAccess()) {
      return true;
    }

    const entered = window.prompt("Enter dashboard password");
    if (entered === null) {
      return false;
    }

    const hash = await sha256(entered.trim());
    if (hash === DASHBOARD_PASSWORD_HASH) {
      sessionStorage.setItem(ACCESS_KEY, "granted");
      return true;
    }

    window.alert("Incorrect password.");
    return false;
  }

  function getDashboardTarget(link) {
    const href = link.getAttribute("href") || DASHBOARD_PATH;
    return href;
  }

  document.addEventListener("click", async (event) => {
    const link = event.target.closest("[data-dashboard-link]");
    if (!link) {
      return;
    }

    event.preventDefault();
    const allowed = await requestAccess();
    if (allowed) {
      window.location.href = getDashboardTarget(link);
    }
  });

  if (window.location.pathname.endsWith("/dashboard.html") || window.location.pathname.endsWith("\\dashboard.html")) {
    requestAccess().then((allowed) => {
      if (!allowed) {
        window.location.href = "index.html#news";
      }
    });
  }
})();
