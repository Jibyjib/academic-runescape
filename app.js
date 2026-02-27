// app.js
// Academic RuneScape (file:// friendly)
// - Skills are loaded by classic <script src="skills/..."> tags into window.ACAD_RS_SKILLS
// - XP persistence: localStorage by default
// - Optional: File System Access API if available + user picks a folder (NOT required)

const XP_FILE = "xp_log.jsonl";
const LS_KEY = "academic_runescape_xp_log_v1";

// ---------- State ----------
let folderHandle = null;

// Skills registry (global)
let skills = [];
let skillById = new Map();

// XP state
let xpBySkill = new Map();     // id -> total xp
let xpLog = [];                // array of entries (localStorage)

// ---------- Helpers ----------
function clamp01(x) { return Math.max(0, Math.min(1, x)); }

// Simple OSRS-ish leveling curve (replace later if you want)
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

// Techniques are objects: { level: number, name: string }
function normalizeTechniques(raw) {
  const arr = Array.isArray(raw) ? raw : [];
  const cleaned = arr
    .filter(t => t && typeof t === "object")
    .map(t => ({
      level: Number(t.level ?? 0),
      name: String(t.name ?? "").trim(),
    }))
    .filter(t => t.name.length > 0 && Number.isFinite(t.level));

  cleaned.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  return cleaned;
}

// Suggest up to N techniques at/above current level; fallback to last N
function getSuggestedTechniques(techniquesRaw, currentLevel, maxCount = 3) {
  const sorted = normalizeTechniques(techniquesRaw);
  if (sorted.length === 0) return [];

  let nextUp = sorted.filter(t => t.level >= currentLevel);
  if (nextUp.length === 0) nextUp = sorted.slice(-maxCount);

  return nextUp.slice(0, maxCount);
}

// Add defaults so skills don't disappear if fields are omitted
function withDefaults(s) {
  return {
    category: s.category ?? "physics",
    isElite: s.isElite ?? (s.cap === 120),
    description: s.description ?? "",
    milestones: Array.isArray(s.milestones) ? s.milestones : [],
    techniques: Array.isArray(s.techniques) ? s.techniques : [],
    ...s,
  };
}

// ---------- Folder (optional) ----------
function canUseFolderPicker() {
  return !!(window.isSecureContext && window.showDirectoryPicker);
}

function setFolderStatus(folderStatusEl) {
  if (!folderStatusEl) return;
  if (folderHandle) {
    folderStatusEl.textContent = "Folder chosen ✓";
  } else if (canUseFolderPicker()) {
    folderStatusEl.textContent = "No folder chosen";
  } else {
    folderStatusEl.textContent = "Folder saving unavailable (using local storage)";
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

// ---------- Skills (loaded from window.ACAD_RS_SKILLS) ----------
function refreshSkillsFromRegistry() {
  // Required pattern:
  //   let skills = window.ACAD_RS_SKILLS || [];
  //   let skillById = new Map(skills.map(s => [s.id, s]));
  const raw = window.ACAD_RS_SKILLS || [];
  skills = raw.map(withDefaults);
  skillById = new Map(skills.map(s => [s.id, s]));
}

// ---------- XP rebuild ----------
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

// ---------- Rendering ----------
function renderSkillCard(skill, openSkillModal) {
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

function renderAll(dom, openSkillModal) {
  const {
    skillGridPhysics,
    skillGridElite,
    skillGridMath,
    skillSelect,
  } = dom;

  skillGridPhysics.innerHTML = "";
  skillGridElite.innerHTML = "";
  skillGridMath.innerHTML = "";

  const physics = skills.filter(s => s.category === "physics" && !s.isElite);
  const elite = skills.filter(s => s.category === "physics" && s.isElite);
  const math = skills.filter(s => s.category === "math");

  for (const s of physics) skillGridPhysics.appendChild(renderSkillCard(s, openSkillModal));
  for (const s of elite) skillGridElite.appendChild(renderSkillCard(s, openSkillModal));
  for (const s of math) skillGridMath.appendChild(renderSkillCard(s, openSkillModal));

  // Skill dropdown
  skillSelect.innerHTML = "";
  for (const s of skills) {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.isElite ? `${s.name} (Elite)` : s.name;
    skillSelect.appendChild(opt);
  }
}

function updateTechniqueDatalist(dom) {
  const { skillSelect, techniqueList } = dom;
  const sid = skillSelect.value;
  const s = skillById.get(sid);

  techniqueList.innerHTML = "";
  if (!s) return;

  const techniques = normalizeTechniques(s.techniques);
  for (const t of techniques) {
    const opt = document.createElement("option");
    opt.value = t.name; // show technique.name only
    techniqueList.appendChild(opt);
  }
}

// ---------- Modal ----------
function makeModalController(dom) {
  const {
    modalBackdrop,
    skillModal,
    closeModalBtn,
    modalTitle,
    modalSubtitle,
    modalDescription,
    modalMilestones,
    modalSuggestedTechniques,
    modalTechniques,
    modalTechniqueSearch,
  } = dom;

  let lastFocusedEl = null;

  function isModalOpen() {
    return !skillModal.hidden;
  }

  function findSkillIdByModalTitle() {
    const raw = modalTitle.textContent.replace(" (Elite)", "").trim();
    const match = skills.find(s => s.name === raw);
    return match ? match.id : "";
  }

  function renderModalTechniques(techniquesRaw) {
    modalTechniques.innerHTML = "";

    const techniques = normalizeTechniques(techniquesRaw);
    if (techniques.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No techniques yet.";
      modalTechniques.appendChild(li);
      return;
    }

    for (const t of techniques) {
      const li = document.createElement("li");
      li.textContent = `Level ${t.level}: ${t.name}`;
      modalTechniques.appendChild(li);
    }
  }

  function renderSuggested(techniquesRaw, currentLevel) {
    modalSuggestedTechniques.innerHTML = "";
    const suggested = getSuggestedTechniques(techniquesRaw, currentLevel, 3);

    if (suggested.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No suggestions yet.";
      modalSuggestedTechniques.appendChild(li);
      return;
    }

    for (const t of suggested) {
      const li = document.createElement("li");
      li.textContent = `Level ${t.level}: ${t.name}`;
      modalSuggestedTechniques.appendChild(li);
    }
  }

  function openSkillModal(skillId) {
    const s = skillById.get(skillId);
    if (!s) return;

    lastFocusedEl = document.activeElement;

    const xp = xpBySkill.get(skillId) ?? 0;
    const { lvl } = progressToNextLevel(xp);

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

    // Suggested next (max 3 based on current level)
    renderSuggested(s.techniques ?? [], lvl);

    // Full Techniques
    modalTechniqueSearch.value = "";
    renderModalTechniques(s.techniques ?? []);

    modalBackdrop.hidden = false;
    skillModal.hidden = false;
    closeModalBtn.focus();
  }

  function closeSkillModal() {
    modalBackdrop.hidden = true;
    skillModal.hidden = true;
    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") lastFocusedEl.focus();
  }

  // ESC + backdrop click + close button
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isModalOpen()) closeSkillModal();
  });
  modalBackdrop.addEventListener("click", () => closeSkillModal());
  closeModalBtn.addEventListener("click", () => closeSkillModal());

  // Technique filter (object-aware)
  modalTechniqueSearch.addEventListener("input", () => {
    const sid = findSkillIdByModalTitle();
    const s = skillById.get(sid);
    if (!s) return;

    const q = modalTechniqueSearch.value.trim().toLowerCase();
    const filtered = normalizeTechniques(s.techniques).filter(t =>
      t.name.toLowerCase().includes(q)
    );
    renderModalTechniques(filtered);
  });

  return { openSkillModal, closeSkillModal, isModalOpen };
}

