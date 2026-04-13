(function () {
  const managerTargets = [
    { key: "news", outputId: "jsonOutput" },
    { key: "publications", outputId: "publicationsJsonOutput" },
    { key: "projects", outputId: "websiteProjectsJsonOutput" },
    { key: "projects", outputId: "fundedProjectsJsonOutput" },
    { key: "siteContent", outputId: "siteContentJsonOutput" }
  ];

  const state = new Map();

  function createTextElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = text || "";
    return element;
  }

  function status(api, message) {
    if (typeof api.setStatus === "function") api.setStatus(message);
    if (typeof window.showToast === "function") window.showToast(message);
  }

  function itemsFor(api) {
    const items = typeof api.getItems === "function" ? api.getItems() : [];
    return Array.isArray(items) ? items : [];
  }

  function setItems(api, items) {
    if (typeof api.setItems === "function") api.setItems(items);
    else if (typeof api.sync === "function") api.sync();
  }

  function parseJsonArray(text) {
    const parsed = JSON.parse(text || "[]");
    if (!Array.isArray(parsed)) {
      throw new Error("The selected JSON must be an array of records.");
    }
    return parsed;
  }

  function renderOptions(select, api, selectedIndex = -1) {
    const items = itemsFor(api);
    select.replaceChildren(new Option("Select a record", ""));
    items.forEach((item, index) => {
      const label = typeof api.labelItem === "function" ? api.labelItem(item, index) : (item?.title || item?.heading || `Record ${index + 1}`);
      select.append(new Option(`[${index + 1}] ${label}`, String(index)));
    });
    if (selectedIndex >= 0 && selectedIndex < items.length) {
      select.value = String(selectedIndex);
    }
  }

  function renderSelected(select, textarea, api) {
    const index = Number(select.value);
    const items = itemsFor(api);
    textarea.value = Number.isInteger(index) && items[index] ? JSON.stringify(items[index], null, 2) : "";
  }

  async function loadCurrentJson(api, select, textarea) {
    const response = await fetch(api.dataUrl, { cache: "no-store" });
    if (!response.ok) throw new Error(`Unable to load ${api.dataUrl}`);
    const items = await response.json();
    if (!Array.isArray(items)) throw new Error(`${api.dataUrl} must contain a JSON array.`);
    setItems(api, items);
    renderOptions(select, api);
    textarea.value = "";
    status(api, `Loaded current ${api.filename}.`);
  }

  function uploadJsonFile(api, file, select, textarea) {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      try {
        const items = parseJsonArray(reader.result);
        setItems(api, items);
        renderOptions(select, api);
        textarea.value = "";
        status(api, `Loaded ${items.length} records from ${file.name}.`);
      } catch (error) {
        status(api, error.message || "Could not read the selected JSON file.");
      }
    });
    reader.readAsText(file);
  }

  function saveSelected(api, select, textarea) {
    const index = Number(select.value);
    const items = [...itemsFor(api)];
    if (!Number.isInteger(index) || index < 0 || index >= items.length) {
      status(api, "Select a record before saving edits.");
      return;
    }

    try {
      items[index] = JSON.parse(textarea.value || "{}");
      setItems(api, items);
      renderOptions(select, api, index);
      renderSelected(select, textarea, api);
      status(api, "Selected record updated in the generated JSON.");
    } catch (error) {
      status(api, "Selected record JSON is invalid. Please fix it before saving.");
    }
  }

  function deleteSelected(api, select, textarea) {
    const index = Number(select.value);
    const items = [...itemsFor(api)];
    if (!Number.isInteger(index) || index < 0 || index >= items.length) {
      status(api, "Select a record before deleting.");
      return;
    }
    const label = typeof api.labelItem === "function" ? api.labelItem(items[index], index) : `record ${index + 1}`;
    if (!window.confirm(`Delete ${label}?`)) return;
    items.splice(index, 1);
    setItems(api, items);
    renderOptions(select, api);
    textarea.value = "";
    status(api, "Selected record deleted from the generated JSON.");
  }

  function duplicateSelected(api, select, textarea) {
    const index = Number(select.value);
    const items = [...itemsFor(api)];
    if (!Number.isInteger(index) || index < 0 || index >= items.length) {
      status(api, "Select a record before duplicating.");
      return;
    }
    const copy = JSON.parse(JSON.stringify(items[index]));
    items.splice(index, 0, copy);
    setItems(api, items);
    renderOptions(select, api, index);
    renderSelected(select, textarea, api);
    status(api, "Selected record duplicated.");
  }

  function moveSelectedToTop(api, select, textarea) {
    const index = Number(select.value);
    const items = [...itemsFor(api)];
    if (!Number.isInteger(index) || index < 0 || index >= items.length) {
      status(api, "Select a record before moving it.");
      return;
    }
    const [item] = items.splice(index, 1);
    items.unshift(item);
    setItems(api, items);
    renderOptions(select, api, 0);
    renderSelected(select, textarea, api);
    status(api, "Selected record moved to the top.");
  }

  function createManager(target, api) {
    const output = document.getElementById(target.outputId);
    const publishCard = output?.closest(".publish-card");
    if (!output || !publishCard || publishCard.querySelector(`[data-json-manager="${target.key}"]`)) return;

    const panel = document.createElement("section");
    panel.className = "dashboard-record-manager";
    panel.dataset.jsonManager = target.key;

    const heading = document.createElement("div");
    heading.className = "section-heading";
    heading.append(
      createTextElement("p", "eyebrow", "Manage Records"),
      createTextElement("h3", "", `${api.label || "JSON"} record editor`)
    );

    const note = createTextElement("p", "dashboard-form-note", `Load, edit, delete, duplicate, reorder, and export ${api.filename || "JSON"} without exposing any GitHub token.`);

    const actions = document.createElement("div");
    actions.className = "dashboard-actions";
    const loadButton = createTextElement("button", "button secondary", "Load Current JSON");
    loadButton.type = "button";
    const uploadButton = createTextElement("button", "button secondary", "Upload JSON File");
    uploadButton.type = "button";
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "application/json,.json";
    fileInput.hidden = true;
    actions.append(loadButton, uploadButton, fileInput);

    const selectLabel = document.createElement("label");
    selectLabel.append(createTextElement("span", "", "Pick Record"));
    const select = document.createElement("select");
    selectLabel.append(select);

    const editorLabel = document.createElement("label");
    editorLabel.className = "field-span-2";
    editorLabel.append(createTextElement("span", "", "Selected record JSON"));
    const textarea = document.createElement("textarea");
    textarea.className = "json-output dashboard-record-editor";
    textarea.rows = 10;
    textarea.spellcheck = false;
    editorLabel.append(textarea);

    const editActions = document.createElement("div");
    editActions.className = "dashboard-actions";
    const saveButton = createTextElement("button", "button primary", "Save Selected");
    saveButton.type = "button";
    const deleteButton = createTextElement("button", "button secondary", "Delete Selected");
    deleteButton.type = "button";
    const duplicateButton = createTextElement("button", "button secondary", "Duplicate");
    duplicateButton.type = "button";
    const moveButton = createTextElement("button", "button secondary", "Move to Top");
    moveButton.type = "button";
    editActions.append(saveButton, deleteButton, duplicateButton, moveButton);

    panel.append(heading, note, actions, selectLabel, editorLabel, editActions);
    output.before(panel);

    renderOptions(select, api, state.get(target.key) ?? -1);
    renderSelected(select, textarea, api);

    select.addEventListener("change", () => {
      state.set(target.key, select.value === "" ? -1 : Number(select.value));
      renderSelected(select, textarea, api);
    });
    loadButton.addEventListener("click", () => loadCurrentJson(api, select, textarea).catch((error) => status(api, error.message || "Could not load current JSON.")));
    uploadButton.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", () => {
      const file = fileInput.files?.[0];
      if (file) uploadJsonFile(api, file, select, textarea);
      fileInput.value = "";
    });
    saveButton.addEventListener("click", () => saveSelected(api, select, textarea));
    deleteButton.addEventListener("click", () => deleteSelected(api, select, textarea));
    duplicateButton.addEventListener("click", () => duplicateSelected(api, select, textarea));
    moveButton.addEventListener("click", () => moveSelectedToTop(api, select, textarea));
  }

  function setupManagers() {
    const sections = window.dashboardJsonSections || {};
    managerTargets.forEach((target) => {
      const api = sections[target.key];
      if (api) createManager(target, api);
    });
  }

  document.addEventListener("dashboard-json-sections-ready", setupManagers);
  window.addEventListener("load", setupManagers);
  setupManagers();
})();
