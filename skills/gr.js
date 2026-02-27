window.ACAD_RS_SKILLS.push({
  id: "gr",
  name: "General Relativity",
  cap: 120,
  techniques: [
    // ------------------------------------------------------------
    // Core geometric + dynamical toolkit (kept ≤ 60)
    // ------------------------------------------------------------
    { level: 1,  name: "Lorentzian geometry: metric, Levi–Civita connection, curvature; compute in coordinates" },
    { level: 6,  name: "Geodesic flow: constants of motion from Killing fields; effective potential reduction" },
    { level: 10, name: "Einstein–Hilbert variation: derive Einstein equation with boundary terms handled" },
    { level: 14, name: "Stress–energy models: perfect fluids, scalar fields; derive ∇_μ T^{μν}=0 from diffeomorphism invariance" },
    { level: 18, name: "Schwarzschild spacetime: horizon regularity, extensions, redshift, geodesic structure" },
    { level: 22, name: "Linearized gravity: gauge fixing, TT decomposition, radiation field extraction" },
    { level: 26, name: "Kerr spacetime: stationary axisymmetry, ergoregion, horizons, separability constants" },
    { level: 30, name: "Conformal diagrams: compactification and causal classification of standard spacetimes" },
    { level: 35, name: "Raychaudhuri equation: focusing, conjugate points, energy-condition implications" },

    // ------------------------------------------------------------
    // Bridge tools inside the first-year band (≤ 60)
    // ------------------------------------------------------------
    { level: 38, name: "Tetrads and spin connection: Cartan structure equations; compute curvature 2-forms" },
    { level: 42, name: "Spin structures in GR: Dirac operator on curved space; covariant spinor transport" },
    { level: 45, name: "FRW geometry: Friedmann equations, horizons, perturbation bookkeeping at linear order" },

    { level: 48, name: "3+1 decomposition: lapse, shift, induced metric; extrinsic curvature and Gauss–Codazzi" },
    { level: 52, name: "ADM constraints: constraint solving and constraint propagation for initial data" },
    { level: 55, name: "Einstein–Cartan theory: torsion from spin current; field equations and conserved currents" },
    { level: 58, name: "Connection–triad variables: rewrite GR as constrained gauge theory; constraint algebra" },
    { level: 60, name: "Bogoliubov transforms in curved space: particle notion from mode mixing in simple geometries" },

    // ------------------------------------------------------------
    // Global/causal structure + black-hole spacetime geometry (lane)
    // Starts near ~60; internal dependencies exist but no global chain
    // ------------------------------------------------------------
    { level: 60, name: "Causal structure: achronal sets, Cauchy development, global hyperbolicity criteria" },
    { level: 66, name: "Null congruences: trapped surfaces, expansions, and singularity diagnostics" },
    { level: 70, name: "Singularity theorems: hypotheses, causal lemmas, and proof skeleton organization" },
    { level: 74, name: "Black-hole mechanics: surface gravity definitions and first-law bookkeeping via Killing horizons" },
    { level: 82, name: "Stationary black-hole uniqueness: rigidity, asymptotic flatness, and boundary conditions at the horizon" },
    { level: 90, name: "Black-hole perturbations: Regge–Wheeler/Zerilli and Teukolsky separations as operators" },

    // ------------------------------------------------------------
    // Asymptotic structure + radiation (lane)
    // ------------------------------------------------------------
    { level: 60, name: "Asymptotic flatness: conformal completion, null infinity, BMS symmetry data" },
    { level: 68, name: "Bondi–Sachs framework: news tensor, mass aspect, and mass-loss balance laws" },
    { level: 76, name: "Gravitational radiation at infinity: memory effects and flux formulas from asymptotic data" },
    { level: 84, name: "Energy-momentum definitions: ADM and Bondi 4-momenta; positivity and rigidity statements" },

    // ------------------------------------------------------------
    // Variational/canonical structures + conserved charges (lane)
    // ------------------------------------------------------------
    { level: 60, name: "Boundary terms and well-posed variational principle: GHY term and corner data" },
    { level: 66, name: "Covariant phase space: symplectic current, presymplectic form, and gauge degeneracies" },
    { level: 72, name: "Noether charge formalism: diffeomorphism charges and first law from Hamiltonians" },
    { level: 80, name: "Constraint algebras: hypersurface deformation algebra and observables under diffeomorphisms" },
    { level: 92, name: "Quasilocal charges: Brown–York type constructions and boundary stress tensors" },

    // ------------------------------------------------------------
    // Curved-spacetime QFT + semiclassical gravity (lane)
    // ------------------------------------------------------------
    { level: 60, name: "Detector models in curved space: response functions from Wightman correlators" },
    { level: 70, name: "Hadamard condition: short-distance singular structure and state selection criteria" },
    { level: 74, name: "Renormalized ⟨T_{μν}⟩: point-splitting and local counterterm classification" },
    { level: 80, name: "Heat kernel expansion: Seeley–DeWitt coefficients for effective actions on curved space" },
    { level: 86, name: "Trace anomaly: curvature invariants and consistency constraints on effective actions" },
    { level: 92, name: "Semiclassical Einstein equation: backreaction as a PDE system with renormalized sources" },

    // ------------------------------------------------------------
    // Geometric analysis + special methods (lane)
    // ------------------------------------------------------------
    { level: 78,  name: "Elliptic/hyperbolic PDE structure in GR: gauges, constraint solving, and energy estimates" },
    { level: 88,  name: "Initial-value well-posedness: harmonic gauge reduction and continuation criteria" },
    { level: 98,  name: "Characteristic evolution: null initial data, caustics, and constraint transport along generators" },
    { level: 108, name: "Spinorial methods: Witten-type identities and positivity mechanisms" },
    { level: 115, name: "Twistor methods: encode conformal geometry and massless fields via cohomological data" }
  ]
});
