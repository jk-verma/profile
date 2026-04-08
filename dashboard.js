const newsForm = document.getElementById("newsForm");
const newsDate = document.getElementById("newsDate");
const newsCategory = document.getElementById("newsCategory");
const newsTitle = document.getElementById("newsTitle");
const newsDeadline = document.getElementById("newsDeadline");
const newsLink = document.getElementById("newsLink");
const newsSummary = document.getElementById("newsSummary");
const jsonOutput = document.getElementById("jsonOutput");
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
const publicationStatusMessage = document.getElementById("publicationDashboardStatus");
const copyPublicationsJson = document.getElementById("copyPublicationsJson");
const downloadPublicationsJson = document.getElementById("downloadPublicationsJson");
const clearPublicationDraft = document.getElementById("clearPublicationDraft");

const projectForm = document.getElementById("projectForm");
const projectTitle = document.getElementById("projectTitle");
const projectFundingAgency = document.getElementById("projectFundingAgency");
const projectSchemeProgram = document.getElementById("projectSchemeProgram");
const projectRole = document.getElementById("projectRole");
const projectFeeReceivedBy = document.getElementById("projectFeeReceivedBy");
const projectSummary = document.getElementById("projectSummary");
const projectYearOfFunding = document.getElementById("projectYearOfFunding");
const projectDuration = document.getElementById("projectDuration");
const projectAmountSanctioned = document.getElementById("projectAmountSanctioned");
const projectStatus = document.getElementById("projectStatus");
const projectSiteUrl = document.getElementById("projectSiteUrl");
const projectRepoUrl = document.getElementById("projectRepoUrl");
const projectsJsonOutput = document.getElementById("projectsJsonOutput");
const projectStatusMessage = document.getElementById("projectDashboardStatus");
const copyProjectsJson = document.getElementById("copyProjectsJson");
const downloadProjectsJson = document.getElementById("downloadProjectsJson");
const clearProjectDraft = document.getElementById("clearProjectDraft");

const projectModeForm = document.getElementById("projectModeForm");
const projectModeType = document.getElementById("projectModeType");
const projectModeWhoPays = document.getElementById("projectModeWhoPays");
const projectModePurpose = document.getElementById("projectModePurpose");
const projectModeFlexibility = document.getElementById("projectModeFlexibility");
const projectModeOutput = document.getElementById("projectModeOutput");
const projectModesJsonOutput = document.getElementById("projectModesJsonOutput");
const projectModeStatusMessage = document.getElementById("projectModeDashboardStatus");
const copyProjectModesJson = document.getElementById("copyProjectModesJson");
const downloadProjectModesJson = document.getElementById("downloadProjectModesJson");
const clearProjectModeDraft = document.getElementById("clearProjectModeDraft");

const menuToggle = document.getElementById("menuToggle");
const primaryNav = document.getElementById("primaryNav");

let newsItems = [];
let publicationItems = [];
let projectItems = [];
let projectModeItems = [];

const publicationTypes = [
  "Journal Article",
  "Conference Paper",
  "Book Chapter",
  "Book / Edited Volume",
  "Patent",
  "Forthcoming / Accepted"
];

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
  if (statusMessage) statusMessage.textContent = message;
}

function setPublicationStatus(message) {
  if (publicationStatusMessage) publicationStatusMessage.textContent = message;
}

function setProjectStatus(message) {
  if (projectStatusMessage) projectStatusMessage.textContent = message;
}

function setProjectModeStatus(message) {
  if (projectModeStatusMessage) projectModeStatusMessage.textContent = message;
}

