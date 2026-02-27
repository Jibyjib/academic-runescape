window.ACAD_RS_SKILLS.push({
  id: "thermo_statmech",
  name: "Thermodynamics & Statistical Mechanics",
  cap: 99,
  techniques: [
    // ----------------------------
    // Undergrad thermodynamics (L1–30)
    // ----------------------------
    { level: 1,  name: "Thermodynamic state space: equations of state and quasistatic process bookkeeping" },
    { level: 5,  name: "First law: work/heat conventions and energy accounting across cycles" },
    { level: 10, name: "Second law: entropy, reversibility, and Clausius inequality bookkeeping" },
    { level: 14, name: "Thermodynamic potentials: Legendre transforms and natural-variable control" },
    { level: 18, name: "Maxwell relations: derivative identities and response-coefficient extraction" },
    { level: 22, name: "Stability and convexity: heat capacities, compressibilities, and inequality constraints" },
    { level: 26, name: "Phase coexistence: chemical potential matching and Gibbs phase-rule bookkeeping" },
    { level: 30, name: "Clapeyron relation: phase-boundary slopes and latent-heat scaling" },

    // ----------------------------
    // Undergrad statistical mechanics (L30–60)
    // ----------------------------
    { level: 32, name: "Microcanonical ensemble: phase-space volume, density of states, and entropy" },
    { level: 36, name: "Canonical ensemble: partition function identities and free-energy extraction" },
    { level: 40, name: "Grand canonical ensemble: fugacity, particle-number fluctuations, and response" },
    { level: 44, name: "Classical ideal gas: equipartition and thermodynamic identities from Z" },
    { level: 48, name: "Quantum ideal gases: Bose/Fermi distributions and low-temperature limits" },
    { level: 52, name: "Interacting gases: virial expansion and cluster-integral organization" },
    { level: 56, name: "Fluctuations: cumulants, correlation functions, and fluctuation–response links" },
    { level: 60, name: "Thermodynamic limit: ensemble equivalence and large-deviation scaling" },

    // ----------------------------
    // First-year grad fluency lanes (restart near ~60; parallel development)
    // ----------------------------

    // Lane A: Phase transitions + criticality
    { level: 60, name: "Landau free energy: order parameters and symmetry-allowed expansions" },
    { level: 66, name: "Mean-field self-consistency: critical points and exponent extraction" },
    { level: 70, name: "Scaling forms: correlation length, hyperscaling, and exponent relations" },
    { level: 76, name: "Renormalization group: coarse graining, fixed points, and relevant operators" },
    { level: 82, name: "Universality classes: symmetry and dimensionality constraints on critical behavior" },

    // Lane B: Quantum statistical mechanics + imaginary time
    { level: 60, name: "Quantum ensembles: density operators, Gibbs states, and KMS condition" },
    { level: 66, name: "Imaginary-time formalism: Matsubara sums and analytic continuation structure" },
    { level: 72, name: "Interacting quantum systems: linked-cluster expansion and thermodynamic potentials" },
    { level: 78, name: "Superfluidity and condensation: order-parameter fields and phase-stiffness logic" },
    { level: 84, name: "Quantum critical scaling: thermodynamics near zero-temperature fixed points" },

    // Lane C: Kinetic theory + nonequilibrium
    { level: 60, name: "Linear irreversible thermodynamics: Onsager reciprocity and coupled transport" },
    { level: 68, name: "Boltzmann equation: collision integrals and H-theorem structure" },
    { level: 74, name: "Master equations: detailed balance and stationary measures" },
    { level: 80, name: "Fluctuation relations: Jarzynski and Crooks equalities as identities" },
    { level: 86, name: "Stochastic thermodynamics: trajectory-level entropy production bookkeeping" },

    // Lane D: Field-theoretic methods for stat mech
    { level: 60, name: "Hubbard–Stratonovich transform: auxiliary-field decoupling of interactions" },
    { level: 68, name: "Functional integrals: saddle points, fluctuations, and effective actions" },
    { level: 74, name: "Diagrammatics for fluids: Mayer graphs and cluster expansions" },
    { level: 82, name: "1PI effective action: Legendre transforms and loop expansions for thermodynamics" },
    { level: 88, name: "Instanton methods in large deviations: optimal fluctuations and activation rates" },

    // Lane E: Fluids, interfaces, and soft condensed matter
    { level: 60, name: "Thermodynamics of mixtures: chemical potentials and phase-diagram construction" },
    { level: 66, name: "Interfacial thermodynamics: surface tension, Laplace pressure, and nucleation barriers" },
    { level: 72, name: "Fluctuating interfaces: capillary-wave spectrum and coarse-grained surface energy" },
    { level: 80, name: "Polymer statistics: random walks, scaling, and entropic elasticity structure" },

    // ----------------------------
    // High-end refinements (restart near ~85; multiple lanes)
    // ----------------------------

    // Lane 1: Rigorous probability + large deviations
    { level: 85, name: "Large deviations: rate functions and contraction principle for thermodynamic variables" },
    { level: 88, name: "Gibbs measures: DLR condition and thermodynamic-limit construction logic" },
    { level: 92, name: "Concentration bounds: fluctuations, typicality, and scaling of rare events" },

    // Lane 2: Transport + hydrodynamic effective theory
    { level: 85, name: "Green–Kubo relations: transport coefficients from equilibrium correlations" },
    { level: 88, name: "Hydrodynamic modes: conserved densities and constitutive expansions" },
    { level: 92, name: "Fluctuating hydrodynamics: noise terms fixed by fluctuation–dissipation structure" },
    { level: 96, name: "Entropy production bounds: thermodynamic uncertainty relations and tradeoff constraints" },

    // Lane 3: Quantum information viewpoint
    { level: 85, name: "Relative entropy as free energy: variational principles and monotonicity constraints" },
    { level: 90, name: "Typicality in many-body systems: canonical typicality and equilibration bounds" },
    { level: 94, name: "Open quantum systems thermodynamics: detailed balance and steady-state entropy budgets" },

    // Lane 4: Renormalization beyond equilibrium
    { level: 85, name: "Dynamic critical phenomena: scaling of relaxation times and dynamic exponents" },
    { level: 90, name: "MSRJD formalism: functional integral for Langevin and stochastic dynamics" },
    { level: 94, name: "Schwinger–Keldysh for many-body systems: contour actions and response fields" },

    // Lane 5: Disordered systems + frustration
    { level: 85, name: "Quenched disorder: replica trick and disorder-averaged free energies" },
    { level: 90, name: "Spin glasses: order parameters, symmetry breaking patterns, and ultrametric structure" },
    { level: 96, name: "Glassy dynamics: activation barriers and aging scaling regimes" }

    // Note: no entry at level 99 (cap is 99)
  ]
});
