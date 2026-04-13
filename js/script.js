const menuToggle = document.getElementById("menuToggle");
const primaryNav = document.getElementById("primaryNav");

function setupMenuToggle() {
  if (!menuToggle || !primaryNav) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      primaryNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupActiveSectionTracking() {
  const navLinks = Array.from(document.querySelectorAll('.primary-nav a[href^="#"]'));
  const sections = navLinks
    .map((link) => link.getAttribute("href")?.slice(1))
    .filter(Boolean)
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!navLinks.length || !sections.length) {
    return;
  }

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
    });
  };

  const getCurrentSection = () => {
    const marker = window.scrollY + 140;
    let current = sections[0]?.id || "about";

    sections.forEach((section) => {
      if (section.offsetTop <= marker) {
        current = section.id;
      }
    });

    return current;
  };

  const updateActiveSection = () => {
    const hash = window.location.hash?.slice(1);
    if (hash && sections.some((section) => section.id === hash)) {
      setActive(hash);
      return;
    }

    setActive(getCurrentSection());
  };

  window.addEventListener("scroll", updateActiveSection, { passive: true });
  window.addEventListener("resize", updateActiveSection);
  window.addEventListener("hashchange", updateActiveSection);
  updateActiveSection();
}

function setupProtectedPhotos() {
  document.querySelectorAll(".protected-photo").forEach((photo) => {
    photo.addEventListener("contextmenu", (event) => event.preventDefault());
    photo.addEventListener("dragstart", (event) => event.preventDefault());
  });

  document.querySelectorAll(".protected-photo img").forEach((image) => {
    image.addEventListener("load", () => {
      image.closest(".protected-photo")?.classList.add("photo-loaded");
    });

    image.addEventListener("error", () => {
      image.hidden = true;
    });
  });
}

function updateExperienceYears() {
  const experienceElement = document.getElementById("experienceYears");
  if (!experienceElement) return;

  const startDate = new Date(`${experienceElement.dataset.startDate}T00:00:00`);
  if (Number.isNaN(startDate.getTime())) return;

  const today = new Date();
  let years = today.getFullYear() - startDate.getFullYear();
  const anniversaryThisYear = new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate());

  if (today < anniversaryThisYear) {
    years -= 1;
  }

  experienceElement.textContent = `${Math.max(years, 0)}+ years`;
}

function updateCurrentYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = year;
  });
}

function createTextElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  element.textContent = text || "";
  return element;
}

function sortNewsItems(items) {
  return [...items].sort((left, right) => {
    const leftTime = Date.parse(left?.date || "");
    const rightTime = Date.parse(right?.date || "");

    if (!Number.isNaN(leftTime) && !Number.isNaN(rightTime) && leftTime !== rightTime) {
      return rightTime - leftTime;
    }

    if (!Number.isNaN(rightTime)) return 1;
    if (!Number.isNaN(leftTime)) return -1;
    return 0;
  });
}

function selectTickerItems(items, maxMonths = 12, maxItems = 6) {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - maxMonths);

  return items
    .filter((item) => {
      const itemTime = Date.parse(item?.date || "");
      return !Number.isNaN(itemTime) && itemTime >= cutoffDate.getTime();
    })
    .slice(0, maxItems);
}

function isPastDeadline(value) {
  if (!value) return false;
  const deadlineTime = Date.parse(`${value}T23:59:59`);
  if (Number.isNaN(deadlineTime)) return false;
  return deadlineTime < Date.now();
}

function createDeadlineBadge(deadline) {
  const expired = isPastDeadline(deadline);
  return createTextElement(
    "span",
    expired ? "news-deadline is-expired" : "news-deadline",
    `${expired ? "Submission Closed" : "Submission Deadline"}: ${deadline}`
  );
}

function renderNewsItem(item) {
  const article = document.createElement("article");
  article.className = "news-item";

  const meta = document.createElement("div");
  meta.className = "news-meta";
  meta.append(
    createTextElement("span", "news-badge", item.category),
    createTextElement("span", "news-date", item.date)
  );

  if (item.submissionDeadline) {
    meta.append(createDeadlineBadge(item.submissionDeadline));
  }

  article.append(
    meta,
    createTextElement("h3", "", item.title),
    createTextElement("p", "", item.summary)
  );

  if (item.link) {
    const link = document.createElement("a");
    link.className = "button secondary news-link";
    link.href = item.link;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Open Link";
    article.append(link);
  }

  return article;
}

