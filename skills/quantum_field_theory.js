window.ACAD_RS_SKILLS.push({
  id: "qft",
  name: "Quantum Field Theory",
  cap: 120,
  techniques: [
    // ------------------------------------------------------------
    // Core perturbative QFT toolkit (kept ≤ 60)
    // ------------------------------------------------------------
    { level: 1,  name: "Free relativistic fields: canonical quantization + propagators + correlators" },
    { level: 6,  name: "Path integrals: generating functionals + Wick contraction machinery" },
    { level: 12, name: "Feynman rules (scalar): compute tree + 1-loop amplitudes from an action" },
    { level: 18, name: "Renormalization: counterterms + renormalization conditions" },
    { level: 24, name: "Dimensional regularization + MS/\\overline{MS} bookkeeping" },
    { level: 30, name: "Renormalization group: beta functions + running couplings + scaling estimates" },
    { level: 36, name: "Spinor fields: Dirac quantization + spin sums + basic QED perturbation theory" },
    { level: 42, name: "Gauge fixing + ghosts in the path integral" },
    { level: 48, name: "Nonabelian gauge theory basics: YM action + covariant gauges" },
    { level: 54, name: "Spontaneous symmetry breaking: Goldstone theorem + Higgs mechanism" },
    { level: 60, name: "LSZ + unitarity/optical theorem mindset" },

    // ------------------------------------------------------------
    // Structural constraints + effective descriptions (lane)
    // Starts near ~60; not meant to be a prerequisite chain
    // ------------------------------------------------------------
    { level: 60, name: "Lorentz representations for fields: (j_L, j_R) and CPT constraints" },
    { level: 62, name: "Ward–Takahashi / Slavnov–Taylor identities" },
    { level: 64, name: "1PI effective action: Legendre transform + background field method" },
    { level: 66, name: "Effective field theory: operator bases, power counting, matching" },

    { level: 66, name: "Wilsonian RG: integrating out modes and flow of effective actions" },
    { level: 68, name: "Operator product expansion: scaling operators and short-distance expansions" },

    { level: 70, name: "Soft/low-energy constraints on emission amplitudes" },
    { level: 70, name: "Dispersion relations and analyticity constraints on amplitudes" },
    { level: 72, name: "Unitarity cuts: Cutkosky rules and discontinuities of amplitudes" },

    { level: 72, name: "IR structure: soft/collinear divergences + inclusive quantities" },
    { level: 74, name: "Anomalies: compute chiral anomaly and interpret consistency constraints" },
    { level: 75, name: "Schwinger–Dyson equations: functional derivation + simple uses" },

    { level: 80, name: "Large-N and saddle-point expansions as controlled limits" },

    // ------------------------------------------------------------
    // Thermal / real-time / nonequilibrium tools (lane)
    // Has early entry points near ~60 and deeper ones later
    // ------------------------------------------------------------
    { level: 60, name: "Finite-temperature QFT: Matsubara formalism + analytic continuation" },
    { level: 62, name: "KMS condition + spectral representations" },
    { level: 65, name: "Linear response: retarded correlators + Kubo formulas" },
    { level: 70, name: "Schwinger–Keldysh (in-in): contour generating functional + propagator matrix" },
    { level: 78, name: "Influence functionals / coarse-graining: open-system EFT setup" },

    // ------------------------------------------------------------
    // QFT in curved spacetime + effective action machinery (lane)
    // Early entry points can start near ~60; some internal dependencies exist
    // (Hadamard → point-splitting is a real order constraint)
    // ------------------------------------------------------------
    { level: 60, name: "QFT on curved backgrounds: mode expansions + Bogoliubov transforms" },
    { level: 66, name: "Operational particle creation: vacuum choice, squeezing, detector models" },
    { level: 70, name: "Hadamard singularity structure: universal short-distance form" },
    { level: 74, name: "Renormalized ⟨T_{μν}⟩: point-splitting / Hadamard subtraction" },
    { level: 80, name: "Heat kernel method: Seeley–DeWitt coefficients + effective action expansion" },
    { level: 84, name: "Trace/conformal anomaly in curved space" },
    { level: 88, name: "Effective action variations: stress tensor from Γ[g] and backreaction structure" },
    { level: 92, name: "Horizons/boundaries: Unruh/Hawking thermality as a state/causality statement" },

    // ------------------------------------------------------------
    // Geometry/topology of gauge theory (lane)
    // You can start this basically immediately after core gauge theory
    // ------------------------------------------------------------
    { level: 60, name: "Gauge fields as connections: principal bundles + local potentials + transition functions" },
    { level: 62, name: "Associated bundles: charged fields as sections; covariant derivatives geometrically" },

    { level: 66, name: "BRST symmetry: gauge fixing as cohomology and physical-state conditions" },

    { level: 70, name: "Curvature and characteristic classes: Chern–Weil + Chern/Pontryagin classes" },
    { level: 80, name: "Instantons/θ-terms: topological sectors and semiclassical weighting" },
    { level: 90, name: "Anomalies as cohomology: descent relations and obstruction logic" },
    { level: 110, name: "Index theorems in QFT: Dirac index, zero modes, anomaly matching logic" },

    // ------------------------------------------------------------
    // Algebraic / microlocal structure (lane)
    // This lane realistically starts later for most people, but it is not forced
    // to be > everything else; it’s just harder, so it gets higher unlocks.
    // ------------------------------------------------------------
    { level: 85, name: "Algebraic local QFT viewpoint: local algebras + GNS construction" },
    { level: 95, name: "Haag–Ruelle scattering theory: construction of asymptotic states" },
    { level: 115, name: "Microlocal spectrum condition: wavefront-set control of singularities" }
  ]
});
