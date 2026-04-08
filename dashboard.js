const newsForm = document.getElementById("newsForm");
const newsDate = document.getElementById("newsDate");
const newsCategory = document.getElementById("newsCategory");
const newsTitle = document.getElementById("newsTitle");
const newsDeadline = document.getElementById("newsDeadline");
const newsLink = document.getElementById("newsLink");
const newsSummary = document.getElementById("newsSummary");
const jsonOutput = document.getElementById("jsonOutput");
const newsList = document.getElementById("dashboardNewsList");
const statusMessage = document.getElementById("dashboardStatus");
const copyJson = document.getElementById("copyJson");
const downloadJson = document.getElementById("downloadJson");
const clearDraft = document.getElementById("clearDraft");
const publicationForm = document.getElementById("publicationForm");
const publicationType = document.getElementById("publicationType");
const publicationYear = document.getElementById("publicationYear");
const publicationAuthors = document.getElementById("publicationAuthors");
const publicationTitle = document.getElementById("publicationTitle");
const publicationVenue = document.getElementById("publicationVenue");
const publicationPublisher = document.getElementById("publicationPublisher");
const publicationVolume = document.getElementById("publicationVolume");
const publicationIssue = document.getElementById("publicationIssue");
const publicationPages = document.getElementById("publicationPages");
const publicationDoi = document.getElementById("publicationDoi");
const publicationIndexing = document.getElementById("publicationIndexing");
const publicationPatentNumber = document.getElementById("publicationPatentNumber");
const publicationCountry = document.getElementById("publicationCountry");
const publicationStatus = document.getElementById("publicationStatus");
const publicationsJsonOutput = document.getElementById("publicationsJsonOutput");
const publicationsList = document.getElementById("dashboardPublicationsList");
const publicationStatusMessage = document.getElementById("publicationDashboardStatus");
const copyPublicationsJson = document.getElementById("copyPublicationsJson");
const downloadPublicationsJson = document.getElementById("downloadPublicationsJson");
const clearPublicationDraft = document.getElementById("clearPublicationDraft");
const menuToggle = document.getElementById("menuToggle");
const primaryNav = document.getElementById("primaryNav");

let newsItems = [];
let publicationItems = [];

const publicationTypes = [
  "Journal Article",
  "Conference Paper",
  "Book Chapter",
  "Book / Edited Volume",
  "Patent",
  "Forthcoming / Accepted"
];

const typeLabels = {
  "Journal Article": "Journal Articles",
  "Conference Paper": "Conference Papers",
  "Book Chapter": "Book Chapters",
  "Book / Edited Volume": "Books / Edited Volumes",
  "Patent": "Patents",
  "Forthcoming / Accepted": "Forthcoming / Accepted Publications"
};

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function today() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 10);
}

function setStatus(message) {
  if (statusMessage) {
    statusMessage.textContent = message;
  }
}

function setPublicationStatus(message) {
  if (publicationStatusMessage) {
    publicationStatusMessage.textContent = message;
  }
}

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

function compactParts(parts, separator = ", ") {
  return parts.filter(Boolean).join(separator);
}

function wrapTitle(title) {
  return title ? `"${title}"` : "";
}

