const newsForm = document.getElementById("newsForm");
const newsDate = document.getElementById("newsDate");
const newsCategory = document.getElementById("newsCategory");
const newsTitle = document.getElementById("newsTitle");
const newsDeadline = document.getElementById("newsDeadline");
const newsLink = document.getElementById("newsLink");
const newsSummary = document.getElementById("newsSummary");
const jsonOutput = document.getElementById("jsonOutput");
const newsPreview = document.getElementById("newsPreview");
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
const publicationsPreview = document.getElementById("publicationsPreview");
const publicationStatusMessage = document.getElementById("publicationDashboardStatus");
const copyPublicationsJson = document.getElementById("copyPublicationsJson");
const downloadPublicationsJson = document.getElementById("downloadPublicationsJson");
const clearPublicationDraft = document.getElementById("clearPublicationDraft");
const previewToggles = Array.from(document.querySelectorAll(".preview-toggle"));

const websiteProjectForm = document.getElementById("websiteProjectForm");
const projectTitle = document.getElementById("projectTitle");
const websiteProjectSummary = document.getElementById("websiteProjectSummary");
const websiteProjectLink = document.getElementById("websiteProjectLink");
const clearWebsiteProjectDraft = document.getElementById("clearWebsiteProjectDraft");

const fundedProjectForm = document.getElementById("fundedProjectForm");
const fundedProjectType = document.getElementById("fundedProjectType");
const fundedProjectAgency = document.getElementById("fundedProjectAgency");
const fundedProjectScheme = document.getElementById("fundedProjectScheme");
const fundedProjectRole = document.getElementById("fundedProjectRole");
const fundedProjectTitle = document.getElementById("fundedProjectTitle");
const fundedProjectGrantNumber = document.getElementById("fundedProjectGrantNumber");
const fundedProjectYears = document.getElementById("fundedProjectYears");
const fundedProjectDuration = document.getElementById("fundedProjectDuration");
const fundedProjectAmount = document.getElementById("fundedProjectAmount");
const fundedProjectStatus = document.getElementById("fundedProjectStatus");
const clearFundedProjectDraft = document.getElementById("clearFundedProjectDraft");
const dashboardProjectModesBody = document.getElementById("dashboardProjectModesBody");
const websiteProjectsPreview = document.getElementById("websiteProjectsPreview");
const fundedProjectsPreview = document.getElementById("fundedProjectsPreview");
const projectEntryMode = document.getElementById("projectEntryMode");

const projectsJsonOutputs = Array.from(document.querySelectorAll(".projects-json-output"));
const projectStatusMessages = Array.from(document.querySelectorAll(".project-dashboard-status"));
const copyProjectsJsonButtons = Array.from(document.querySelectorAll(".copy-projects-json"));
const downloadProjectsJsonButtons = Array.from(document.querySelectorAll(".download-projects-json"));
const fundedProjectReferencesOutput = document.getElementById("fundedProjectReferencesOutput");
const copyFundedProjectReferences = document.getElementById("copyFundedProjectReferences");

const siteContentForm = document.getElementById("siteContentForm");
const siteContentSection = document.getElementById("siteContentSection");
const siteContentKey = document.getElementById("siteContentKey");
const siteContentHeading = document.getElementById("siteContentHeading");
const siteContentBody = document.getElementById("siteContentBody");
const siteContentLinkLabel = document.getElementById("siteContentLinkLabel");
const siteContentLinkUrl = document.getElementById("siteContentLinkUrl");
const siteContentOrder = document.getElementById("siteContentOrder");
const clearSiteContentDraft = document.getElementById("clearSiteContentDraft");
const siteContentJsonOutput = document.getElementById("siteContentJsonOutput");
const siteContentPreview = document.getElementById("siteContentPreview");
const siteContentStatusMessage = document.getElementById("siteContentDashboardStatus");
const copySiteContentJson = document.getElementById("copySiteContentJson");
const downloadSiteContentJson = document.getElementById("downloadSiteContentJson");

const menuToggle = document.getElementById("menuToggle");
const primaryNav = document.getElementById("primaryNav");

