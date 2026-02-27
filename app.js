// app.js
// Core app logic for Academic RuneScape (NO SERVER / file:// friendly).
// Skills are loaded via classic <script src="skills/..."> tags into window.ACAD_RS_SKILLS.
// XP persistence: localStorage by default.
// Optional: File System Access API if available + user picks a folder (kept, but not required).

const XP_FILE = "xp_log.jsonl";
const LS_KEY = "academic_runescape_xp_log_v1";

// Technique dropdown behavior
const TECHNIQUE_DATALIST_LIMIT = 5; // this is the "40 items" control
const SUGGEST_COUNT = 3;

// ---------- Folder (optional) ----------
let folderHandle = null;

function canUseFolderPicker() {
  return !!(window.isSecureContext && window.showDirectoryPicker);
}

async function ensureFileHandle(dirHandle, filename) {
  return await dirHandle.getFileHandle(filename, { create: true });
}

async function appendLineToFile(dirHandle, filename, line) {
  const fileHandle = await ensureFileHandle(dirHandle, filename);
  const writable = await fileHandle.createWritable({ keepExistingData: true });
  const file = await fileHandle.getFile();
  await writable.seek(file.size);
  await writable.write(line + "\n");
  await writable.close();
}

async function readAllLines(dirHandle, filename) {
  try {
    const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
    const file = await fileHandle.getFile();
    const text = await file.text();
    return text.split("\n").map(s => s.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

// ---------- LocalStorage XP log ----------
function loadLocalLog() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalLog(log) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(log));
  } catch {
    // ignore
  }
}

// ---------- Helpers ----------
function clamp01(x) { return Math.max(0, Math.min(1, x)); }

// Simple leveling curve (your current one)
function levelFromXp(xp) {
  let lvl = 1;
  while (xp >= xpForLevel(lvl + 1) && lvl < 120) lvl++;
  return lvl;
}
function xpForLevel(level) {
  if (level <= 1) return 0;
  return Math.floor(10 * Math.pow(level - 1, 3));
}
function progressToNextLevel(xp) {
  const lvl = levelFromXp(xp);
  const lo = xpForLevel(lvl);
  const hi = xpForLevel(lvl + 1);
  const frac = hi === lo ? 1 : (xp - lo) / (hi - lo);
  return { lvl, frac: clamp01(frac), toNext: Math.max(0, hi - xp) };
}

function safeArray(x) {
  return Array.isArray(x) ? x : [];
}

function normalizeSkill(raw) {
  const s = Object.assign({}, raw);

  // Category default
  if (!s.category) s.category = "physics";

  // Infer elite: cap > 99 (i.e., 120-cap skills)
  const capNum = Number(s.cap ?? 99);
  s.cap = Number.isFinite(capNum) ? capNum : 99;
  s.isElite = s.cap > 99;

  // Techniques must be objects: {level, name}
  s.techniques = safeArray(s.techniques)
    .filter(t => t && typeof t === "object")
    .map(t => ({
      level: Number(t.level ?? 1),
      name: String(t.name ?? "").trim(),
    }))
    .filter(t => Number.isFinite(t.level) && t.name.length > 0)
    .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));

  return s;
}

function getSkillAccent(skillId) {
  // matches your mental color notes
  switch (skillId) {
    case "em": return "#22c55e";                 
    case "thermo_statmech": return "#2dd4bf";   
    case "qm": return "#a855f7";                
    case "qft": return "#6366f1";               
    case "gr": return "#f59e0b";                 
    case "classical_mechanics": return "#ef4444"; 
    case "cosmo": return "#111111";              
    default: return "#7c5cff";
  }
}

// Pick up to N techniques "near your level"
function pickNearbyTechniques(techs, lvl, n) {
  const list = safeArray(techs);
  if (list.length === 0) return [];

  // Score by distance to current level, break ties by level then name
  const scored = list.map(t => ({
    t,
    d: Math.abs((t.level ?? 1) - lvl),
  }));

  scored.sort((a, b) =>
    a.d - b.d ||
    (a.t.level - b.t.level) ||
    a.t.name.localeCompare(b.t.name)
  );

  return scored.slice(0, n).map(x => x.t);
}

