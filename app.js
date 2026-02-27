// app.js
// Core app logic for Academic RuneScape (no server).
// Uses File System Access API to persist xp_log.jsonl in a user-chosen folder.
// Skill definitions are loaded via <script> tags into window.ACAD_RS_SKILLS.

let dataDirHandle = null;
let xpLogFileHandle = null;
let xpLog = [];

const skills = (window.ACAD_RS_SKILLS || []);

// -----------------------------
// RuneScape XP curve (classic)
// -----------------------------
function rsXpForLevel(level) {
  let points = 0;
  for (let i = 1; i < level; i++) {
    points += Math.floor(i + 300 * Math.pow(2, i / 7));
  }
  return Math.floor(points / 4);
}

function levelFromXp(xp, cap) {
  for (let lvl = 1; lvl <= cap; lvl++) {
    if (xp < rsXpForLevel(lvl + 1)) return lvl;
  }
  return cap;
}

// -----------------------------
// XP award model (simple v1)
// -----------------------------
function computeXp(activity, unlockLevel) {
  const base = unlockLevel * 5; // v1 scaling constant
  const multipliers = {
    reading: 1,
    derivation: 2,
    problems: 4,
    chapter: 10,
    book: 50
  };
  return Math.floor(base * (multipliers[activity] ?? 1));
}

// -----------------------------
// Technique dropdown helpers
// -----------------------------
function populateTechniqueList(skillId) {
  const list = document.getElementById("techniqueList");
  const input = document.getElementById("techniqueInput");

  list.innerHTML = "";
  input.value = "";

  const skill = skills.find(s => s.id === skillId);
  const techniques = skill?.techniques || [];

  for (const t of techniques) {
    const opt = document.createElement("option");
    opt.value = `${t.name} (L${t.level})`;
    list.appendChild(opt);
  }
}

function parseUnlockLevelFromTechnique(text) {
  // Expect "... (L65)" at end
  const m = text.match(/\(L(\d+)\)\s*$/);
  if (!m) return null;
  return parseInt(m[1], 10);
}

// -----------------------------
// IndexedDB handle persistence
// -----------------------------
function openHandlesDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("academic-runescape", 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("handles");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveHandle(handle) {
  const db = await openHandlesDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction("handles", "readwrite");
    tx.objectStore("handles").put(handle, "dataDir");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function loadHandle() {
  const db = await openHandlesDb();
  return await new Promise((resolve) => {
    const tx = db.transaction("handles", "readonly");
    const store = tx.objectStore("handles");
    const getReq = store.get("dataDir");
    getReq.onsuccess = () => resolve(getReq.result || null);
    getReq.onerror = () => resolve(null);
  });
}

// -----------------------------
// File I/O
// -----------------------------
async function chooseFolder() {
  dataDirHandle = await window.showDirectoryPicker();
  await saveHandle(dataDirHandle);
  await initDataFiles();
}

async function initDataFiles() {
  xpLogFileHandle = await dataDirHandle.getFileHandle("xp_log.jsonl", { create: true });
  await loadXpLog();
  initUI();
}

async function loadXpLog() {
  const file = await xpLogFileHandle.getFile();
  const text = await file.text();

  xpLog = text
    .split("\n")
    .filter(line => line.trim() !== "")
    .map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

// -----------------------------
// Aggregation
// -----------------------------
function totalXpForSkill(skillId) {
  return xpLog
    .filter(entry => entry.skill === skillId)
    .reduce((sum, entry) => sum + (entry.xp || 0), 0);
}

// -----------------------------
// UI
// -----------------------------
function initUI() {
  document.getElementById("folderSelect").style.display = "none";
  document.getElementById("app").style.display = "block";

  const skillSelect = document.getElementById("skillSelect");
  skillSelect.innerHTML = "";

  // Populate skills dropdown
  for (const skill of skills) {
    const option = document.createElement("option");
    option.value = skill.id;
    option.textContent = skill.name;
    skillSelect.appendChild(option);
  }

  // Technique list reacts to selected skill
  populateTechniqueList(skillSelect.value);
  skillSelect.addEventListener("change", (e) => populateTechniqueList(e.target.value));

  renderSkills();
}

function renderSkills() {
  const grid = document.getElementById("skillGrid");
  grid.innerHTML = "";

  for (const skill of skills) {
    const xp = totalXpForSkill(skill.id);
    const lvl = levelFromXp(xp, skill.cap);

    const nextXp = rsXpForLevel(lvl + 1);
    const prevXp = rsXpForLevel(lvl);

    const denom = (nextXp - prevXp) || 1;
    const progress = Math.max(0, Math.min(100, ((xp - prevXp) / denom) * 100));

    const card = document.createElement("div");
    card.className = "skillCard";
    card.innerHTML = `
      <h3>${skill.name}</h3>
      <p>Level ${lvl}</p>
      <p>${xp.toLocaleString()} XP</p>
      <div class="progressBar">
        <div class="progressFill" style="width:${progress}%"></div>
      </div>
    `;
    grid.appendChild(card);
  }
}

async function addXp() {
  const skillId = document.getElementById("skillSelect").value;
  const techniqueText = document.getElementById("techniqueInput").value.trim();
  const activity = document.getElementById("activityType").value;
  const note = document.getElementById("note").value;

  const unlockLevel = parseUnlockLevelFromTechnique(techniqueText);
  if (!unlockLevel || unlockLevel <= 0) {
    alert("Pick a technique from the list (must end with something like (L65)).");
    return;
  }

  const xp = computeXp(activity, unlockLevel);

  const entry = {
    ts: new Date().toISOString(),
    skill: skillId,
    technique: techniqueText.replace(/\s*\(L\d+\)\s*$/, ""), // store name cleanly
    unlockLevel,
    activity,
    xp,
    note
  };

  const writable = await xpLogFileHandle.createWritable({ keepExistingData: true });
  await writable.write(JSON.stringify(entry) + "\n");
  await writable.close();

  xpLog.push(entry);
  renderSkills();

  // Clear inputs
  document.getElementById("techniqueInput").value = "";
  document.getElementById("note").value = "";
}

// -----------------------------
// Wire up events
// -----------------------------
document.getElementById("chooseFolder").addEventListener("click", chooseFolder);
document.getElementById("addXp").addEventListener("click", addXp);

// Auto-load saved folder on startup
window.addEventListener("DOMContentLoaded", async () => {
  // If skills didn't load, fail loudly (usually means missing script tags)
  if (!skills.length) {
    console.warn("No skills loaded. Check index.html skill <script> tags.");
  }

  const savedHandle = await loadHandle();
  if (savedHandle) {
    dataDirHandle = savedHandle;
    await initDataFiles();
  }
});