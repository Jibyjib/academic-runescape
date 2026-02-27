// app.js
// Core app logic for Academic RuneScape (no server).
// Uses File System Access API to persist xp_log.jsonl in a user-chosen folder.
// Skills are loaded from ./skills/*.js (each exports default skill object).

const XP_FILE = "xp_log.jsonl";

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

// ---------- Skills ----------
const skillModules = [
  "./skills/classical_mechanics.js",
  "./skills/electromagnetism.js",
  "./skills/quantum_mechanics.js",
  "./skills/general_relativity.js",
  "./skills/quantum_field_theory.js",
  "./skills/cosmology.js",
  "./skills/stat_mech.js",
  // math skills later: "./skills/real_analysis.js", etc
];

let skills = [];               // [{id, name, category, isElite, description, techniques, milestones}]
let skillById = new Map();     // id -> skill

// ---------- State ----------
let xpBySkill = new Map();     // id -> total xp

// ---------- Helpers ----------
function clamp01(x) { return Math.max(0, Math.min(1, x)); }

// Simple OSRS-ish leveling curve (you can replace later):
function levelFromXp(xp) {
  // Level 1 starts at 0 XP.
  // This curve grows roughly like n^3 / 10. Adjust whenever.
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

function setFolderStatus() {
  folderStatus.textContent = folderHandle ? "Folder chosen ✓" : "No folder chosen";
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

  // focus trap starter
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
  // modalTitle is derived from skill.name; find the first match
  const raw = modalTitle.textContent.replace(" (Elite)", "").trim();
  const match = skills.find(s => s.name === raw);
  return match ? match.id : "";
}

// ---------- XP persistence ----------
async function rebuildXpFromLog() {
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

  // For now: fixed XP per add. You can later compute this from activity/technique.
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

  if (folderHandle) {
    await appendLineToFile(folderHandle, XP_FILE, JSON.stringify(entry));
  }

  xpBySkill.set(sid, (xpBySkill.get(sid) ?? 0) + xp);

  techniqueInput.value = "";
  noteInput.value = "";
  renderAll();
}

// ---------- Init ----------
async function loadSkills() {
  const loaded = [];
  for (const path of skillModules) {
    const mod = await import(path);
    loaded.push(mod.default);
  }
  skills = loaded;
  skillById = new Map(skills.map(s => [s.id, s]));
}

chooseFolderBtn.addEventListener("click", async () => {
  try {
    folderHandle = await window.showDirectoryPicker();
    setFolderStatus();
    await rebuildXpFromLog();
    renderAll();
  } catch {
    // user cancelled
  }
});

skillSelect.addEventListener("change", () => updateTechniqueDatalist());
addXpBtn.addEventListener("click", () => addXp());

await loadSkills();
setFolderStatus();
renderAll();
