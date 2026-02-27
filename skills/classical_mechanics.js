// skills/classical_mechanics.js
// Classical Mechanics — Non-Elite Skill (Cap 99)
// Calibration anchors:
//  ~60  : undergrad mastery complete
//  ~75  : first-year grad fluency
//  ~92  : geometric/integrable systems maturity

(function () {
  window.ACAD_RS_SKILLS = window.ACAD_RS_SKILLS || [];

  window.ACAD_RS_SKILLS.push({
    id: "classical_mechanics",
    name: "Classical Mechanics",
    cap: 99,

    techniques: [
      // ----------------------------
      // Foundations (L1–30)
      // ----------------------------
      { level: 1,  name: "Newtonian dynamics: free-body modeling and equation-of-motion reduction" },
      { level: 4,  name: "Work–energy methods: potentials, energy integrals, and turning-point analysis" },
      { level: 8,  name: "Momentum methods: impulse, collisions, and center-of-mass reduction" },
      { level: 12, name: "Central-force reduction: effective potential and orbit equations" },
      { level: 16, name: "Kepler dynamics: conics, time-of-flight relations, and conserved vectors" },
      { level: 20, name: "Non-inertial frames: rotating coordinates, Coriolis/centrifugal terms, and examples" },
      { level: 24, name: "Linear oscillators: damping, driving, resonance curves, and Green-function solution" },
      { level: 28, name: "Coupled oscillators: normal modes, diagonalization, and mode-energy exchange" },

      // ----------------------------
      // Variational mechanics + structure (L30–60)
      // ----------------------------
      { level: 32, name: "Calculus of variations: Euler–Lagrange equation and natural boundary conditions" },
      { level: 36, name: "Lagrangian formulation: generalized coordinates and cyclic-variable reduction" },
      { level: 40, name: "Constraints: holonomic constraints, Lagrange multipliers, and generalized forces" },
      { level: 44, name: "Noether theorem: continuous symmetries and conserved currents in mechanics" },
      { level: 48, name: "Rigid-body kinematics: rotation matrices, angular velocity, and body frames" },
      { level: 52, name: "Rigid-body dynamics: inertia tensor, Euler equations, and torque-free motion" },
      { level: 56, name: "Hamiltonian formulation: Legendre transform, canonical coordinates, Hamilton equations" },
      { level: 60, name: "Phase space structure: Poisson brackets, canonical invariants, and Liouville volume" },

      // ----------------------------
      // First-year grad fluency (L60–75)
      // ----------------------------
      { level: 63, name: "Canonical transformations: generating functions and invariance of Hamilton form" },
      { level: 66, name: "Hamilton–Jacobi method: principal function, separation, and complete integrals" },
      { level: 69, name: "Action integrals in 1D: adiabatic invariants and frequency extraction" },
      { level: 72, name: "Action–angle construction: Kepler and oscillator as integrable archetypes" },
      { level: 75, name: "Canonical perturbation theory: near-integrable averaging via generating functions" },

      // ----------------------------
      // Post-core lanes (restart near ~75; parallel development)
      // ----------------------------

      // Lane A: Symplectic & geometric mechanics
      { level: 75, name: "Symplectic form: canonical 2-form, Darboux coordinates, and Hamiltonian flows" },
      { level: 78, name: "Lagrangian submanifolds: generating functions and phase-space geometry" },
      { level: 80, name: "Momentum maps: infinitesimal symmetries and conserved quantities geometrically" },
      { level: 82, name: "Symplectic reduction: Marsden–Weinstein quotient and reduced dynamics" },
      { level: 86, name: "Lie–Poisson dynamics: coadjoint orbits and rigid-body-type examples" },

      // Lane B: Integrability & perturbation theory
      { level: 75, name: "Liouville integrability: commuting integrals and invariant-torus foliation" },
      { level: 78, name: "n-DOF action–angle variables: torus coordinates and frequency maps" },
      { level: 80, name: "Averaging methods: secular evolution and adiabatic invariants beyond 1D" },
      { level: 84, name: "Resonant normal forms: near-commensurate frequencies and detuning expansions" },
      { level: 88, name: "KAM toolkit: nondegeneracy conditions and persistence of Diophantine tori" },

      // Lane C: Qualitative dynamics & chaos
      { level: 75, name: "Poincaré maps: fixed points, invariant manifolds, and separatrix structure" },
      { level: 78, name: "Stable/unstable manifolds: heteroclinic networks and transport channels" },
      { level: 82, name: "Separatrix splitting: Melnikov method and transverse homoclinic intersections" },
      { level: 86, name: "Resonance overlap: stochastic layers and heuristic transport rates" },
      { level: 90, name: "Arnold diffusion: slow drift mechanisms in nearly integrable Hamiltonian systems" },

      // Lane D: Rigid bodies & nonholonomic structure
      { level: 75, name: "Heavy top equations: symmetry reduction and conserved quantities" },
      { level: 80, name: "Nonholonomic constraints: rolling systems and constraint forces in phase space" },
      { level: 84, name: "Geometric phases: Hannay angle and holonomy from slow parameter cycles" },

      // Lane E: Hamilton–Jacobi beyond basics
      { level: 75, name: "Complete integral methods: canonical coordinates from HJ solutions" },
      { level: 82, name: "Time-dependent canonical transforms: extended phase space and invariants" },

      // ----------------------------
      // High-end refinements (L92–98)
      // ----------------------------
      { level: 92, name: "Geometric/integrable-systems proficiency anchor: canonical forms and invariant structures" },
      { level: 94, name: "Normal-form theory: Birkhoff/Gustavson normal forms near equilibria" },
      { level: 96, name: "Symplectic integrators: structure-preserving numerical time stepping" },
      { level: 98, name: "Hamiltonian chaos diagnostics: Lyapunov exponents and frequency-map analysis" }
      // Note: no entry at level 99 (cap is 99)
    ]
  });
})();
