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

async function loadNews() {
  const container = document.getElementById("newsList");
  if (!container) return;

  try {
    const response = await fetch("news.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load news data");

    const items = sortNewsItems(await response.json());
    container.replaceChildren(...items.map(renderNewsItem));
  } catch (error) {
    const fallback = document.createElement("article");
    fallback.className = "news-item";
    fallback.append(
      createTextElement("h3", "", "News feed unavailable"),
      createTextElement("p", "", "Please check news.json or add the first update there.")
    );
    container.replaceChildren(fallback);
  }
}

loadNews();
