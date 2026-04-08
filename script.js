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

function createTextElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  element.textContent = text || "";
  return element;
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

  article.append(
    meta,
    createTextElement("h3", "", item.title),
    createTextElement("p", "", item.summary)
  );

  return article;
}

async function loadNews() {
  const container = document.getElementById("newsList");
  if (!container) return;

  try {
    const response = await fetch("news.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load news data");

    const items = await response.json();
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