// Build a limited datalist (avoid dumping the whole tree)
function buildTechniqueDatalistSubset(techs, lvl, limit) {
  const list = safeArray(techs);
  if (list.length <= limit) return list;

  // Take a window around your level first
  const windowSize = Math.floor(limit * 0.7); // 70% around level, rest closest fill
  const half = Math.floor(windowSize / 2);
  const lo = lvl - half;
  const hi = lvl + half;

  const inWindow = list.filter(t => t.level >= lo && t.level <= hi);

  // If window too small, fill with nearest
  const needed = limit - Math.min(inWindow.length, limit);
  const extras = pickNearbyTechniques(list, lvl, needed + 10) // +10 buffer then unique
    .filter(t => !inWindow.some(x => x.level === t.level && x.name === t.name));

  const combined = inWindow.concat(extras).slice(0, limit);

  combined.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  return combined;
}

// ---------- Custom Select (replace OS dropdown UI) ----------
function enhanceSelect(selectEl, { formatOption } = {}) {
  if (!selectEl || selectEl.dataset.enhanced === "1") return;

  selectEl.classList.add("nativeSelectHidden");

  const wrap = document.createElement("div");
  wrap.className = "cSelect";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "cSelectBtn";
  btn.setAttribute("aria-haspopup", "listbox");
  btn.setAttribute("aria-expanded", "false");

  const btnLabel = document.createElement("span");
  const btnChevron = document.createElement("span");
  btnChevron.className = "cSelectChevron";
  btnChevron.textContent = "▾";

  btn.appendChild(btnLabel);
  btn.appendChild(btnChevron);

  const menu = document.createElement("div");
  menu.className = "cSelectMenu";
  menu.setAttribute("role", "listbox");
  menu.hidden = true;

  function getSelectedOption() {
    return selectEl.options[selectEl.selectedIndex] || null;
  }

  function setBtnLabel() {
    const opt = getSelectedOption();
    btnLabel.textContent = opt ? opt.textContent : "Select…";
  }

  function rebuildMenu() {
    menu.innerHTML = "";
    const currentValue = selectEl.value;

    for (const opt of selectEl.options) {
      const item = document.createElement("div");
      item.className = "cSelectOption";
      item.setAttribute("role", "option");
      item.dataset.value = opt.value;
      item.setAttribute("aria-selected", opt.value === currentValue ? "true" : "false");

      if (formatOption) {
        const formatted = formatOption(opt);
        if (typeof formatted === "string") {
          item.textContent = formatted;
        } else if (formatted && typeof formatted === "object") {
          item.textContent = formatted.title ?? opt.textContent;
          if (formatted.subtitle) {
            const sub = document.createElement("span");
            sub.className = "cSelectOptionSub";
            sub.textContent = formatted.subtitle;
            item.appendChild(sub);
          }
        } else {
          item.textContent = opt.textContent;
        }
      } else {
        item.textContent = opt.textContent;
      }

      item.addEventListener("click", () => {
        selectEl.value = opt.value;
        selectEl.dispatchEvent(new Event("change", { bubbles: true }));
        closeMenu();
      });

      menu.appendChild(item);
    }
  }

  function openMenu() {
    rebuildMenu();
    setBtnLabel();
    menu.hidden = false;
    btn.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    menu.hidden = true;
    btn.setAttribute("aria-expanded", "false");
  }

  function toggleMenu() {
    if (menu.hidden) openMenu();
    else closeMenu();
  }

  btn.addEventListener("click", toggleMenu);

  document.addEventListener("mousedown", (e) => {
    if (!wrap.contains(e.target)) closeMenu();
  });

  btn.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMenu();
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (menu.hidden) openMenu();
      const dir = e.key === "ArrowDown" ? 1 : -1;
      const idx = Math.max(0, selectEl.selectedIndex + dir);
      selectEl.selectedIndex = Math.min(selectEl.options.length - 1, idx);
      selectEl.dispatchEvent(new Event("change", { bubbles: true }));
      rebuildMenu();
      setBtnLabel();
    }
  });

  selectEl.addEventListener("change", () => {
    setBtnLabel();
    if (!menu.hidden) rebuildMenu();
  });

  selectEl.insertAdjacentElement("afterend", wrap);
  wrap.appendChild(btn);
  wrap.appendChild(menu);

  setBtnLabel();

  selectEl.dataset.enhanced = "1";
  selectEl._cSelectRefresh = () => {
    setBtnLabel();
    if (!menu.hidden) rebuildMenu();
  };
}

// ---------- App state ----------
let skills = [];
let skillById = new Map();

let xpBySkill = new Map(); // id -> total xp
let xpLog = [];           // array of entries (localStorage)

// ---------- DOM references ----------
let chooseFolderBtn, folderStatus;
let skillGridPhysics, skillGridElite, skillGridMath;
let skillSelect, techniqueInput, techniqueList, activitySelect, noteInput, addXpBtn;
let modalBackdrop, skillModal, closeModalBtn, modalTitle, modalSubtitle, modalDescription, modalMilestones, modalTechniques, modalTechniqueSearch;
let suggestRow, chipRow;

