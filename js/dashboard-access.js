(function () {
  const DEFAULT_DASHBOARD_ACCESS_CONFIG = {
    enabled: false,
    passwordHash: "a4c5a1b85cb7e9a209e697050be8a912258c5991f963c3430d3b925028b514ef"
  };
  const DASHBOARD_ACCESS_CONFIG = {
    ...DEFAULT_DASHBOARD_ACCESS_CONFIG,
    ...(window.DASHBOARD_ACCESS_CONFIG || {})
  };
  const DASHBOARD_PATH = "dashboard.html";
  const DASHBOARD_ACCESS_KEY = "jkv-dashboard-one-time-access";
  let activeDialog = null;

  async function sha256(value) {
    const bytes = new TextEncoder().encode(value);
    const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hashBuffer))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  function closeDialog() {
    if (!activeDialog) {
      return;
    }

    activeDialog.remove();
    activeDialog = null;
  }

  function grantOneTimeDashboardAccess() {
    try {
      sessionStorage.setItem(DASHBOARD_ACCESS_KEY, String(Date.now()));
    } catch (error) {
      // Ignore storage issues and fall back to direct prompting.
    }
  }

  function consumeOneTimeDashboardAccess() {
    try {
      const value = sessionStorage.getItem(DASHBOARD_ACCESS_KEY);
      if (!value) return false;
      sessionStorage.removeItem(DASHBOARD_ACCESS_KEY);
      return true;
    } catch (error) {
      return false;
    }
  }

  function isDashboardPage() {
    return window.location.pathname.endsWith("/dashboard.html") || window.location.pathname.endsWith("\\dashboard.html");
  }

  function openPasswordDialog() {
    closeDialog();

    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.className = "dashboard-access-overlay";
      overlay.innerHTML = `
        <div class="dashboard-access-dialog" role="dialog" aria-modal="true" aria-labelledby="dashboardAccessTitle">
          <p class="eyebrow">Restricted Access</p>
          <h2 id="dashboardAccessTitle">Enter dashboard password</h2>
          <p class="dashboard-access-copy">This area is available only after password verification.</p>
          <form class="dashboard-access-form">
            <label class="dashboard-access-label" for="dashboardAccessInput">Password</label>
            <input id="dashboardAccessInput" class="dashboard-access-input" name="password" type="password" autocomplete="current-password" required />
            <label class="dashboard-access-toggle"><input id="dashboardAccessToggle" type="checkbox" /> Show password</label>
            <p class="dashboard-access-error" aria-live="polite"></p>
            <div class="dashboard-access-actions">
              <button type="button" class="button secondary" data-action="cancel">Cancel</button>
              <button type="submit" class="button primary">Continue</button>
            </div>
          </form>
        </div>
      `;

      document.body.appendChild(overlay);
      activeDialog = overlay;

      const form = overlay.querySelector(".dashboard-access-form");
      const input = overlay.querySelector(".dashboard-access-input");
      const toggle = overlay.querySelector("#dashboardAccessToggle");
      const error = overlay.querySelector(".dashboard-access-error");
      const cancel = overlay.querySelector("[data-action='cancel']");

      const finish = (allowed) => {
        closeDialog();
        resolve(allowed);
      };

      cancel.addEventListener("click", () => finish(false));
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
          finish(false);
        }
      });

      toggle?.addEventListener("change", () => {
        input.type = toggle.checked ? "text" : "password";
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      });

      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        error.textContent = "";

        const hash = await sha256(input.value.trim());
        if (hash === DASHBOARD_ACCESS_CONFIG.passwordHash) {
          finish(true);
          return;
        }

        error.textContent = "Incorrect password.";
        input.value = "";
        input.type = toggle?.checked ? "text" : "password";
        input.focus();
      });

      input.focus();
    });
  }

  async function requestAccess() {
    return openPasswordDialog();
  }

  function getDashboardTarget(link) {
    return link.getAttribute("href") || DASHBOARD_PATH;
  }

  document.addEventListener("click", async (event) => {
    const link = event.target.closest("[data-dashboard-link]");
    if (!link || !DASHBOARD_ACCESS_CONFIG.enabled) {
      return;
    }

    event.preventDefault();
    const allowed = await requestAccess();
    if (allowed) {
      grantOneTimeDashboardAccess();
      window.location.href = getDashboardTarget(link);
    }
  });

  if (isDashboardPage()) {
    if (!DASHBOARD_ACCESS_CONFIG.enabled) {
      return;
    }

    if (!consumeOneTimeDashboardAccess()) {
      requestAccess().then((allowed) => {
        if (!allowed) {
          window.location.href = "index.html#news";
        }
      });
    }
  }
})();