let newsItems = [];
let publicationItems = [];
let projectItems = [];
let siteContentItems = [];
let activeToastTimeout = null;

const publicationTypes = [
  "Journal Article",
  "Conference Paper",
  "Book Chapter",
  "Book / Edited Volume",
  "Patent",
  "Forthcoming / Accepted"
];

const publicationTypeLabels = {
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

previewToggles.forEach((button) => {
  const targetId = button.getAttribute("aria-controls");
  if (!targetId) return;
  const target = document.getElementById(targetId);
  if (!target) return;

  button.addEventListener("click", () => {
    const isHidden = target.hasAttribute("hidden");
    if (isHidden) {
      target.removeAttribute("hidden");
      button.textContent = "Hide Preview";
      button.setAttribute("aria-expanded", "true");
    } else {
      target.setAttribute("hidden", "");
      button.textContent = "Show Preview";
      button.setAttribute("aria-expanded", "false");
    }
  });
});

function today() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 10);
}

function setStatus(message) {
  if (statusMessage) statusMessage.textContent = message;
}

function setPublicationStatus(message) {
  if (publicationStatusMessage) publicationStatusMessage.textContent = message;
}

function setProjectStatus(message) {
  projectStatusMessages.forEach((element) => {
    element.textContent = message;
  });
}

function setSiteContentStatus(message) {
  if (siteContentStatusMessage) siteContentStatusMessage.textContent = message;
}

function showToast(message) {
  let toast = document.getElementById("dashboardToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "dashboardToast";
    toast.className = "dashboard-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.append(toast);
  }

  toast.textContent = message;
  toast.classList.add("visible");

  if (activeToastTimeout) {
    window.clearTimeout(activeToastTimeout);
  }

  activeToastTimeout = window.setTimeout(() => {
    toast.classList.remove("visible");
  }, 2200);
}

function createDashboardSectionToggle(title, getSections, options = {}) {
  const wrapper = document.createElement("section");
  wrapper.className = "section dashboard-section-toggle";
  wrapper.dataset.dashboardToggleFor = options.key || title.toLowerCase().replace(/\s+/g, "-");

  const button = document.createElement("button");
  button.type = "button";
  button.className = "dashboard-section-toggle-button";
  button.setAttribute("aria-expanded", "false");

  const labelWrap = document.createElement("span");
  labelWrap.className = "dashboard-section-toggle-label";
  labelWrap.append(
    createTextElement("span", "eyebrow", `${title} Section`),
    createTextElement("strong", "", options.summary || "Create Entry, Publish, and Preview")
  );

  const hint = createTextElement("span", "dashboard-section-toggle-hint", "Expand");
  button.append(labelWrap, hint);
  wrapper.append(button);

  const getControlledSections = () => getSections().filter(Boolean);
  const setSectionVisibility = (expanded) => {
    getControlledSections().forEach(({ section, preview }) => {
      section.hidden = !expanded;
      if (preview) {
        preview.hidden = !expanded;
        const previewButton = document.querySelector(`[aria-controls="${preview.id}"]`);
        if (previewButton) {
          previewButton.textContent = expanded ? "Hide Preview" : "Show Preview";
          previewButton.setAttribute("aria-expanded", String(expanded));
        }
      }
    });
  };

  const collapseOtherSections = () => {
    document.querySelectorAll(".dashboard-section-toggle-button").forEach((otherButton) => {
      if (otherButton === button || otherButton.getAttribute("aria-expanded") !== "true") return;
      otherButton.click();
    });
  };

  getControlledSections().forEach(({ section, preview }) => {
    if (section) {
      section.hidden = true;
    }
    if (preview) {
      preview.hidden = true;
    }
  });

  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    if (!expanded) {
      collapseOtherSections();
    }
    button.setAttribute("aria-expanded", String(!expanded));
    hint.textContent = expanded ? "Expand" : "Collapse";
    setSectionVisibility(!expanded);
    if (!expanded && typeof options.onExpand === "function") {
      options.onExpand();
    }
  });

  return wrapper;
}