// ---------- Rendering ----------
function renderSkillCard(skill) {
  const xp = xpBySkill.get(skill.id) ?? 0;
  const { lvl, frac } = progressToNextLevel(xp);

  const card = document.createElement("div");
  card.className = "skillCard";
  card.style.setProperty("--skill-accent", getSkillAccent(skill.id));

  if (skill.isElite) card.classList.add("skillCard--elite");
  if (skill.id === "cosmo") card.classList.add("skillCard--cosmo");

  const top = document.createElement("div");
  top.className = "skillCardTop";

  const titleBtn = document.createElement("button");
  titleBtn.className = "skillTitleBtn";
  titleBtn.type = "button";
  titleBtn.textContent = skill.isElite ? `${skill.name}` : skill.name;
  titleBtn.addEventListener("click", () => openSkillModal(skill.id));

  const badge = document.createElement("div");
  badge.className = "skillBadge";
  badge.textContent = skill.category === "physics" ? "Physics" : "Math";

  top.appendChild(titleBtn);
  top.appendChild(badge);

  const meta = document.createElement("div");
  meta.className = "skillMeta";
  meta.textContent = `Level ${lvl} · ${xp} XP`;

  const bar = document.createElement("div");
  bar.className = "progressBar";

  const fill = document.createElement("div");
  fill.className = "progressFill";
  // IMPORTANT: progress-to-next-level bar (resets after level-up)
  fill.style.width = `${Math.floor(frac * 100)}%`;
  fill.style.background = `linear-gradient(90deg, ${getSkillAccent(skill.id)}, rgba(255,255,255,0.25))`;

  bar.appendChild(fill);

  card.appendChild(top);
  card.appendChild(meta);
  card.appendChild(bar);

  return card;
}

function updateTechniqueDatalist() {
  const sid = skillSelect.value;
  const s = skillById.get(sid);
  if (!s) return;

  const xp = xpBySkill.get(sid) ?? 0;
  const { lvl } = progressToNextLevel(xp);

  const subset = buildTechniqueDatalistSubset(s.techniques ?? [], lvl, TECHNIQUE_DATALIST_LIMIT);

  techniqueList.innerHTML = "";
  for (const t of subset) {
    const opt = document.createElement("option");
    // datalist values are strings; we show technique.name only (requirement)
    opt.value = t.name;
    techniqueList.appendChild(opt);
  }
}

function renderSuggestions() {
  if (!chipRow) return;

  const sid = skillSelect.value;
  const s = skillById.get(sid);
  chipRow.innerHTML = "";
  if (!s) return;

  const xp = xpBySkill.get(sid) ?? 0;
  const { lvl } = progressToNextLevel(xp);

  const picks = pickNearbyTechniques(s.techniques ?? [], lvl, SUGGEST_COUNT);
  for (const t of picks) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.style.setProperty("--chip-accent", getSkillAccent(sid));
    chip.textContent = `Level ${t.level}: ${t.name}`;
    chip.title = "Click to fill technique";
    chip.addEventListener("click", () => {
      techniqueInput.value = t.name;
      techniqueInput.focus();
    });
    chipRow.appendChild(chip);
  }
}

function renderAll() {
  // Grids
  skillGridPhysics.innerHTML = "";
  skillGridElite.innerHTML = "";
  skillGridMath.innerHTML = "";

  const physics = skills.filter(s => s.category === "physics" && !s.isElite);
  const elite = skills.filter(s => s.category === "physics" && s.isElite);
  const math = skills.filter(s => s.category === "math");

  for (const s of physics) skillGridPhysics.appendChild(renderSkillCard(s));
  for (const s of elite) skillGridElite.appendChild(renderSkillCard(s));
  for (const s of math) skillGridMath.appendChild(renderSkillCard(s));

  // Skill dropdown
  skillSelect.innerHTML = "";
  for (const s of skills) {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.isElite ? `${s.name} (Elite)` : s.name;
    skillSelect.appendChild(opt);
  }

  // Refresh custom select UI if installed
  if (skillSelect && skillSelect._cSelectRefresh) skillSelect._cSelectRefresh();
  if (activitySelect && activitySelect._cSelectRefresh) activitySelect._cSelectRefresh();

  updateTechniqueDatalist();
  renderSuggestions();
}

// ---------- Modal ----------
let lastFocusedEl = null;

