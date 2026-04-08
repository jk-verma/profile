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

function renderProjectCard(project) {
  const article = document.createElement("article");
  article.className = "card";

  const fragments = [];
  const metaBits = [
    project.projectType,
    project.fundingAgency,
    project.schemeProgram,
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
  if (project.role) detailBits.push(`Role: ${project.role}`);
  if (project.duration) detailBits.push(`Duration: ${project.duration}`);
  if (project.amountSanctioned) detailBits.push(`Amount: ${project.amountSanctioned}`);
  if (project.feeReceivedBy) detailBits.push(`Funds Received By: ${project.feeReceivedBy}`);

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
  }

  return article;
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

async function loadProjects() {
  const list = document.getElementById("projectsList");
  if (!list) return;

  try {
    const response = await fetch("projects.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load projects.json");
    const projects = await response.json();

    if (!Array.isArray(projects) || !projects.length) {
      const empty = document.createElement("article");
      empty.className = "panel";
      empty.append(
        createTextElement("h3", "", "Projects will appear here"),
        createTextElement("p", "", "Add entries through the dashboard and publish the generated projects.json file.")
      );
      list.replaceChildren(empty);
      return;
    }

    list.replaceChildren(...projects.map(renderProjectCard));
  } catch (error) {
    const fallback = document.createElement("article");
    fallback.className = "panel";
    fallback.append(
      createTextElement("h3", "", "Projects unavailable"),
      createTextElement("p", "", "Please check projects.json and try again.")
    );
    list.replaceChildren(fallback);
  }
}

async function loadProjectModes() {
  const body = document.getElementById("projectModesBody");
  if (!body) return;

  try {
    const response = await fetch("project-modes.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load project-modes.json");
    const modes = await response.json();

    if (!Array.isArray(modes) || !modes.length) {
      const row = document.createElement("tr");
      const cell = createTextElement("td", "", "Add rows through the dashboard and publish the generated project-modes.json file.");
      cell.colSpan = 5;
      row.append(cell);
      body.replaceChildren(row);
      return;
    }

    body.replaceChildren(...modes.map(renderProjectModeRow));
  } catch (error) {
    const row = document.createElement("tr");
    const cell = createTextElement("td", "", "Project modes are unavailable right now.");
    cell.colSpan = 5;
    row.append(cell);
    body.replaceChildren(row);
  }
}

loadProjects();
loadProjectModes();