function moveDashboardSection(key, parentNode) {
  const nodes = Array.from(document.querySelectorAll(`[data-dashboard-section-key="${key}"]`));
  const toggle = document.querySelector(`[data-dashboard-toggle-for="${key}"]`);
  const orderedNodes = [toggle, ...nodes].filter(Boolean);

  orderedNodes.forEach((node) => {
    parentNode.appendChild(node);
  });
}

function orderDashboardSections() {
  const main = document.getElementById("main");
  if (!main) return;

  ["research", "projects", "news", "site-content"].forEach((key) => {
    moveDashboardSection(key, main);
  });
}

function syncProjectEntryMode() {
  const activeMode = projectEntryMode?.value || "website";
  const projectExpanded = document
    .querySelector('[data-dashboard-toggle-for="projects"] .dashboard-section-toggle-button')
    ?.getAttribute("aria-expanded") === "true";

  document.querySelectorAll("[data-project-workflow]").forEach((section) => {
    const matches = section.dataset.projectWorkflow === activeMode;
    section.hidden = !projectExpanded || !matches;
  });
}

function setupDashboardCollapsibles() {
  const sections = [
    {
      title: "Research",
      key: "research",
      getSections: () => {
        const selector = document.getElementById("publicationType")?.closest(".dashboard-publication-selector");
        const section = document.getElementById("publicationForm")?.closest(".dashboard-layout");
        const preview = document.getElementById("publicationsPreview")?.closest(".dashboard-preview-section");
        const previewInner = document.getElementById("publicationsPreview");
        return [
          selector ? { section: selector } : null,
          section ? { section } : null,
          preview ? { section: preview, preview: previewInner } : null
        ];
      }
    },
    {
      title: "Projects",
      key: "projects",
      onExpand: syncProjectEntryMode,
      getSections: () => {
        const selector = document.getElementById("projectEntryMode")?.closest(".dashboard-project-selector");
        const mode = projectEntryMode?.value || "website";
        const activeLayout = document.querySelector(`.dashboard-layout[data-project-workflow="${mode}"]`);
        const activePreview = document.querySelector(`.dashboard-preview-section[data-project-workflow="${mode}"]`);
        const previewInner = activePreview?.querySelector(".dashboard-preview");
        const modes = document.getElementById("projectModesReference");
        return [
          selector ? { section: selector } : null,
          activeLayout ? { section: activeLayout } : null,
          activePreview ? { section: activePreview, preview: previewInner } : null,
          modes ? { section: modes } : null
        ];
      }
    },
    {
      title: "Latest News",
      key: "news",
      formId: "newsForm",
      previewId: "newsPreview"
    },
    {
      title: "Voluntary Project",
      key: "site-content",
      formId: "siteContentForm",
      previewId: "siteContentPreview",
      summary: "Websites, Code, Programs, and PDF Knowledge Outputs"
    }
  ];

  sections.forEach(({ title, key, formId, previewId, getSections, onExpand, summary }) => {
    const anchor = getSections
      ? getSections().find(Boolean)?.section
      : document.getElementById(formId)?.closest(".dashboard-layout");

    if (!anchor || anchor.previousElementSibling?.classList.contains("dashboard-section-toggle")) {
      return;
    }

    anchor.before(createDashboardSectionToggle(title, () => {
      if (getSections) return getSections();
      const section = document.getElementById(formId)?.closest(".dashboard-layout");
      const preview = previewId ? document.getElementById(previewId)?.closest(".dashboard-preview-section") : null;
      const previewInner = previewId ? document.getElementById(previewId) : null;
      return [
        section ? { section } : null,
        preview ? { section: preview, preview: previewInner } : null
      ];
    }, { key, onExpand, summary }));
  });

  orderDashboardSections();
  syncProjectEntryMode();
}

