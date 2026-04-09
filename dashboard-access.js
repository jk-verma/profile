(function () {
  const DASHBOARD_PASSWORD_HASH = "a4c5a1b85cb7e9a209e697050be8a912258c5991f963c3430d3b925028b514ef";
  const ACCESS_KEY = "jkvDashboardAccess";
  const DASHBOARD_PATH = "dashboard.html";
  let activeDialog = null;

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

  function closeDialog() {
    if (!activeDialog) {
      return;
    }

    activeDialog.remove();
    activeDialog = null;
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

      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        error.textContent = "";

        const hash = await sha256(input.value.trim());
        if (hash === DASHBOARD_PASSWORD_HASH) {
          sessionStorage.setItem(ACCESS_KEY, "granted");
          finish(true);
          return;
        }

        error.textContent = "Incorrect password.";
        input.value = "";
        input.focus();
      });

      input.focus();
    });
  }

  async function requestAccess() {
    if (hasAccess()) {
      return true;
    }

    return openPasswordDialog();
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