function parseIndexing(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatIndexing(indexing) {
  if (!Array.isArray(indexing) || !indexing.length) return "";
  return `[${indexing.join(", ")}]`;
}

function formatDoi(publication) {
  const doi = publication.doi || publication.link || "";
  if (!doi) return "";
  return doi.startsWith("http") ? doi : `doi: ${doi}`;
}

function formatPublication(publication) {
  const authors = publication.authors || "";
  const title = wrapTitle(publication.title);
  const year = publication.year || publication.date || "";
  const type = publication.type || "";
  const venue = publication.venue || "";
  const publisher = publication.publisher || "";
  const volume = publication.volume ? `vol. ${publication.volume}` : "";
  const issue = publication.issue ? `no. ${publication.issue}` : "";
  const pages = publication.pages ? `pp. ${publication.pages}` : "";
  const indexing = formatIndexing(publication.indexing);
  const doi = formatDoi(publication);

  if (type === "Patent") {
    const country = publication.country ? `${publication.country} Patent` : "Patent";
    const number = publication.patentNumber || publication.number || "";
    const status = publication.status || "";
    return compactParts([authors, title, compactParts([country, number], " "), status, year, doi, indexing]);
  }

  if (type === "Conference Paper") {
    const conference = venue ? `in ${venue}` : "";
    return compactParts([authors, title, conference, publisher, year, pages, doi, indexing]);
  }

  if (type === "Book Chapter") {
    const book = venue ? `in ${venue}` : "";
    return compactParts([authors, title, book, publisher, year, pages, doi, indexing]);
  }

  if (type === "Book / Edited Volume") {
    return compactParts([authors, publication.title, publisher || venue, year, doi, indexing]);
  }

  return compactParts([authors, title, venue, volume, issue, pages, year, doi, indexing]);
}

function groupPublications(publications) {
  const groups = new Map();
  publicationTypes.forEach((type) => groups.set(type, []));

  publications.forEach((publication) => {
    const type = publication.type || "Forthcoming / Accepted";
    if (!groups.has(type)) groups.set(type, []);
    groups.get(type).push(publication);
  });

  return groups;
}

function renderPublicationGroup(type, publications) {
  const section = document.createElement("section");
  section.className = "publication-group";

  const heading = createTextElement("h3", "", typeLabels[type] || type);
  const list = document.createElement("ol");
  list.className = "publication-items";

  publications.forEach((publication, index) => {
    const number = publications.length - index;
    const item = document.createElement("li");
    item.append(
      createTextElement("span", "publication-number", `[${number}]`),
      createTextElement("span", "publication-reference", formatPublication(publication))
    );
    list.append(item);
  });

  section.append(heading, list);
  return section;
}

function renderPublications(publications, container) {
  if (!container) return;

  const groups = groupPublications(publications);
  const sections = [];

  groups.forEach((items, type) => {
    if (items.length) {
      sections.push(renderPublicationGroup(type, items));
    }
  });

  if (!sections.length) {
    const empty = document.createElement("article");
    empty.className = "panel";
    empty.append(
      createTextElement("h3", "", "Publication list coming soon"),
      createTextElement("p", "", "Add entries here and publish the generated publications.json file.")
    );
    container.replaceChildren(empty);
    return;
  }

  container.replaceChildren(...sections);
}

function syncOutput() {
  const json = JSON.stringify(newsItems, null, 2);
  jsonOutput.value = json;
  newsList.replaceChildren(...newsItems.map(renderNewsItem));
}

function syncPublicationsOutput() {
  if (!publicationsJsonOutput) return;

  publicationsJsonOutput.value = JSON.stringify(publicationItems, null, 2);
  renderPublications(publicationItems, publicationsList);
}

async function loadNews() {
  newsDate.value = today();

  try {
    const response = await fetch("news.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load news.json");
    newsItems = await response.json();
    setStatus("Loaded existing news.json. Add a new update when ready.");
  } catch (error) {
    newsItems = [];
    setStatus("Could not load news.json. You can still create a new list here.");
  }

  syncOutput();
}

async function loadPublications() {
  if (publicationYear) {
    publicationYear.value = new Date().getFullYear();
  }

  try {
    const response = await fetch("publications.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load publications.json");
    publicationItems = await response.json();
    setPublicationStatus("Loaded existing publications.json. Add a new entry when ready.");
  } catch (error) {
    publicationItems = [];
    setPublicationStatus("Could not load publications.json. You can still create a new list here.");
  }

  syncPublicationsOutput();
}

newsForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const item = {
    date: newsDate.value,
    category: newsCategory.value.trim(),
    title: newsTitle.value.trim(),
    submissionDeadline: newsDeadline.value,
    link: newsLink.value.trim(),
    summary: newsSummary.value.trim()
  };

  if (!item.submissionDeadline) {
    delete item.submissionDeadline;
  }

  if (!item.link) {
    delete item.link;
  }

  newsItems = [item, ...newsItems];
  newsTitle.value = "";
  newsDeadline.value = "";
  newsLink.value = "";
  newsSummary.value = "";
  newsDate.value = today();
  syncOutput();
  setStatus("Update added to preview. Copy or download news.json to publish it.");
});

publicationForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const item = {
    type: publicationType.value,
    year: publicationYear.value.trim(),
    authors: publicationAuthors.value.trim(),
    title: publicationTitle.value.trim(),
    venue: publicationVenue.value.trim(),
    publisher: publicationPublisher.value.trim(),
    volume: publicationVolume.value.trim(),
    issue: publicationIssue.value.trim(),
    pages: publicationPages.value.trim(),
    doi: publicationDoi.value.trim(),
    indexing: parseIndexing(publicationIndexing.value),
    patentNumber: publicationPatentNumber.value.trim(),
    country: publicationCountry.value.trim(),
    status: publicationStatus.value.trim()
  };

  Object.keys(item).forEach((key) => {
    if (item[key] === "" || (Array.isArray(item[key]) && !item[key].length)) {
      delete item[key];
    }
  });

  const firstSameType = publicationItems.findIndex((publication) => publication.type === item.type);
  if (firstSameType === -1) {
    publicationItems = [item, ...publicationItems];
  } else {
    publicationItems = [
      ...publicationItems.slice(0, firstSameType),
      item,
      ...publicationItems.slice(firstSameType)
    ];
  }

  publicationTitle.value = "";
  publicationVenue.value = "";
  publicationPublisher.value = "";
  publicationVolume.value = "";
  publicationIssue.value = "";
  publicationPages.value = "";
  publicationDoi.value = "";
  publicationIndexing.value = "";
  publicationPatentNumber.value = "";
  publicationCountry.value = "";
  publicationStatus.value = "";
  publicationYear.value = new Date().getFullYear();

  syncPublicationsOutput();
  setPublicationStatus("Publication added at the top of its type. Copy or download publications.json to publish it.");
});

clearDraft?.addEventListener("click", () => {
  newsTitle.value = "";
  newsDeadline.value = "";
  newsLink.value = "";
  newsSummary.value = "";
  newsCategory.value = "Achievement";
  newsDate.value = today();
  setStatus("Draft cleared.");
});

clearPublicationDraft?.addEventListener("click", () => {
  publicationType.value = "Journal Article";
  publicationYear.value = new Date().getFullYear();
  publicationAuthors.value = "";
  publicationTitle.value = "";
  publicationVenue.value = "";
  publicationPublisher.value = "";
  publicationVolume.value = "";
  publicationIssue.value = "";
  publicationPages.value = "";
  publicationDoi.value = "";
  publicationIndexing.value = "";
  publicationPatentNumber.value = "";
  publicationCountry.value = "";
  publicationStatus.value = "";
  setPublicationStatus("Publication draft cleared.");
});

copyJson?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(jsonOutput.value);
    setStatus("Copied JSON. Paste it into news.json in the GitHub editor.");
  } catch (error) {
    jsonOutput.focus();
    jsonOutput.select();
    setStatus("Select and copy the JSON manually from the box.");
  }
});

copyPublicationsJson?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(publicationsJsonOutput.value);
    setPublicationStatus("Copied JSON. Paste it into publications.json in the GitHub editor.");
  } catch (error) {
    publicationsJsonOutput.focus();
    publicationsJsonOutput.select();
    setPublicationStatus("Select and copy the JSON manually from the box.");
  }
});

downloadJson?.addEventListener("click", () => {
  const blob = new Blob([jsonOutput.value], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "news.json";
  link.click();
  URL.revokeObjectURL(url);
  setStatus("Downloaded news.json. Upload or paste it into GitHub to publish.");
});

downloadPublicationsJson?.addEventListener("click", () => {
  const blob = new Blob([publicationsJsonOutput.value], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "publications.json";
  link.click();
  URL.revokeObjectURL(url);
  setPublicationStatus("Downloaded publications.json. Upload or paste it into GitHub to publish.");
});

loadNews();
loadPublications();