function parseIndexing(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
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

function renderNewsPreview(items, container) {
  if (!container) return;

  if (!items.length) {
    const empty = document.createElement("article");
    empty.className = "news-item";
    empty.append(
      createTextElement("h3", "", "Latest updates will appear here"),
      createTextElement("p", "", "Add a news entry to preview how it will appear on the website.")
    );
    container.replaceChildren(empty);
    return;
  }

  container.replaceChildren(...items.map(renderNewsItem));
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

function renderPublicationGroup(type, publications) {
  const section = document.createElement("section");
  section.className = "publication-group";

  const heading = createTextElement("h3", "", publicationTypeLabels[type] || type);
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

function renderPublicationsPreview(publications, container) {
  if (!container) return;
  const groups = new Map();
  publicationTypes.forEach((type) => groups.set(type, []));

  publications.forEach((publication) => {
    const type = publication.type || "Forthcoming / Accepted";
    if (!groups.has(type)) groups.set(type, []);
    groups.get(type).push(publication);
  });

  const sections = [];
  groups.forEach((items, type) => {
    if (items.length) sections.push(renderPublicationGroup(type, items));
  });

  if (!sections.length) {
    const empty = document.createElement("article");
    empty.className = "panel";
    empty.append(
      createTextElement("h3", "", "Publication list coming soon"),
      createTextElement("p", "", "Add entries to see the publication preview here.")
    );
    container.replaceChildren(empty);
    return;
  }

  container.replaceChildren(...sections);
}

function getProjectSectionName(project) {
  return project.projectType || (project.entryType === "fundedProject" ? "Funded Projects" : "Website and Utility Projects");
}

function renderProjectCard(project) {
  const article = document.createElement("article");
  article.className = "card";

  const metaBits = [
    project.projectType,
    project.fundingAgency,
    project.schemeName || project.schemeProgram,
    project.yearOfFunding,
    project.status
  ].filter(Boolean);

  article.append(createTextElement("h3", "", project.title));

  if (metaBits.length) {
    article.append(createTextElement("p", "project-meta", metaBits.join(" | ")));
  }

  if (project.summary) {
    article.append(createTextElement("p", "", project.summary));
  }

  const detailBits = [];
  if (project.duration) detailBits.push(`Duration: ${project.duration}`);
  if (project.amountSanctioned) detailBits.push(`Amount: ${project.amountSanctioned}`);

  if (detailBits.length) {
    article.append(createTextElement("p", "project-detail", detailBits.join(" | ")));
  }

  if (project.siteUrl) {
    const siteLink = document.createElement("a");
    siteLink.className = "button secondary project-link";
    siteLink.href = project.siteUrl;
    siteLink.target = "_blank";
    siteLink.rel = "noopener";
    siteLink.textContent = "Open Project";
    article.append(siteLink);
  }

  return article;
}

function formatFundedProjectReference(project, index, total) {
  const number = total - index;
  const role = project.role ? ` (${project.role})` : "";
  const valueLabel = project.projectType === "Consultancy Project" ? "Project Value" : "Amount";
  const parts = [
    `J. K. Verma${role}`,
    project.title ? `"${project.title}"` : "",
    project.projectType,
    project.fundingAgency,
    project.schemeName ? `Scheme: ${project.schemeName}` : "",
    project.grantNumber ? `Grant No. ${project.grantNumber}` : "",
    project.duration ? `Duration: ${project.duration}` : "",
    project.yearOfFunding ? `Year: ${project.yearOfFunding}` : "",
    project.amountSanctioned ? `${valueLabel}: ${project.amountSanctioned}` : "",
    project.status ? `Status: ${project.status}` : ""
  ].filter(Boolean);

  return `[${number}] ${parts.join(", ")}.`;
}

function renderFundedProjectReference(project, index, projects) {
  const item = document.createElement("li");
  item.append(
    createTextElement("span", "publication-number", `[${projects.length - index}]`),
    createTextElement("span", "publication-reference", formatFundedProjectReference(project, index, projects.length).replace(/^\[\d+\]\s*/, ""))
  );
  return item;
}

function renderProjectSection(title, projects) {
  const section = document.createElement("section");
  section.className = "publication-group";

  const heading = createTextElement("h3", "", title);
  const allFundedProjects = projects.every((project) => project.entryType === "fundedProject");

  if (allFundedProjects) {
    const list = document.createElement("ol");
    list.className = "publication-items project-reference-list";
    list.append(...projects.map(renderFundedProjectReference));
    section.append(heading, list);
    return section;
  }

  const grid = document.createElement("div");
  grid.className = "card-grid three project-grid";
  grid.append(...projects.map(renderProjectCard));

  section.append(heading, grid);
  return section;
}

function fundedProjectReferencesText(projects) {
  return projects
    .filter((project) => project.entryType === "fundedProject")
    .map((project, index, list) => formatFundedProjectReference(project, index, list.length))
    .join("\n");
}

function renderProjectsPreview(projects, container) {
  if (!container) return;

  if (!projects.length) {
    const empty = document.createElement("article");
    empty.className = "panel";
    empty.append(
      createTextElement("h3", "", "Projects will appear here"),
      createTextElement("p", "", "Add entries to see the project preview here.")
    );
    container.replaceChildren(empty);
    return;
  }

  const groupedProjects = new Map();
  projects.forEach((project) => {
    const sectionName = getProjectSectionName(project);
    if (!groupedProjects.has(sectionName)) {
      groupedProjects.set(sectionName, []);
    }
    groupedProjects.get(sectionName).push(project);
  });

  container.replaceChildren(
    ...Array.from(groupedProjects.entries()).map(([title, items]) => renderProjectSection(title, items))
  );
}

function getSiteContentSectionLabel(sectionKey) {
  const labels = {
    github_pages_website: "GitHub Pages Website",
    github_repository: "GitHub Code Repository",
    code_program: "Code / Program",
    pdf_knowledge_resource: "PDF Knowledge Resource",
    other: "Other Voluntary Output"
  };

  return labels[sectionKey] || sectionKey || "Voluntary Project";
}

function renderSiteContentCard(item) {
  const article = document.createElement("article");
  article.className = "card";

  const meta = compactParts([
    getSiteContentSectionLabel(item.section),
    item.contentKey,
    item.displayOrder ? `Order ${item.displayOrder}` : ""
  ], " | ");

  article.append(createTextElement("p", "eyebrow", meta || "Voluntary Project"));
  article.append(createTextElement("h3", "", item.heading || "Untitled content item"));

  if (item.body) {
    article.append(createTextElement("p", "", item.body));
  }

  if (item.linkUrl) {
    const link = document.createElement("a");
    link.className = "button secondary project-link";
    link.href = item.linkUrl;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = item.linkLabel || "Open Link";
    article.append(link);
  }

  return article;
}

function renderSiteContentPreview(items, container) {
  if (!container) return;

  if (!items.length) {
    const empty = document.createElement("article");
    empty.className = "panel";
    empty.append(
      createTextElement("h3", "", "Voluntary project entries will appear here"),
      createTextElement("p", "", "Add an entry to preview voluntary websites, code, programs, or PDF knowledge outputs.")
    );
    container.replaceChildren(empty);
    return;
  }

  const groupedItems = new Map();
  items.forEach((item) => {
    const sectionName = getSiteContentSectionLabel(item.section);
    if (!groupedItems.has(sectionName)) {
      groupedItems.set(sectionName, []);
    }
    groupedItems.get(sectionName).push(item);
  });

  const sections = Array.from(groupedItems.entries()).map(([title, groupItems]) => {
    const section = document.createElement("section");
    section.className = "publication-group";
    const grid = document.createElement("div");
    grid.className = "card-grid three";
    grid.append(...groupItems.map(renderSiteContentCard));
    section.append(createTextElement("h3", "", title), grid);
    return section;
  });

  container.replaceChildren(...sections);
}

function renderProjectModeRow(mode) {
  const row = document.createElement("tr");
  row.append(
    createTextElement("td", "", mode.type),
    createTextElement("td", "", mode.whoPays),
    createTextElement("td", "", mode.purpose),
    createTextElement("td", "", mode.flexibility),
    createTextElement("td", "", mode.output)
  );
  return row;
}

function syncOutput() {
  if (jsonOutput) {
    jsonOutput.value = JSON.stringify(newsItems, null, 2);
  }
  if (newsPreview) {
    renderNewsPreview(sortNewsItems(newsItems), newsPreview);
  }
}

function syncPublicationsOutput() {
  if (publicationsJsonOutput) {
    publicationsJsonOutput.value = JSON.stringify(publicationItems, null, 2);
  }
  renderPublicationsPreview(publicationItems, publicationsPreview);
}

function syncProjectsOutput() {
  const value = JSON.stringify(projectItems, null, 2);
  projectsJsonOutputs.forEach((element) => {
    element.value = value;
  });
  if (fundedProjectReferencesOutput) {
    fundedProjectReferencesOutput.value = fundedProjectReferencesText(projectItems);
  }
  renderProjectsPreview(
    projectItems.filter((item) => item.entryType !== "fundedProject"),
    websiteProjectsPreview
  );
  renderProjectsPreview(
    projectItems.filter((item) => item.entryType === "fundedProject"),
    fundedProjectsPreview
  );
}

function syncSiteContentOutput() {
  if (siteContentJsonOutput) {
    siteContentJsonOutput.value = JSON.stringify(siteContentItems, null, 2);
  }
  renderSiteContentPreview(siteContentItems, siteContentPreview);
}

async function loadNews() {
  if (newsDate) {
    newsDate.value = today();
  }

  try {
    const response = await fetch("data/news.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load data/news.json");
    newsItems = await response.json();
    setStatus("Loaded existing data/news.json. Add a new update when ready.");
  } catch (error) {
    newsItems = [];
    setStatus("Could not load data/news.json. You can still create a new list here.");
  }

  syncOutput();
}

async function loadPublications() {
  if (publicationYear) {
    publicationYear.value = new Date().getFullYear();
  }

  try {
    const response = await fetch("data/publications.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load data/publications.json");
    publicationItems = await response.json();
    setPublicationStatus("Loaded existing data/publications.json. Add a new entry when ready.");
  } catch (error) {
    publicationItems = [];
    setPublicationStatus("Could not load data/publications.json. You can still create a new list here.");
  }

  syncPublicationsOutput();
}

async function loadProjects() {
  try {
    const response = await fetch("data/projects.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load data/projects.json");
    projectItems = await response.json();
    setProjectStatus("Loaded existing data/projects.json. Add a new project when ready.");
  } catch (error) {
    projectItems = [];
    setProjectStatus("Could not load data/projects.json. You can still create a new list here.");
  }

  syncProjectsOutput();
}

async function loadSiteContent() {
  try {
    const response = await fetch("data/voluntary-projects.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load data/voluntary-projects.json");
    siteContentItems = await response.json();
    setSiteContentStatus("Loaded existing data/voluntary-projects.json. Add a voluntary project entry when ready.");
  } catch (error) {
    siteContentItems = [];
    setSiteContentStatus("Could not load data/voluntary-projects.json. You can still create a new list here.");
  }

  syncSiteContentOutput();
}

async function loadProjectModesReference() {
  if (!dashboardProjectModesBody) return;

  try {
    const response = await fetch("data/project-modes.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load data/project-modes.json");
    const modes = await response.json();

    if (!Array.isArray(modes) || !modes.length) {
      const row = document.createElement("tr");
      const cell = createTextElement("td", "", "Project and funding modes are unavailable right now.");
      cell.colSpan = 5;
      row.append(cell);
      dashboardProjectModesBody.replaceChildren(row);
      return;
    }

    dashboardProjectModesBody.replaceChildren(...modes.map(renderProjectModeRow));
  } catch (error) {
    const row = document.createElement("tr");
    const cell = createTextElement("td", "", "Project and funding modes are unavailable right now.");
    cell.colSpan = 5;
    row.append(cell);
    dashboardProjectModesBody.replaceChildren(row);
  }
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

  if (!item.submissionDeadline) delete item.submissionDeadline;
  if (!item.link) delete item.link;

  newsItems = [item, ...newsItems];
  newsTitle.value = "";
  newsDeadline.value = "";
  newsLink.value = "";
  newsSummary.value = "";
  newsDate.value = today();
  syncOutput();
  setStatus("Update added to JSON. Copy or download news.json to publish it.");
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
  setPublicationStatus("Publication added to JSON. Copy or download publications.json to publish it.");
});

websiteProjectForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const item = {
    title: projectTitle.value.trim(),
    entryType: "websiteUtility",
    projectType: "Self-Initiated Utility / Showcase",
    summary: websiteProjectSummary.value.trim(),
    siteUrl: websiteProjectLink.value.trim()
  };

  Object.keys(item).forEach((key) => {
    if (item[key] === "") {
      delete item[key];
    }
  });

  projectItems = [item, ...projectItems];
  projectTitle.value = "";
  websiteProjectSummary.value = "";
  websiteProjectLink.value = "";
  syncProjectsOutput();
  setProjectStatus("Website or utility project added to JSON. Copy or download projects.json to publish it.");
});

fundedProjectForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const item = {
    title: fundedProjectTitle.value.trim(),
    entryType: "fundedProject",
    projectType: fundedProjectType.value,
    fundingAgency: fundedProjectAgency.value.trim(),
    schemeName: fundedProjectScheme.value.trim(),
    role: fundedProjectRole.value.trim(),
    grantNumber: fundedProjectGrantNumber.value.trim(),
    yearOfFunding: fundedProjectYears.value.trim(),
    duration: fundedProjectDuration.value.trim(),
    amountSanctioned: fundedProjectAmount.value.trim(),
    status: fundedProjectStatus.value
  };

  Object.keys(item).forEach((key) => {
    if (item[key] === "") {
      delete item[key];
    }
  });

  projectItems = [item, ...projectItems];
  fundedProjectType.value = "Consultancy Project";
  fundedProjectAgency.value = "";
  fundedProjectScheme.value = "";
  fundedProjectRole.value = "";
  fundedProjectTitle.value = "";
  fundedProjectGrantNumber.value = "";
  fundedProjectYears.value = "";
  fundedProjectDuration.value = "";
  fundedProjectAmount.value = "";
  fundedProjectStatus.value = "Ongoing";
  syncProjectsOutput();
  setProjectStatus("Funded project added to JSON. Copy or download projects.json to publish it.");
});

siteContentForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const item = {
    section: siteContentSection.value,
    contentKey: siteContentKey.value.trim(),
    heading: siteContentHeading.value.trim(),
    body: siteContentBody.value.trim(),
    linkLabel: siteContentLinkLabel.value.trim(),
    linkUrl: siteContentLinkUrl.value.trim(),
    displayOrder: siteContentOrder.value ? Number(siteContentOrder.value) : ""
  };

  Object.keys(item).forEach((key) => {
    if (item[key] === "" || Number.isNaN(item[key])) {
      delete item[key];
    }
  });

  siteContentItems = [item, ...siteContentItems];
  siteContentKey.value = "";
  siteContentHeading.value = "";
  siteContentBody.value = "";
  siteContentLinkLabel.value = "";
  siteContentLinkUrl.value = "";
  siteContentOrder.value = "";
  syncSiteContentOutput();
  setSiteContentStatus("Voluntary project entry added to JSON. Copy or download voluntary-projects.json to publish it.");
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

clearWebsiteProjectDraft?.addEventListener("click", () => {
  projectTitle.value = "";
  websiteProjectSummary.value = "";
  websiteProjectLink.value = "";
  setProjectStatus("Website or utility project draft cleared.");
});

clearFundedProjectDraft?.addEventListener("click", () => {
  fundedProjectType.value = "Consultancy Project";
  fundedProjectAgency.value = "";
  fundedProjectScheme.value = "";
  fundedProjectRole.value = "";
  fundedProjectTitle.value = "";
  fundedProjectGrantNumber.value = "";
  fundedProjectYears.value = "";
  fundedProjectDuration.value = "";
  fundedProjectAmount.value = "";
  fundedProjectStatus.value = "Ongoing";
  setProjectStatus("Funded project draft cleared.");
});

