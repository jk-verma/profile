const menuToggle = document.getElementById("menuToggle");
const primaryNav = document.getElementById("primaryNav");
const newsCategoryFilter = document.getElementById("newsCategoryFilter");

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

function updateCurrentYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = year;
  });
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

function createOption(value, text) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = text;
  return option;
}

function normalizeCategory(category) {
  if (!category) return "Other";
  if (category.startsWith("Call for")) return "Calls";
  return category;
}

function populateCategoryFilter(items) {
  if (!newsCategoryFilter) return;
  const categories = Array.from(new Set(items.map((item) => normalizeCategory(item.category)))).sort();
  newsCategoryFilter.replaceChildren(
    ...[createOption("all", "All Categories"), ...categories.map((category) => createOption(category, category))]
  );
}

function applyCategoryFilter(items, container) {
  const selectedCategory = newsCategoryFilter?.value || "all";
  const filtered = items.filter((item) => selectedCategory === "all" || normalizeCategory(item.category) === selectedCategory);
  if (!filtered.length) {
    const fallback = document.createElement("article");
    fallback.className = "news-item";
    fallback.append(
      createTextElement("h3", "", "No updates match the selected category"),
      createTextElement("p", "", "Choose another category to see more news and announcements.")
    );
    container.replaceChildren(fallback);
    return;
  }

  container.replaceChildren(...filtered.map(renderNewsItem));
}

async function loadNews() {
  const container = document.getElementById("newsList");
  if (!container) return;

  try {
    const response = await fetch("data/news.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load news data");

    const items = sortNewsItems(await response.json());
    populateCategoryFilter(items);
    applyCategoryFilter(items, container);
    newsCategoryFilter?.addEventListener("change", () => applyCategoryFilter(items, container));
  } catch (error) {
    const fallback = document.createElement("article");
    fallback.className = "news-item";
    fallback.append(
      createTextElement("h3", "", "News feed unavailable"),
        createTextElement("p", "", "Please check data/news.json or add the first update there.")
      );
    container.replaceChildren(fallback);
  }
}

updateCurrentYear();
loadNews();