function renderNewsArchiveCard() {
  const article = document.createElement("article");
  article.className = "news-item news-archive-card";

  article.append(
    createTextElement("span", "news-badge", "Archive"),
    createTextElement("h3", "", "View All Updates"),
    createTextElement("p", "", "Browse the full archive of achievements, calls, announcements, deadlines, and academic updates.")
  );

  const link = document.createElement("a");
  link.className = "button primary";
  link.href = "news.html";
  link.textContent = "View All Updates";
  article.append(link);

  return article;
}

function renderNewsTicker(items) {
  const track = document.getElementById("newsTickerTrack");
  if (!track) return;

  const tickerItems = items
    .filter((item) => item.title)
    .map((item) => ({
      category: item.category || "News",
      title: item.title,
      link: item.link || "",
      submissionDeadline: item.submissionDeadline || "",
      deadlineExpired: isPastDeadline(item.submissionDeadline)
    }));

  if (!tickerItems.length) {
    track.replaceChildren(createTextElement("span", "", "Latest updates will appear here."));
    return;
  }

  const tickerCycle = [...tickerItems, "__ticker_gap__"];
  const repeatedItems = [...tickerCycle, ...tickerCycle];
  track.replaceChildren(...repeatedItems.map((item) => {
    if (item === "__ticker_gap__") {
      const gap = createTextElement("span", "ticker-gap", "");
      gap.setAttribute("aria-hidden", "true");
      return gap;
    }

    const link = document.createElement("a");
    link.className = item.deadlineExpired ? "ticker-link deadline-expired" : "ticker-link";
    link.href = item.link || "#news";
    if (item.link) {
      link.target = "_blank";
      link.rel = "noopener";
    }
    link.append(
      createTextElement("span", "ticker-category", item.category),
      createTextElement("span", "ticker-title", item.title)
    );
    if (item.submissionDeadline) {
      if (item.deadlineExpired) {
        link.append(
          createTextElement("span", "ticker-status-badge is-closed", "Closed"),
          createTextElement("span", "ticker-deadline is-expired", item.submissionDeadline)
        );
      } else {
        link.append(createTextElement("span", "ticker-deadline", `Deadline: ${item.submissionDeadline}`));
      }
    }
    if (!item.link) {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        document.getElementById("news")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    return link;
  }));
}

async function loadNews() {
  const container = document.getElementById("newsList");
  const ticker = document.getElementById("newsTickerTrack");
  if (!container && !ticker) return;

  try {
    const response = await fetch("data/news.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load news data");

    const items = sortNewsItems(await response.json());
    renderNewsTicker(selectTickerItems(items));

    if (container) {
      container.replaceChildren(...items.slice(0, 2).map(renderNewsItem), renderNewsArchiveCard());
    }
  } catch (error) {
    if (ticker) {
      ticker.replaceChildren(createTextElement("span", "", "Latest news will appear here once data/news.json is available."));
    }

    if (container) {
      const fallback = document.createElement("article");
      fallback.className = "news-item";
      fallback.append(
        createTextElement("h3", "", "News feed unavailable"),
        createTextElement("p", "", "Please check data/news.json or add the first update there.")
      );
      container.replaceChildren(fallback);
    }
  }
}

async function loadSectionFragments() {
  const placeholders = Array.from(document.querySelectorAll("[data-section-fragment]"));
  if (!placeholders.length) return;

  await Promise.all(placeholders.map(async (placeholder) => {
    const fragmentPath = placeholder.getAttribute("data-section-fragment");
    if (!fragmentPath) return;

    try {
      const response = await fetch(fragmentPath, { cache: "no-store" });
      if (!response.ok) throw new Error(`Unable to load ${fragmentPath}`);
      const html = await response.text();
      placeholder.insertAdjacentHTML("afterend", html);
    } catch (error) {
      const fallback = document.createElement("section");
      fallback.className = "section";
      fallback.append(
        createTextElement("h2", "", "Section unavailable"),
        createTextElement("p", "", `Please check ${fragmentPath}.`)
      );
      placeholder.insertAdjacentElement("afterend", fallback);
    } finally {
      placeholder.remove();
    }
  }));
}

async function initializePage() {
  setupMenuToggle();
  await loadSectionFragments();
  setupProtectedPhotos();
  updateExperienceYears();
  updateCurrentYear();
  await loadNews();
  setupActiveSectionTracking();

  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    target?.scrollIntoView({ block: "start" });
  }
}

initializePage();