// ---------- XP add ----------
async function addXp(dom) {
  const { skillSelect, techniqueInput, activitySelect, noteInput } = dom;

  const sid = skillSelect.value;
  const skill = skillById.get(sid);
  if (!skill) return;

  const techniqueName = techniqueInput.value.trim();
  const activity = activitySelect.value;
  const note = noteInput.value.trim();

  const xp = 5;

  const entry = {
    ts: new Date().toISOString(),
    skillId: sid,
    skillName: skill.name,
    activity,
    technique: techniqueName || null,
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
}

// ---------- Folder wiring ----------
function wireFolderButton(dom, rerender) {
  const { chooseFolderBtn, folderStatus } = dom;
  if (!chooseFolderBtn) return;

  if (!canUseFolderPicker()) {
    chooseFolderBtn.disabled = true;
    chooseFolderBtn.title = "Folder picker requires https:// or http://localhost";
    setFolderStatus(folderStatus);
    return;
  }

  chooseFolderBtn.addEventListener("click", async () => {
    try {
      folderHandle = await window.showDirectoryPicker();
      setFolderStatus(folderStatus);

      // Rebuild XP from folder (authoritative if chosen)
      await rebuildXpFromFolderLog();
      rerender();
    } catch {
      // user cancelled
    }
  });

  setFolderStatus(folderStatus);
}

// ---------- Init (after DOM + after skill scripts) ----------
document.addEventListener("DOMContentLoaded", () => {
  const dom = {
    chooseFolderBtn: document.getElementById("chooseFolderBtn"),
    folderStatus: document.getElementById("folderStatus"),

    skillGridPhysics: document.getElementById("skillGridPhysics"),
    skillGridElite: document.getElementById("skillGridElite"),
    skillGridMath: document.getElementById("skillGridMath"),

    skillSelect: document.getElementById("skillSelect"),
    techniqueInput: document.getElementById("techniqueInput"),
    techniqueList: document.getElementById("techniqueList"),
    activitySelect: document.getElementById("activitySelect"),
    noteInput: document.getElementById("noteInput"),
    addXpBtn: document.getElementById("addXpBtn"),

    modalBackdrop: document.getElementById("modalBackdrop"),
    skillModal: document.getElementById("skillModal"),
    closeModalBtn: document.getElementById("closeModalBtn"),
    modalTitle: document.getElementById("modalTitle"),
    modalSubtitle: document.getElementById("modalSubtitle"),
    modalDescription: document.getElementById("modalDescription"),
    modalMilestones: document.getElementById("modalMilestones"),
    modalSuggestedTechniques: document.getElementById("modalSuggestedTechniques"),
    modalTechniques: document.getElementById("modalTechniques"),
    modalTechniqueSearch: document.getElementById("modalTechniqueSearch"),
  };

  // Skill scripts have already executed because index.html loads them before app.js
  refreshSkillsFromRegistry();

  const modal = makeModalController(dom);

  function rerender() {
    renderAll(dom, modal.openSkillModal);
    updateTechniqueDatalist(dom);
  }

  // XP load from localStorage
  xpLog = loadLocalLog();
  rebuildXpFromLocalLog();

  // Wire UI
  wireFolderButton(dom, rerender);

  dom.skillSelect.addEventListener("change", () => updateTechniqueDatalist(dom));
  dom.addXpBtn.addEventListener("click", async () => {
    await addXp(dom);
    rerender();
  });

  // Initial render
  rerender();
});