clearSiteContentDraft?.addEventListener("click", () => {
  siteContentSection.value = "github_pages_website";
  siteContentKey.value = "";
  siteContentHeading.value = "";
  siteContentBody.value = "";
  siteContentLinkLabel.value = "";
  siteContentLinkUrl.value = "";
  siteContentOrder.value = "";
  setSiteContentStatus("Voluntary project draft cleared.");
});

projectEntryMode?.addEventListener("change", () => {
  syncProjectEntryMode();
  setProjectStatus(`Showing ${projectEntryMode.value === "funded" ? "funded project" : "website and utility project"} cards.`);
});

copyJson?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(jsonOutput.value);
    setStatus("Copied JSON. Paste it into data/news.json in the GitHub editor.");
    showToast("news.json copied");
  } catch (error) {
    jsonOutput.focus();
    jsonOutput.select();
    setStatus("Select and copy the JSON manually from the box.");
  }
});

copyPublicationsJson?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(publicationsJsonOutput.value);
    setPublicationStatus("Copied JSON. Paste it into data/publications.json in the GitHub editor.");
    showToast("publications.json copied");
  } catch (error) {
    publicationsJsonOutput.focus();
    publicationsJsonOutput.select();
    setPublicationStatus("Select and copy the JSON manually from the box.");
  }
});

