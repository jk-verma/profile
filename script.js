const menuToggle = document.getElementById("menuToggle");
const primaryNav = document.getElementById("primaryNav");

if (menuToggle && primaryNav) {
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
    meta.append(createTextElement("span", "news-deadline", `Submission Deadline: ${item.submissionDeadline}`));
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

function renderNewsTicker(items) {
  const track = document.getElementById("newsTickerTrack");
  if (!track) return;

  const tickerItems = items
    .filter((item) => item.title)
    .map((item) => ({
      category: item.category || "News",
      title: item.title
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
    link.className = "ticker-link";
    link.href = "#news";
    link.append(
      createTextElement("span", "ticker-category", item.category),
      createTextElement("span", "ticker-title", item.title)
    );
    link.addEventListener("click", (event) => {
      event.preventDefault();
      document.getElementById("news")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return link;
  }));
}

async function loadNews() {
  const container = document.getElementById("newsList");
  const ticker = document.getElementById("newsTickerTrack");
  if (!container && !ticker) return;

  try {
    const response = await fetch("news.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load news data");

    const items = sortNewsItems(await response.json());
    renderNewsTicker(items);

    if (container) {
      container.replaceChildren(...items.map(renderNewsItem));
    }
  } catch (error) {
    if (ticker) {
      ticker.replaceChildren(createTextElement("span", "", "Latest news will appear here once news.json is available."));
    }

    if (container) {
      const fallback = document.createElement("article");
      fallback.className = "news-item";
      fallback.append(
        createTextElement("h3", "", "News feed unavailable"),
        createTextElement("p", "", "Please check news.json or add the first update there.")
      );
      container.replaceChildren(fallback);
    }
  }
}

updateExperienceYears();
loadNews();
