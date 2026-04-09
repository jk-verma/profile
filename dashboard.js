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

const websiteProjectForm = document.getElementById("websiteProjectForm");
const projectTitle = document.getElementById("projectTitle");
const websiteProjectSummary = document.getElementById("websiteProjectSummary");
const websiteProjectLink = document.getElementById("websiteProjectLink");
const clearWebsiteProjectDraft = document.getElementById("clearWebsiteProjectDraft");

const fundedProjectForm = document.getElementById("fundedProjectForm");
const fundedProjectType = document.getElementById("fundedProjectType");
const fundedProjectAgency = document.getElementById("fundedProjectAgency");
const fundedProjectScheme = document.getElementById("fundedProjectScheme");
const fundedProjectTitle = document.getElementById("fundedProjectTitle");
const fundedProjectYears = document.getElementById("fundedProjectYears");
const fundedProjectDuration = document.getElementById("fundedProjectDuration");
const fundedProjectAmount = document.getElementById("fundedProjectAmount");
const fundedProjectStatus = document.getElementById("fundedProjectStatus");
const clearFundedProjectDraft = document.getElementById("clearFundedProjectDraft");

const projectsJsonOutputs = Array.from(document.querySelectorAll(".projects-json-output"));
const projectStatusMessages = Array.from(document.querySelectorAll(".project-dashboard-status"));
const copyProjectsJsonButtons = Array.from(document.querySelectorAll(".copy-projects-json"));
const downloadProjectsJsonButtons = Array.from(document.querySelectorAll(".download-projects-json"));

const menuToggle = document.getElementById("menuToggle");
const primaryNav = document.getElementById("primaryNav");

let newsItems = [];
let publicationItems = [];
let projectItems = [];

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
  projectStatusMessages.forEach((element) => {
    element.textContent = message;
  });
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
  const value = JSON.stringify(projectItems, null, 2);
  projectsJsonOutputs.forEach((element) => {
    element.value = value;
  });
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
  fundedProjectTitle.value = "";
  fundedProjectYears.value = "";
  fundedProjectDuration.value = "";
  fundedProjectAmount.value = "";
  fundedProjectStatus.value = "Ongoing";
  syncProjectsOutput();
  setProjectStatus("Funded project added to JSON. Copy or download projects.json to publish it.");
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
  fundedProjectTitle.value = "";
  fundedProjectYears.value = "";
  fundedProjectDuration.value = "";
  fundedProjectAmount.value = "";
  fundedProjectStatus.value = "Ongoing";
  setProjectStatus("Funded project draft cleared.");
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

copyProjectsJsonButtons.forEach((button, index) => {
  button.addEventListener("click", async () => {
    const source = projectsJsonOutputs[index] || projectsJsonOutputs[0];
    if (!source) return;

    try {
      await navigator.clipboard.writeText(source.value);
      setProjectStatus("Copied JSON. Paste it into projects.json in the GitHub editor.");
    } catch (error) {
      source.focus();
      source.select();
      setProjectStatus("Select and copy the JSON manually from the box.");
    }
  });
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

downloadProjectsJsonButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const source = projectsJsonOutputs[index] || projectsJsonOutputs[0];
    if (!source) return;

    downloadJsonFile("projects.json", source.value, () => {
      setProjectStatus("Downloaded projects.json. Upload or paste it into GitHub to publish.");
    });
  });
});

loadNews();
loadPublications();
loadProjects();
