// skills/classical_mechanics.js
// Classical Mechanics — Non-Elite Skill (Cap 99)
// Calibration anchors:
//  ~60  : Taylor undergrad mastery complete
//  ~75  : Goldstein first-year grad fluency
//  ~92  : Arnold proficiency (geometric/integrable systems maturity)

(function () {
  window.ACAD_RS_SKILLS = window.ACAD_RS_SKILLS || [];

  window.ACAD_RS_SKILLS.push({
    id: "classical_mechanics",
    name: "Classical Mechanics",
    cap: 99,

    techniques: [
      // ----------------------------
      // Taylor foundations (L1–30)
      // ----------------------------
      { level: 1,  name: "Newton’s laws / Free-body dynamics" },
      { level: 4,  name: "Work–energy / Conservative forces" },
      { level: 8,  name: "Momentum / Impulse / Collisions" },
      { level: 12, name: "Central forces / Effective potential" },
      { level: 16, name: "Kepler problem (geometry, orbits, periods)" },
      { level: 20, name: "Non-inertial frames / fictitious forces" },
      { level: 24, name: "Oscillations (driven/damped, resonance)" },
      { level: 28, name: "Coupled oscillators / normal modes" },

      // ----------------------------
      // Transition to variational mechanics (L30–60)
      // ----------------------------
      { level: 32, name: "Calculus of variations (Euler–Lagrange idea)" },
      { level: 36, name: "Lagrangian mechanics (generalized coordinates)" },
      { level: 40, name: "Constraints (holonomic; multipliers; generalized forces)" },
      { level: 44, name: "Noether’s theorem (symmetry → conservation)" },
      { level: 48, name: "Rigid body kinematics (rotation matrices, angular velocity)" },
      { level: 52, name: "Rigid body dynamics (Euler equations; inertia tensor)" },
      { level: 56, name: "Hamiltonian mechanics (Legendre transform; Hamilton’s eqs.)" },
      { level: 60, name: "Phase space + Poisson brackets (Taylor-complete anchor)" },

      // ----------------------------
      // Goldstein fluency block (L60–75)
      // ----------------------------
      { level: 63, name: "Canonical transformations / generating functions" },
      { level: 66, name: "Hamilton–Jacobi theory (principal function; separation)" },
      { level: 69, name: "Action–angle variables (1D bound motion; frequencies)" },
      { level: 72, name: "Central-force motion via HJ + action variables (Kepler/oscillator)" },
      { level: 75, name: "Canonical perturbation theory (generating function approach)" },

      // ----------------------------
      // Arnold maturity: geometric + integrable systems (L75–92)
      // ----------------------------
      { level: 78, name: "Symplectic form / Hamiltonian vector fields / flows" },
      { level: 80, name: "Liouville integrability (involution; invariant tori picture)" },
      { level: 82, name: "Action–angle variables (n DOF; torus dynamics)" },
      { level: 84, name: "Averaging / secular evolution (adiabatic invariants)" },
      { level: 86, name: "Resonances / small denominators / breakdown of naive perturbation" },
      { level: 88, name: "Poincaré maps / qualitative dynamics near separatrices" },
      { level: 90, name: "KAM theorem (statement-level; invariant tori persistence)" },
      { level: 92, name: "Arnold proficiency anchor (geometric mechanics perspective)" },

      // ----------------------------
      // Research-adjacent (L92–99)
      // ----------------------------
      { level: 94, name: "Symplectic reduction / momentum maps (working knowledge)" },
      { level: 96, name: "Normal forms (Birkhoff/Gustavson-style statement-level)" },
      { level: 98, name: "Hamiltonian chaos toolkit (transport, resonance overlap heuristics)" },
      { level: 99, name: "Geometric mechanics synthesis (research-adjacent mastery)" }
    ]
  });
})();
