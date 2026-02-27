// app.js
// Core app logic for Academic RuneScape (NO SERVER / file:// friendly).
// Skills are loaded via <script src="skills/..."> tags into window.ACAD_RS_SKILLS
// XP persistence: localStorage by default
// Optional: File System Access API if available + user picks a folder (kept, but not required)

(() => {
  const XP_FILE = "xp_log.jsonl";
  const LS_KEY = "academic_runescape_xp_log_v1";

  // ---------- Helpers ----------
  function clamp01(x) { return Math.max(0, Math.min(1, x)); }

  // Level curve (your current curve)
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

  function normStr(s) { return (s ?? "").toString(); }

  // Skill accent mapping (your requested vibes)
  const SKILL_ACCENTS = {
    classical_mechanics: "#d97706", // Taylor-ish orange/amber
    em: "#22c55e",                  // green
    thermo_statmech: "#ef4444",     // red
    qm: "#8b5cf6",                  // violet
    qft: "#6366f1",                 // indigo/violet
    gr: "#14b8a6",                  // Carroll-ish teal
    cosmo: "#0b0d10",               // black (special rainbow strip via CSS class)
  };

  function accentForSkill(skillId) {
    return SKILL_ACCENTS[skillId] || "#7c5cff";
  }

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
      // ignore (storage might be disabled)
    }
  }

  // ---------- App state ----------
  let skills = [];
  let skillById = new Map();

  let xpBySkill = new Map(); // id -> total xp
  let xpLog = [];            // array of entries (localStorage)

  // ---------- DOM refs (set on DOMContentLoaded) ----------
  let chooseFolderBtn, folderStatus, folderPanel;
  let skillGridPhysics, skillGridElite, skillGridMath;
  let skillSelect, techniqueInput, techniqueList, activitySelect, noteInput, addXpBtn;
  let suggestedTechniques;

  // Modal
  let modalBackdrop, skillModal, closeModalBtn;
  let modalTitle, modalSubtitle, modalDescription, modalMilestones, modalTechniques, modalTechniqueSearch;

  // ---------- Skills registry ----------
  function refreshSkillsFromRegistry() {
    skills = Array.isArray(window.ACAD_RS_SKILLS) ? window.ACAD_RS_SKILLS : [];
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

  // ---------- UI helpers ----------
  function setFolderStatus() {
    if (!folderStatus) return;

    if (folderHandle) {
      folderStatus.textContent = "Folder chosen ✓";
      if (folderPanel) folderPanel.hidden = true; // hide once chosen
    } else if (canUseFolderPicker()) {
      folderStatus.textContent = "No folder chosen";
      if (folderPanel) folderPanel.hidden = false;
    } else {
      folderStatus.textContent = "Folder saving unavailable (using local storage)";
      if (folderPanel) folderPanel.hidden = false;
    }
  }

function renderAll() {
  if (!skillGridPhysics) return;

  skillGridPhysics.innerHTML = "";
  skillGridElite.innerHTML = "";
  skillGridMath.innerHTML = "";

  // ------------------------------------------------------------
  // Classification WITHOUT relying on category/isElite fields.
  // Elite proxy: cap >= 120.
  // Math proxy: explicit id set (empty for now since you said no math yet).
  // ------------------------------------------------------------
  const MATH_IDS = new Set([
    // add later when you create math skills, e.g.:
    // "real_analysis", "complex_analysis", "linear_algebra", "topology"
  ]);

  const isMath = (s) => MATH_IDS.has(s.id);
  const isElite = (s) => Number(s.cap ?? 99) >= 120;

  const physics = skills.filter(s => !isMath(s) && !isElite(s));
  const elite   = skills.filter(s => !isMath(s) &&  isElite(s));
  const math    = skills.filter(s =>  isMath(s));

  for (const s of physics) skillGridPhysics.appendChild(renderSkillCard(s));
  for (const s of elite)   skillGridElite.appendChild(renderSkillCard(s));
  for (const s of math)    skillGridMath.appendChild(renderSkillCard(s));

  // Skill dropdown
  skillSelect.innerHTML = "";
  for (const s of skills) {
    const opt = document.createElement("option");
    opt.value = s.id;

    const eliteLabel = isElite(s) ? " (Elite)" : "";
    opt.textContent = `${s.name}${eliteLabel}`;

    skillSelect.appendChild(opt);
  }

  // keep selection stable if possible
  if (!skillSelect.value && skills.length) skillSelect.value = skills[0].id;

  updateTechniqueUI();
}
  function renderSkillCard(skill) {
    const xp = xpBySkill.get(skill.id) ?? 0;
    const { lvl, frac } = progressToNextLevel(xp);

    const card = document.createElement("div");
    card.className = "skillCard";
    card.style.setProperty("--skill-accent", accentForSkill(skill.id));

    if (skill.isElite) card.classList.add("skillCard--elite");
    if (skill.id === "cosmo") card.classList.add("skillCard--cosmo");

    const top = document.createElement("div");
    top.className = "skillCardTop";

    const titleBtn = document.createElement("button");
    titleBtn.className = "skillTitleBtn";
    titleBtn.type = "button";
    titleBtn.textContent = skill.name;
    titleBtn.addEventListener("click", () => openSkillModal(skill.id));

    const badge = document.createElement("div");
    badge.className = "skillBadge";
    badge.textContent = skill.isElite ? "Elite" : (skill.category === "math" ? "Math" : "Physics");

    top.appendChild(titleBtn);
    top.appendChild(badge);

    const meta = document.createElement("div");
    meta.className = "skillMeta";
    meta.textContent = `Level ${lvl} · ${xp} XP`;

    const bar = document.createElement("div");
    bar.className = "progressBar";
    const fill = document.createElement("div");
    fill.className = "progressFill";
    fill.style.width = `${Math.floor(frac * 100)}%`;
    bar.appendChild(fill);

    card.appendChild(top);
    card.appendChild(meta);
    card.appendChild(bar);

    return card;
  }

  // ---------- Technique suggestions + datalist ----------
  function getSortedTechniques(skill) {
    const arr = Array.isArray(skill?.techniques) ? skill.techniques.slice() : [];
    arr.sort((a, b) => (a.level ?? 0) - (b.level ?? 0));
    return arr;
  }

  function computeSuggestedTechniques(skillId) {
    const skill = skillById.get(skillId);
    if (!skill) return [];

    const xp = xpBySkill.get(skillId) ?? 0;
    const { lvl } = progressToNextLevel(xp);

    const all = getSortedTechniques(skill);
    if (all.length === 0) return [];

    // "Next up" window: prioritize things at/just above your current level,
    // but allow a bit below as refresh.
    const below = all.filter(t => t.level <= lvl && t.level >= lvl - 8);
    const above = all.filter(t => t.level > lvl && t.level <= lvl + 8);

    let picks = [];

    // Prefer above (progress), then fill with below (review)
    for (const t of above) {
      picks.push(t);
      if (picks.length >= 3) break;
    }
    if (picks.length < 3) {
      for (let i = below.length - 1; i >= 0 && picks.length < 3; i--) {
        picks.push(below[i]);
      }
    }
    // If still short, just grab nearest above
    if (picks.length < 3) {
      const rest = all.filter(t => !picks.includes(t) && t.level > lvl);
      for (const t of rest) {
        picks.push(t);
        if (picks.length >= 3) break;
      }
    }

    // stable sort by level
    picks.sort((a, b) => (a.level ?? 0) - (b.level ?? 0));
    return picks.slice(0, 3);
  }

  function updateTechniqueUI() {
    updateTechniqueDatalist();
    renderSuggestedChips();
  }

  function updateTechniqueDatalist() {
    const sid = skillSelect.value;
    const s = skillById.get(sid);
    techniqueList.innerHTML = "";
    if (!s) return;

    const xp = xpBySkill.get(sid) ?? 0;
    const { lvl } = progressToNextLevel(xp);

    const all = getSortedTechniques(s);

    // Limit the datalist so clicking the field doesn't show 200+ items:
    // keep a level window + a few "next-up" techniques.
    const windowMin = Math.max(1, lvl - 10);
    const windowMax = lvl + 10;

    const inWindow = all.filter(t => t.level >= windowMin && t.level <= windowMax);
    const nextUp = all.filter(t => t.level > lvl).slice(0, 10);
    const suggestions = computeSuggestedTechniques(sid);

    const merged = [];
    const seen = new Set();

    function addTech(t) {
      const key = `${t.level}|${t.name}`;
      if (seen.has(key)) return;
      seen.add(key);
      merged.push(t);
    }

    for (const t of suggestions) addTech(t);
    for (const t of nextUp) addTech(t);
    for (const t of inWindow) addTech(t);

    // cap to avoid huge lists
    merged.sort((a, b) => (a.level ?? 0) - (b.level ?? 0));
    const capped = merged.slice(0, 5);

    for (const t of capped) {
      const opt = document.createElement("option");
      opt.value = t.name; // show technique.name, not object
      techniqueList.appendChild(opt);
    }
  }

  function renderSuggestedChips() {
    if (!suggestedTechniques) return;

    const sid = skillSelect.value;
    const picks = computeSuggestedTechniques(sid);

    suggestedTechniques.innerHTML = "";

    if (picks.length === 0) {
      const span = document.createElement("div");
      span.className = "muted small";
      span.textContent = "No techniques found for this skill yet.";
      suggestedTechniques.appendChild(span);
      return;
    }

    for (const t of picks) {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.style.setProperty("--chip-accent", accentForSkill(sid));
      chip.textContent = `Level ${t.level}: ${t.name}`;
      chip.addEventListener("click", () => {
        techniqueInput.value = t.name;
        techniqueInput.focus();
      });
      suggestedTechniques.appendChild(chip);
    }
  }

  // ---------- Modal ----------
  let lastFocusedEl = null;

  function openSkillModal(skillId) {
    const s = skillById.get(skillId);
    if (!s) return;

    lastFocusedEl = document.activeElement;

    // modal accent
    skillModal.style.setProperty("--skill-accent", accentForSkill(skillId));
    skillModal.classList.toggle("modal--cosmo", skillId === "cosmo");

    modalTitle.textContent = s.isElite ? `${s.name} (Elite)` : s.name;
    modalSubtitle.textContent = s.category === "physics" ? "Physics skill" : "Math skill";
    modalDescription.textContent = s.description ?? "";

    // Milestones
    modalMilestones.innerHTML = "";
    const ms = Array.isArray(s.milestones) ? s.milestones.slice() : [];
    ms.sort((a, b) => (a.level ?? 0) - (b.level ?? 0));

    if (ms.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No milestones yet.";
      modalMilestones.appendChild(li);
    } else {
      for (const m of ms) {
        const li = document.createElement("li");
        li.textContent = `Level ${m.level}: ${m.text}`;
        modalMilestones.appendChild(li);
      }
    }

    modalTechniqueSearch.value = "";
    renderModalTechniques(getSortedTechniques(s));

    modalBackdrop.hidden = false;
    skillModal.hidden = false;
    closeModalBtn.focus();
  }

  function renderModalTechniques(techniques) {
    modalTechniques.innerHTML = "";
    if (!techniques || techniques.length === 0) {
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

  function closeSkillModal() {
    modalBackdrop.hidden = true;
    skillModal.hidden = true;
    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") lastFocusedEl.focus();
  }

  function isModalOpen() {
    return !skillModal.hidden;
  }

  // ---------- Add XP ----------
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

  // ---------- Wiring ----------
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

        // Rebuild XP from folder log (authoritative once chosen)
        await rebuildXpFromFolderLog();

        renderAll();
      } catch {
        // user cancelled
      }
    });
  }

  // ---------- Init ----------
  document.addEventListener("DOMContentLoaded", () => {
    // DOM refs
    folderPanel = document.getElementById("folderPanel");
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

    suggestedTechniques = document.getElementById("suggestedTechniques");

    modalBackdrop = document.getElementById("modalBackdrop");
    skillModal = document.getElementById("skillModal");
    closeModalBtn = document.getElementById("closeModalBtn");
    modalTitle = document.getElementById("modalTitle");
    modalSubtitle = document.getElementById("modalSubtitle");
    modalDescription = document.getElementById("modalDescription");
    modalMilestones = document.getElementById("modalMilestones");
    modalTechniques = document.getElementById("modalTechniques");
    modalTechniqueSearch = document.getElementById("modalTechniqueSearch");

    // Skills
    refreshSkillsFromRegistry();

    // Load localStorage XP
    xpLog = loadLocalLog();
    rebuildXpFromLocalLog();

    setFolderStatus();
    wireFolderButton();

    // Modal close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isModalOpen()) closeSkillModal();
    });
    modalBackdrop.addEventListener("click", () => closeSkillModal());
    closeModalBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeSkillModal();
    });

    // technique filter in modal
    modalTechniqueSearch.addEventListener("input", () => {
      const sid = findSkillIdByModalTitle();
      const s = skillById.get(sid);
      if (!s) return;

      const q = modalTechniqueSearch.value.trim().toLowerCase();
      const list = getSortedTechniques(s).filter(t => normStr(t.name).toLowerCase().includes(q));
      renderModalTechniques(list);
    });

    function findSkillIdByModalTitle() {
      const raw = modalTitle.textContent.replace(" (Elite)", "").trim();
      const match = skills.find(s => s.name === raw);
      return match ? match.id : "";
    }

    // Add XP wiring
    skillSelect.addEventListener("change", () => updateTechniqueUI());
    addXpBtn.addEventListener("click", () => addXp());

    // Enter to submit (nice QoL)
    noteInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") addXp();
    });
    techniqueInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") addXp();
    });

    renderAll();
  });
})();
