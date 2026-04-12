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

let allProjects = [];

function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  return String(value)
    .split(/[,;|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getProjectType(project) {
  return project.projectType || project.project_type || (project.entryType === "fundedProject" ? "Funded Projects" : "Website and Utility Projects");
}

function getProjectStatus(project) {
  return project.status || (project.entryType === "websiteUtility" && project.siteUrl ? "Deployed" : "");
}

function getProjectYear(project) {
  return project.year || project.yearOfFunding || project.fundingYear || project.startYear || "";
}

function getProjectFocusAreas(project) {
  return [
    ...toArray(project.focusAreas),
    ...toArray(project.focus_areas),
    ...toArray(project.domains),
    ...toArray(project.tags),
    ...toArray(project.keywords)
  ];
}

function getProjectSearchText(project) {
  return [
    project.title,
    project.summary,
    getProjectType(project),
    getProjectStatus(project),
    getProjectYear(project),
    project.fundingAgency,
    project.schemeName || project.schemeProgram,
    project.duration,
    project.amountSanctioned,
    project.role,
    project.siteUrl,
    project.repoUrl,
    ...getProjectFocusAreas(project)
  ].filter(Boolean).join(" ").toLowerCase();
}

function updateCurrentYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = year;
  });
}

function getProjectSectionName(project) {
  return getProjectType(project);
}

function renderProjectCard(project) {
  const article = document.createElement("article");
  article.className = "card";

  const fragments = [];
  const isFundedProject = project.entryType === "fundedProject";
  const metaBits = [
    getProjectType(project),
    project.fundingAgency,
    project.schemeName || project.schemeProgram,
    getProjectYear(project),
    getProjectStatus(project)
  ].filter(Boolean);

  fragments.push(createTextElement("h3", "", project.title));

  if (metaBits.length) {
    fragments.push(createTextElement("p", "project-meta", metaBits.join(" | ")));
  }

  if (project.summary) {
    fragments.push(createTextElement("p", "", project.summary));
  }

  const detailBits = [];
  if (project.duration) detailBits.push(`Duration: ${project.duration}`);
  if (project.amountSanctioned) detailBits.push(`Amount: ${project.amountSanctioned}`);

  if (detailBits.length) {
    fragments.push(createTextElement("p", "project-detail", detailBits.join(" | ")));
  }

  article.append(...fragments);

  if (project.siteUrl) {
    const siteLink = document.createElement("a");
    siteLink.className = "button secondary project-link";
    siteLink.href = project.siteUrl;
    siteLink.target = "_blank";
    siteLink.rel = "noopener";
    siteLink.textContent = "Open Project";
    article.append(siteLink);
  } else if (isFundedProject) {
    article.append(createTextElement("p", "project-detail", "Funded project entry"));
  }

  return article;
}

function uniqueSorted(values, sortYears = false) {
  const unique = [...new Set(values.filter(Boolean).map(String))];
  return unique.sort((a, b) => {
    if (sortYears) return Number(b) - Number(a);
    return a.localeCompare(b);
  });
}

function populateSelect(select, values, defaultLabel) {
  if (!select) return;
  const currentValue = select.value;
  select.replaceChildren(new Option(defaultLabel, ""));
  values.forEach((value) => select.append(new Option(value, value)));
  if (values.includes(currentValue)) {
    select.value = currentValue;
  }
}

function populateProjectFilters(projects) {
  populateSelect(
    document.getElementById("projectTypeFilter"),
    uniqueSorted(projects.map(getProjectType)),
    "All Types"
  );
  populateSelect(
    document.getElementById("projectStatusFilter"),
    uniqueSorted(projects.map(getProjectStatus)),
    "All Statuses"
  );
  populateSelect(
    document.getElementById("projectYearFilter"),
    uniqueSorted(projects.map(getProjectYear), true),
    "All Years"
  );
  populateSelect(
    document.getElementById("projectFocusFilter"),
    uniqueSorted(projects.flatMap(getProjectFocusAreas)),
    "All Focus Areas"
  );
}