function openSkillModal(skillId) {
  const s = skillById.get(skillId);
  if (!s) return;

  lastFocusedEl = document.activeElement;

  modalTitle.textContent = s.isElite ? `${s.name} (Elite)` : s.name;
  modalSubtitle.textContent = s.category === "physics" ? "Physics skill" : "Math skill";
  modalDescription.textContent = s.description ?? "";

  // Accent strip in header
  skillModal.style.setProperty("--skill-accent", getSkillAccent(s.id));

  // Milestones
  modalMilestones.innerHTML = "";
  for (const m of safeArray(s.milestones)) {
    const li = document.createElement("li");
    li.textContent = `Level ${m.level}: ${m.text}`;
    modalMilestones.appendChild(li);
  }
  if (!s.milestones || s.milestones.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No milestones yet.";
    modalMilestones.appendChild(li);
  }

  // Techniques
  modalTechniqueSearch.value = "";
  renderModalTechniques(s.techniques ?? []);

  modalBackdrop.hidden = false;
  skillModal.hidden = false;
  closeModalBtn.focus();
}

function renderModalTechniques(techniques) {
  const list = safeArray(techniques).slice().sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));

  modalTechniques.innerHTML = "";
  if (list.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No techniques yet.";
    modalTechniques.appendChild(li);
    return;
  }

  for (const t of list) {
    const li = document.createElement("li");
    li.textContent = `Level ${t.level}: ${t.name}`;
    modalTechniques.appendChild(li);
  }
}

function closeSkillModal() {
  modalBackdrop.hidden = true;
  skillModal.hidden = true;
  if (lastFocusedEl && typeof lastFocusedEl.focus === "function") lastFocusedEl.focus();
}

function isModalOpen() {
  return !skillModal.hidden;
}

// ---------- XP persistence ----------
function rebuildXpFromLocalLog() {
  xpBySkill = new Map();
  for (const entry of xpLog) {
    const sid = entry.skillId;
    const amt = Number(entry.xp ?? 0);
    if (!skillById.has(sid)) continue;
    xpBySkill.set(sid, (xpBySkill.get(sid) ?? 0) + amt);
  }
}

async function rebuildXpFromFolderLog() {
  xpBySkill = new Map();
  const lines = folderHandle ? await readAllLines(folderHandle, XP_FILE) : [];
  for (const line of lines) {
    try {
      const entry = JSON.parse(line);
      const sid = entry.skillId;
      const amt = Number(entry.xp ?? 0);
      if (!skillById.has(sid)) continue;
      xpBySkill.set(sid, (xpBySkill.get(sid) ?? 0) + amt);
    } catch {
      // ignore malformed lines
    }
  }
}

async function addXp() {
  const sid = skillSelect.value;
  const skill = skillById.get(sid);
  if (!skill) return;

  const technique = techniqueInput.value.trim();
  const activity = activitySelect.value;
  const note = noteInput.value.trim();

  const xp = 5;

  const entry = {
    ts: new Date().toISOString(),
    skillId: sid,
    skillName: skill.name,
    activity,
    technique: technique || null,
    note: note || null,
    xp,
  };

  // Always write to localStorage log
  xpLog.push(entry);
  saveLocalLog(xpLog);

  // Also write to folder log if enabled
  if (folderHandle) {
    try {
      await appendLineToFile(folderHandle, XP_FILE, JSON.stringify(entry));
    } catch {
      // ignore folder write errors
    }
  }

  xpBySkill.set(sid, (xpBySkill.get(sid) ?? 0) + xp);

  techniqueInput.value = "";
  noteInput.value = "";
  renderAll();
}

// ---------- Init wiring ----------
function setFolderStatus() {
  const folderPanel = document.getElementById("folderPanel");
  if (!folderStatus) return;

  if (folderHandle) {
    folderStatus.textContent = "Folder chosen ✓";
    if (folderPanel) folderPanel.hidden = true;   // <-- hide after chosen
  } else if (canUseFolderPicker()) {
    folderStatus.textContent = "No folder chosen";
    if (folderPanel) folderPanel.hidden = false;  // <-- show if not chosen
  } else {
    folderStatus.textContent = "Folder saving unavailable (using local storage)";
    if (folderPanel) folderPanel.hidden = false;
  }
}

function wireFolderButton() {
  if (!chooseFolderBtn) return;

  if (!canUseFolderPicker()) {
    chooseFolderBtn.disabled = true;
    chooseFolderBtn.title = "Folder picker requires https:// or http://localhost";
    return;
  }

  chooseFolderBtn.addEventListener("click", async () => {
    try {
      folderHandle = await window.showDirectoryPicker();
      setFolderStatus();

      // Rebuild XP from folder (authoritative if chosen)
      await rebuildXpFromFolderLog();
      renderAll();
    } catch {
      // user cancelled
    }
  });
}

