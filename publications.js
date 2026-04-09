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

const menuToggle = document.getElementById("menuToggle");
const primaryNav = document.getElementById("primaryNav");
const publicationTypeFilter = document.getElementById("publicationTypeFilter");
const publicationYearFilter = document.getElementById("publicationYearFilter");

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

function compactParts(parts, separator = ", ") {
  return parts.filter(Boolean).join(separator);
}

function wrapTitle(title) {
  return title ? `"${title}"` : "";
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
      createTextElement("h3", "", "No publications match the current filters"),
      createTextElement("p", "", "Try a different year or type to broaden the results.")
    );
    container.replaceChildren(empty);
    return;
  }

  container.replaceChildren(...sections);
}

function createOption(value, text) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = text;
  return option;
}

function populateFilters(publications) {
  if (publicationTypeFilter) {
    const availableTypes = Array.from(new Set(publications.map((publication) => publication.type).filter(Boolean)));
    publicationTypeFilter.replaceChildren(
      ...[createOption("all", "All Types"), ...availableTypes.map((type) => createOption(type, typeLabels[type] || type))]
    );
  }

  if (publicationYearFilter) {
    const availableYears = Array.from(new Set(publications.map((publication) => publication.year).filter(Boolean)))
      .sort((left, right) => Number(right) - Number(left));
    publicationYearFilter.replaceChildren(
      ...[createOption("all", "All Years"), ...availableYears.map((year) => createOption(year, year))]
    );
  }
}

function applyFilters(publications, container) {
  const selectedType = publicationTypeFilter?.value || "all";
  const selectedYear = publicationYearFilter?.value || "all";
  const filtered = publications.filter((publication) => {
    const matchesType = selectedType === "all" || publication.type === selectedType;
    const matchesYear = selectedYear === "all" || String(publication.year || "") === selectedYear;
    return matchesType && matchesYear;
  });

  renderPublications(filtered, container);
}

async function loadPublications() {
  const container = document.getElementById("publicationsList");
  if (!container) return;

  try {
    const response = await fetch("publications.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load publications.json");
    const publications = await response.json();
    populateFilters(publications);
    applyFilters(publications, container);
    [publicationTypeFilter, publicationYearFilter].forEach((filter) => {
      filter?.addEventListener("change", () => applyFilters(publications, container));
    });
  } catch (error) {
    const fallback = document.createElement("article");
    fallback.className = "panel";
    fallback.append(
      createTextElement("h3", "", "Publications unavailable"),
      createTextElement("p", "", "Please check publications.json and try again.")
    );
    container.replaceChildren(fallback);
  }
}

loadPublications();