function parseIndexing(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function syncOutput() {
  if (jsonOutput) {
    jsonOutput.value = JSON.stringify(newsItems, null, 2);
  }
}

function syncPublicationsOutput() {
  if (publicationsJsonOutput) {
    publicationsJsonOutput.value = JSON.stringify(publicationItems, null, 2);
  }
}

function syncProjectsOutput() {
  if (projectsJsonOutput) {
    projectsJsonOutput.value = JSON.stringify(projectItems, null, 2);
  }
}

function syncProjectModesOutput() {
  if (projectModesJsonOutput) {
    projectModesJsonOutput.value = JSON.stringify(projectModeItems, null, 2);
  }
}

async function loadNews() {
  if (newsDate) {
    newsDate.value = today();
  }

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

async function loadProjects() {
  try {
    const response = await fetch("projects.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load projects.json");
    projectItems = await response.json();
    setProjectStatus("Loaded existing projects.json. Add a new project when ready.");
  } catch (error) {
    projectItems = [];
    setProjectStatus("Could not load projects.json. You can still create a new list here.");
  }

  syncProjectsOutput();
}

async function loadProjectModes() {
  try {
    const response = await fetch("project-modes.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load project-modes.json");
    projectModeItems = await response.json();
    setProjectModeStatus("Loaded existing project-modes.json. Add a new row when ready.");
  } catch (error) {
    projectModeItems = [];
    setProjectModeStatus("Could not load project-modes.json. You can still create a new list here.");
  }

  syncProjectModesOutput();
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

projectForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const item = {
    title: projectTitle.value.trim(),
    fundingAgency: projectFundingAgency.value.trim(),
    schemeProgram: projectSchemeProgram.value.trim(),
    role: projectRole.value.trim(),
    feeReceivedBy: projectFeeReceivedBy.value,
    summary: projectSummary.value.trim(),
    yearOfFunding: projectYearOfFunding.value.trim(),
    duration: projectDuration.value.trim(),
    amountSanctioned: projectAmountSanctioned.value.trim(),
    status: projectStatus.value,
    siteUrl: projectSiteUrl.value.trim(),
    repoUrl: projectRepoUrl.value.trim()
  };

  Object.keys(item).forEach((key) => {
    if (item[key] === "") {
      delete item[key];
    }
  });

  projectItems = [item, ...projectItems];
  projectTitle.value = "";
  projectFundingAgency.value = "";
  projectSchemeProgram.value = "";
  projectRole.value = "";
  projectFeeReceivedBy.value = "";
  projectSummary.value = "";
  projectYearOfFunding.value = "";
  projectDuration.value = "";
  projectAmountSanctioned.value = "";
  projectStatus.value = "";
  projectSiteUrl.value = "";
  projectRepoUrl.value = "";
  syncProjectsOutput();
  setProjectStatus("Project added to JSON. Copy or download projects.json to publish it.");
});

projectModeForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const item = {
    type: projectModeType.value.trim(),
    whoPays: projectModeWhoPays.value.trim(),
    purpose: projectModePurpose.value.trim(),
    flexibility: projectModeFlexibility.value.trim(),
    output: projectModeOutput.value.trim()
  };

  projectModeItems = [item, ...projectModeItems];
  projectModeType.value = "";
  projectModeWhoPays.value = "";
  projectModePurpose.value = "";
  projectModeFlexibility.value = "";
  projectModeOutput.value = "";
  syncProjectModesOutput();
  setProjectModeStatus("Project mode row added to JSON. Copy or download project-modes.json to publish it.");
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

clearProjectDraft?.addEventListener("click", () => {
  projectTitle.value = "";
  projectFundingAgency.value = "";
  projectSchemeProgram.value = "";
  projectRole.value = "";
  projectFeeReceivedBy.value = "";
  projectSummary.value = "";
  projectYearOfFunding.value = "";
  projectDuration.value = "";
  projectAmountSanctioned.value = "";
  projectStatus.value = "";
  projectSiteUrl.value = "";
  projectRepoUrl.value = "";
  setProjectStatus("Project draft cleared.");
});

clearProjectModeDraft?.addEventListener("click", () => {
  projectModeType.value = "";
  projectModeWhoPays.value = "";
  projectModePurpose.value = "";
  projectModeFlexibility.value = "";
  projectModeOutput.value = "";
  setProjectModeStatus("Project mode draft cleared.");
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

copyProjectsJson?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(projectsJsonOutput.value);
    setProjectStatus("Copied JSON. Paste it into projects.json in the GitHub editor.");
  } catch (error) {
    projectsJsonOutput.focus();
    projectsJsonOutput.select();
    setProjectStatus("Select and copy the JSON manually from the box.");
  }
});

copyProjectModesJson?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(projectModesJsonOutput.value);
    setProjectModeStatus("Copied JSON. Paste it into project-modes.json in the GitHub editor.");
  } catch (error) {
    projectModesJsonOutput.focus();
    projectModesJsonOutput.select();
    setProjectModeStatus("Select and copy the JSON manually from the box.");
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
}

downloadJson?.addEventListener("click", () => {
  downloadJsonFile("news.json", jsonOutput.value, () => {
    setStatus("Downloaded news.json. Upload or paste it into GitHub to publish.");
  });
});

downloadPublicationsJson?.addEventListener("click", () => {
  downloadJsonFile("publications.json", publicationsJsonOutput.value, () => {
    setPublicationStatus("Downloaded publications.json. Upload or paste it into GitHub to publish.");
  });
});

downloadProjectsJson?.addEventListener("click", () => {
  downloadJsonFile("projects.json", projectsJsonOutput.value, () => {
    setProjectStatus("Downloaded projects.json. Upload or paste it into GitHub to publish.");
  });
});

downloadProjectModesJson?.addEventListener("click", () => {
  downloadJsonFile("project-modes.json", projectModesJsonOutput.value, () => {
    setProjectModeStatus("Downloaded project-modes.json. Upload or paste it into GitHub to publish.");
  });
});

loadNews();
loadPublications();
loadProjects();
loadProjectModes();