function refreshSkillsFromRegistry() {
  const raw = safeArray(window.ACAD_RS_SKILLS);
  skills = raw.map(normalizeSkill);

  // If someone forgot category, keep physics as default.
  // If you later add math skills, set category:"math" in that skill file.

  skillById = new Map(skills.map(s => [s.id, s]));
}

function setupCustomDropdowns() {
  enhanceSelect(skillSelect, {
    formatOption: (opt) => opt.textContent
  });
  enhanceSelect(activitySelect, {
    formatOption: (opt) => opt.textContent
  });
}

// ---------- DOMContentLoaded entry ----------
document.addEventListener("DOMContentLoaded", () => {
  // DOM
  chooseFolderBtn = document.getElementById("chooseFolderBtn");
  folderStatus = document.getElementById("folderStatus");

  skillGridPhysics = document.getElementById("skillGridPhysics");
  skillGridElite = document.getElementById("skillGridElite");
  skillGridMath = document.getElementById("skillGridMath");

  skillSelect = document.getElementById("skillSelect");
  techniqueInput = document.getElementById("techniqueInput");
  techniqueList = document.getElementById("techniqueList");
  activitySelect = document.getElementById("activitySelect");
  noteInput = document.getElementById("noteInput");
  addXpBtn = document.getElementById("addXpBtn");

  // Modal
  modalBackdrop = document.getElementById("modalBackdrop");
  skillModal = document.getElementById("skillModal");
  closeModalBtn = document.getElementById("closeModalBtn");
  modalTitle = document.getElementById("modalTitle");
  modalSubtitle = document.getElementById("modalSubtitle");
  modalDescription = document.getElementById("modalDescription");
  modalMilestones = document.getElementById("modalMilestones");
  modalTechniques = document.getElementById("modalTechniques");
  modalTechniqueSearch = document.getElementById("modalTechniqueSearch");

  // Suggested chips container (created dynamically if not present)
  // We'll insert under Add XP panel (after .xpRow).
  const panel = document.querySelector("section.panel");
  // NOTE: your first panel is folder. Add XP panel is the second panel.
  // Safer: locate the Add XP button then find its closest .panel.
  const addXpPanel = addXpBtn ? addXpBtn.closest(".panel") : null;

  if (addXpPanel) {
    // Create suggestion row if it doesn't exist
    suggestRow = addXpPanel.querySelector(".suggestRow");
    if (!suggestRow) {
      suggestRow = document.createElement("div");
      suggestRow.className = "suggestRow muted small";
      suggestRow.textContent = "Suggested techniques (based on your current level):";
      addXpPanel.appendChild(suggestRow);
    }

    chipRow = addXpPanel.querySelector(".chipRow");
    if (!chipRow) {
      chipRow = document.createElement("div");
      chipRow.className = "chipRow";
      addXpPanel.appendChild(chipRow);
    }
  }

  // Load skills from registry
  refreshSkillsFromRegistry();

  // Load XP log from localStorage
  xpLog = loadLocalLog();
  rebuildXpFromLocalLog();

  setFolderStatus();
  wireFolderButton();

  // Modal close handlers
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isModalOpen()) closeSkillModal();
  });
  modalBackdrop.addEventListener("click", () => closeSkillModal());
  closeModalBtn.addEventListener("click", () => closeSkillModal());

  // Technique filter in modal
  modalTechniqueSearch.addEventListener("input", () => {
    const sid = findSkillIdByModalTitle();
    const s = skillById.get(sid);
    if (!s) return;

    const q = modalTechniqueSearch.value.trim().toLowerCase();
    const list = safeArray(s.techniques).filter(t => t.name.toLowerCase().includes(q));
    renderModalTechniques(list);
  });

  function findSkillIdByModalTitle() {
    const raw = modalTitle.textContent.replace(" (Elite)", "").trim();
    const match = skills.find(s => s.name === raw);
    return match ? match.id : "";
  }

  // UI wiring
  skillSelect.addEventListener("change", () => {
    updateTechniqueDatalist();
    renderSuggestions();
  });
  addXpBtn.addEventListener("click", () => addXp());

  // Initial render
  renderAll();

  // Install pretty dropdown UI (after options exist)
  setupCustomDropdowns();
  // and refresh once
  if (skillSelect._cSelectRefresh) skillSelect._cSelectRefresh();
  if (activitySelect._cSelectRefresh) activitySelect._cSelectRefresh();
});