copyProjectsJsonButtons.forEach((button, index) => {
  button.addEventListener("click", async () => {
    const source = projectsJsonOutputs[index] || projectsJsonOutputs[0];
    if (!source) return;

    try {
      await navigator.clipboard.writeText(source.value);
      setProjectStatus("Copied JSON. Paste it into data/projects.json in the GitHub editor.");
      showToast("projects.json copied");
    } catch (error) {
      source.focus();
      source.select();
      setProjectStatus("Select and copy the JSON manually from the box.");
    }
  });
});

copyFundedProjectReferences?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(fundedProjectReferencesOutput?.value || "");
    setProjectStatus("Copied funded project reference output.");
    showToast("project references copied");
  } catch (error) {
    fundedProjectReferencesOutput?.focus();
    fundedProjectReferencesOutput?.select();
    setProjectStatus("Select and copy the reference output manually from the box.");
  }
});

copySiteContentJson?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(siteContentJsonOutput.value);
    setSiteContentStatus("Copied JSON. Paste it into data/voluntary-projects.json in the GitHub editor.");
    showToast("voluntary-projects.json copied");
  } catch (error) {
    siteContentJsonOutput.focus();
    siteContentJsonOutput.select();
    setSiteContentStatus("Select and copy the JSON manually from the box.");
  }
});

function downloadJsonFile(filename, value, callback) {
  const blob = new Blob([value], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  callback();
  showToast(`${filename} downloaded`);
}

downloadJson?.addEventListener("click", () => {
  downloadJsonFile("news.json", jsonOutput.value, () => {
    setStatus("Downloaded news.json. Upload or paste it into GitHub to publish at data/news.json.");
  });
});

downloadPublicationsJson?.addEventListener("click", () => {
  downloadJsonFile("publications.json", publicationsJsonOutput.value, () => {
    setPublicationStatus("Downloaded publications.json. Upload or paste it into GitHub to publish at data/publications.json.");
  });
});

downloadProjectsJsonButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const source = projectsJsonOutputs[index] || projectsJsonOutputs[0];
    if (!source) return;

    downloadJsonFile("projects.json", source.value, () => {
      setProjectStatus("Downloaded projects.json. Upload or paste it into GitHub to publish at data/projects.json.");
    });
  });
});

downloadSiteContentJson?.addEventListener("click", () => {
  downloadJsonFile("voluntary-projects.json", siteContentJsonOutput.value, () => {
    setSiteContentStatus("Downloaded voluntary-projects.json. Upload or paste it into GitHub to publish at data/voluntary-projects.json.");
  });
});

updateCurrentYear();
window.setTimeout(setupDashboardCollapsibles, 0);
loadNews();
loadPublications();
loadProjects();
loadSiteContent();
loadProjectModesReference();
