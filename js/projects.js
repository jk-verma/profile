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

function updateCurrentYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = year;
  });
}

function getProjectSectionName(project) {
  return project.projectType || (project.entryType === "fundedProject" ? "Funded Projects" : "Website and Utility Projects");
}

function renderProjectCard(project) {
  const article = document.createElement("article");
  article.className = "card";

  const fragments = [];
  const isFundedProject = project.entryType === "fundedProject";
  const metaBits = [
    project.projectType,
    project.fundingAgency,
    project.schemeName || project.schemeProgram,
    project.yearOfFunding,
    project.status
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
