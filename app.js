// app.js
// Core app logic for Academic RuneScape (NO SERVER / file:// friendly).
// - Skills are loaded via classic <script src="skills/..."> tags into window.SKILL_DEFS
// - XP persistence: localStorage by default
// - Optional: File System Access API if available + user picks a folder (kept, but not required)

const XP_FILE = "xp_log.jsonl";
const LS_KEY = "academic_runescape_xp_log_v1";

// ---------- DOM ----------
const chooseFolderBtn = document.getElementById("chooseFolderBtn");
const folderStatus = document.getElementById("folderStatus");

const skillGridPhysics = document.getElementById("skillGridPhysics");
const skillGridElite = document.getElementById("skillGridElite");
const skillGridMath = document.getElementById("skillGridMath");

const skillSelect = document.getElementById("skillSelect");
const techniqueInput = document.getElementById("techniqueInput");
const techniqueList = document.getElementById("techniqueList");
const activitySelect = document.getElementById("activitySelect");
const noteInput = document.getElementById("noteInput");
const addXpBtn = document.getElementById("addXpBtn");

// Modal
const modalBackdrop = document.getElementById("modalBackdrop");
const skillModal = document.getElementById("skillModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const modalDescription = document.getElementById("modalDescription");
const modalMilestones = document.getElementById("modalMilestones");
const modalTechniques = document.getElementById("modalTechniques");
const modalTechniqueSearch = document.getElementById("modalTechniqueSearch");

let folderHandle = null;

// ---------- Skills (loaded from window.SKILL_DEFS) ----------
let skills = Array.isArray(window.SKILL_DEFS) ? window.SKILL_DEFS : [];
let skillById = new Map(skills.map(s => [s.id, s]));

// ---------- State ----------
let xpBySkill = new Map();     // id -> total xp
let xpLog = [];                // array of entries (localStorage)

// ---------- Helpers ----------
function clamp01(x) { return Math.max(0, Math.min(1, x)); }

// Simple OSRS-ish leveling curve (you can replace later):
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

// ---------- Folder (optional) ----------
function canUseFolderPicker() {
  return !!(window.isSecureContext && window.showDirectoryPicker);
}

function setFolderStatus() {
  if (!folderStatus) return;
  if (folderHandle) {
    folderStatus.textContent = "Folder chosen ✓";
  } else if (canUseFolderPicker()) {
    folderStatus.textContent = "No folder chosen";
  } else {
    folderStatus.textContent = "Folder saving unavailable (using local storage)";
  }
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
    // ignore (storage might be disabled)
  }
}

// ---------- Rendering ----------
function renderAll() {
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
  updateTechniqueDatalist();
}

function renderSkillCard(skill) {
  const xp = xpBySkill.get(skill.id) ?? 0;
  const { lvl, frac } = progressToNextLevel(xp);

  const card = document.createElement("div");
  card.className = "skillCard";

  const titleBtn = document.createElement("button");
  titleBtn.className = "skillTitleBtn";
  titleBtn.type = "button";
  titleBtn.textContent = skill.name;
  titleBtn.addEventListener("click", () => openSkillModal(skill.id));

  const lvlEl = document.createElement("div");
  lvlEl.textContent = `Level ${lvl}`;

  const xpEl = document.createElement("div");
  xpEl.textContent = `${xp} XP`;

  const bar = document.createElement("div");
  bar.className = "progressBar";

  const fill = document.createElement("div");
  fill.className = "progressFill";
  fill.style.width = `${Math.floor(frac * 100)}%`;

  bar.appendChild(fill);

  card.appendChild(titleBtn);
  card.appendChild(document.createElement("div")).style.height = "6px";
  card.appendChild(lvlEl);
  card.appendChild(xpEl);
  card.appendChild(bar);

  return card;
}

function updateTechniqueDatalist() {
  const sid = skillSelect.value;
  const s = skillById.get(sid);
  techniqueList.innerHTML = "";
  if (!s) return;

  for (const t of (s.techniques ?? [])) {
    const opt = document.createElement("option");
    opt.value = t;
    techniqueList.appendChild(opt);
  }
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

  // Milestones
  modalMilestones.innerHTML = "";
  for (const m of (s.milestones ?? [])) {
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
  modalTechniques.innerHTML = "";
  if (techniques.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No techniques yet.";
    modalTechniques.appendChild(li);
    return;
  }
  for (const t of techniques) {
    const li = document.createElement("li");
    li.textContent = t;
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

// ESC + backdrop click
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && isModalOpen()) closeSkillModal();
});
modalBackdrop.addEventListener("click", () => closeSkillModal());
closeModalBtn.addEventListener("click", () => closeSkillModal());

// technique filter
modalTechniqueSearch.addEventListener("input", () => {
  const sid = findSkillIdByModalTitle();
  const s = skillById.get(sid);
  if (!s) return;

  const q = modalTechniqueSearch.value.trim().toLowerCase();
  const list = (s.techniques ?? []).filter(t => t.toLowerCase().includes(q));
  renderModalTechniques(list);
});

function findSkillIdByModalTitle() {
  const raw = modalTitle.textContent.replace(" (Elite)", "").trim();
  const match = skills.find(s => s.name === raw);
  return match ? match.id : "";
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

// ---------- Init ----------
function refreshSkillsFromRegistry() {
  skills = Array.isArray(window.SKILL_DEFS) ? window.SKILL_DEFS : [];
  skillById = new Map(skills.map(s => [s.id, s]));
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

      // Rebuild XP from folder (authoritative if you choose one)
      await rebuildXpFromFolderLog();

      // (Optional) also keep local totals in sync by rebuilding local too
      // xpLog = loadLocalLog(); rebuildXpFromLocalLog();

      renderAll();
    } catch {
      // user cancelled
    }
  });
}

(function init() {
  refreshSkillsFromRegistry();

  // localStorage XP load
  xpLog = loadLocalLog();
  rebuildXpFromLocalLog();

  setFolderStatus();
  wireFolderButton();

  skillSelect.addEventListener("change", () => updateTechniqueDatalist());
  addXpBtn.addEventListener("click", () => addXp());

  renderAll();
})();