function getFilteredProjects() {
  const search = (document.getElementById("projectSearch")?.value || "").trim().toLowerCase();
  const type = document.getElementById("projectTypeFilter")?.value || "";
  const status = document.getElementById("projectStatusFilter")?.value || "";
  const year = document.getElementById("projectYearFilter")?.value || "";
  const focus = document.getElementById("projectFocusFilter")?.value || "";

  return allProjects.filter((project) => {
    const focusAreas = getProjectFocusAreas(project);
    return (!search || getProjectSearchText(project).includes(search)) &&
      (!type || getProjectType(project) === type) &&
      (!status || getProjectStatus(project) === status) &&
      (!year || String(getProjectYear(project)) === year) &&
      (!focus || focusAreas.includes(focus));
  });
}

function renderProjects(projects) {
  const container = document.getElementById("projectSections");
  const summary = document.getElementById("projectFilterSummary");
  if (!container) return;

  if (!projects.length) {
    const empty = document.createElement("article");
    empty.className = "panel";
    empty.append(
      createTextElement("h3", "", "No matching projects"),
      createTextElement("p", "", "Adjust the search or filters to view more project entries.")
    );
    container.replaceChildren(empty);
    if (summary) summary.textContent = `Showing 0 of ${allProjects.length} project entries.`;
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

  if (summary) {
    const label = projects.length === 1 ? "project entry" : "project entries";
    summary.textContent = `Showing ${projects.length} of ${allProjects.length} ${label}.`;
  }
}

function applyProjectFilters() {
  renderProjects(getFilteredProjects());
}

function bindProjectFilters() {
  ["projectSearch", "projectTypeFilter", "projectStatusFilter", "projectYearFilter", "projectFocusFilter"].forEach((id) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.addEventListener(element.tagName === "INPUT" ? "input" : "change", applyProjectFilters);
  });
}

function formatFundedProjectReference(project, index) {
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

  const item = document.createElement("li");
  item.append(
    createTextElement("span", "publication-number", `[${index + 1}]`),
    createTextElement("span", "publication-reference", `${parts.join(", ")}.`)
  );
  return item;
}

function renderFundedProjectSection(title, projects) {
  const section = document.createElement("section");
  section.className = "publication-group";

  const heading = createTextElement("h3", "", title);
  const list = document.createElement("ol");
  list.className = "publication-items project-reference-list";
  list.append(...projects.map(formatFundedProjectReference));

  section.append(heading, list);
  return section;
}

function renderProjectSection(title, projects) {
  if (projects.every((project) => project.entryType === "fundedProject")) {
    return renderFundedProjectSection(title, projects);
  }

  const section = document.createElement("section");
  section.className = "publication-group";

  const heading = createTextElement("h3", "", title);

  const grid = document.createElement("div");
  grid.className = "card-grid three project-grid";
  grid.append(...projects.map(renderProjectCard));

  section.append(heading, grid);
  return section;
}

async function loadProjects() {
  const container = document.getElementById("projectSections");
  if (!container) return;

  try {
    const response = await fetch("data/projects.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load data/projects.json");
    const projects = await response.json();

    if (!Array.isArray(projects) || !projects.length) {
      const empty = document.createElement("article");
      empty.className = "panel";
      empty.append(
        createTextElement("h3", "", "Projects will appear here"),
      createTextElement("p", "", "Add entries through the dashboard and publish the generated data/projects.json file.")
      );
      container.replaceChildren(empty);
      return;
    }

    allProjects = projects;
    populateProjectFilters(allProjects);
    bindProjectFilters();
    renderProjects(allProjects);
  } catch (error) {
    const fallback = document.createElement("article");
    fallback.className = "panel";
    fallback.append(
      createTextElement("h3", "", "Projects unavailable"),
      createTextElement("p", "", "Please check data/projects.json and try again.")
    );
    container.replaceChildren(fallback);
  }
}

updateCurrentYear();
loadProjects();
