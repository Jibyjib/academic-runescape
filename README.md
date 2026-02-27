# 🧠 Academic Runescape

A gamified academic skill tree inspired by Runescape — but for physics, mathematics, and intellectual progression.

This project models academic growth as a nonlinear skill system where disciplines unlock techniques, branch into specializations, and combine into elite synthesis skills.

---

## 🚀 Philosophy

Academic growth is not linear.

Instead of flat XP bars, this system models:

- Techniques unlocking at specific levels  
- Branching progression paths  
- Synergies between techniques  
- Elite skills that require cross-disciplinary prerequisites  

Skills represent disciplines.  
Techniques represent methodological tools.  
Elite skills represent synthesis.

---

## 🌳 Core Design Rules

### Techniques
- Unlock at specific levels
- Are structural (not passive +5% boosts)
- May depend on other techniques
- Can branch into specialization paths

### Non-Linear Progression
- Multiple viable paths
- Mutually exclusive choices possible
- Synergies across branches
- Not everyone builds the same character

### Elite Skills
- Require minimum levels in multiple base skills
- May require specific techniques
- Represent cross-disciplinary mastery

---
## 🧱 Project Structure

```
academic-runescape/
├── index.html
├── app.js
├── styles.css
├── skills/
│   ├── mathematics.js
│   ├── physics.js
│   └── ...
└── README.md
```

Each skill lives in its own file for modularity and clean scaling.


---

## 🛠️ Getting Started

Clone the repository:

```bash
git clone https://github.com/Jibyjib/academic-runescape.git
cd academic-runescape
```

Then open `index.html` in your browser.

No build system required.

---

## ✏️ Adding a Skill

1. Create a new file inside `/skills/`
2. Define:
   - Name
   - XP curve
   - Technique unlock levels
   - Optional elite dependencies
3. Ensure it is loaded in `app.js`

---

## 🎮 Long-Term Vision

- Full branching UI visualization
- Technique dependency graphs
- Elite skill gating logic
- Persistent save state
- Possibly local storage or backend later

---

## 📄 License

MIT
