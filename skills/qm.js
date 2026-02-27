window.ACAD_RS_SKILLS.push({
  id: "qm",
  name: "Quantum Mechanics",
  cap: 99,
  techniques: [
    // ----------------------------
    // Core wave mechanics (L1–30)
    // ----------------------------
    { level: 1,  name: "Schrödinger equation: unitary time evolution and probability conservation" },
    { level: 5,  name: "Observables as operators: eigenvalue problems and expectation values" },
    { level: 10, name: "1D bound states: matching conditions, tunneling, and quantization rules" },
    { level: 15, name: "Harmonic oscillator: ladder algebra and spectrum construction" },
    { level: 20, name: "Angular momentum: SU(2) algebra and spin-½ systems" },
    { level: 25, name: "Central potentials: radial equation and hydrogenic bound-state structure" },
    { level: 30, name: "Dirac notation: completeness relations and operator identities" },

    // ----------------------------
    // Hilbert space + symmetry structure (L30–60)
    // ----------------------------
    { level: 35, name: "Hilbert space formalism: self-adjointness and spectral decomposition" },
    { level: 40, name: "Time-independent perturbation theory: degenerate subspaces and selection rules" },
    { level: 45, name: "Time-dependent perturbation theory: transition amplitudes and response formulas" },
    { level: 50, name: "Angular-momentum addition: tensor products and Clebsch–Gordan machinery" },
    { level: 55, name: "Scattering basics: asymptotic boundary conditions and Born approximation" },
    { level: 60, name: "Continuous symmetries: unitary representations and conserved generators" },

    // ----------------------------
    // Post-core lanes (restart near ~60; parallel development)
    // ----------------------------

    // Lane A: Scattering + spectral analysis
    { level: 60, name: "Partial-wave expansion: phase shifts and unitarity constraints" },
    { level: 66, name: "Lippmann–Schwinger equation: resolvent and scattering states" },
    { level: 72, name: "Resonances: poles of the resolvent and Breit–Wigner systematics" },
    { level: 78, name: "S-matrix constraints: optical theorem and analyticity in energy" },

    // Lane B: Density operators + open systems
    { level: 60, name: "Density operators: mixed states and trace identities" },
    { level: 66, name: "Reduced states: partial trace and entanglement measures from spectra" },
    { level: 72, name: "Quantum channels: Kraus operators and Stinespring dilation structure" },
    { level: 78, name: "Markovian dynamics: Lindblad generators and complete positivity constraints" },

    // Lane C: Path integral + semiclassics
    { level: 60, name: "Path integral: time slicing, composition law, and measure conventions" },
    { level: 68, name: "Semiclassical propagator: stationary phase and Van Vleck determinant" },
    { level: 74, name: "Tunneling via Euclidean continuation: instanton saddle construction" },
    { level: 80, name: "Functional determinants: fluctuation operators and one-loop prefactors" },

    // Lane D: Representation theory + symmetry depth
    { level: 60, name: "Projective representations: central extensions and multiplier phases" },
    { level: 70, name: "Antiunitary symmetries: time reversal and Kramers degeneracy constraints" },
    { level: 76, name: "Selection rules from symmetry: Wigner–Eckart theorem applications" },

    // Lane E: Relativistic wave equations
    { level: 60, name: "Klein–Gordon equation: conserved current and covariant normalization" },
    { level: 68, name: "Dirac equation: gamma algebra and Lorentz covariance structure" },
    { level: 76, name: "Foldy–Wouthuysen expansion: effective Hamiltonians and spin couplings" },

    // ----------------------------
    // High-end lanes (restart near ~85; parallel development)
    // ----------------------------

    // Lane 1: Operator algebras + domains
    { level: 85, name: "Unbounded operators: domains, self-adjoint extensions, and deficiency indices" },
    { level: 88, name: "Rigged Hilbert spaces: distributions and generalized eigenfunction expansions" },
    { level: 92, name: "Resolvent methods: spectral measures and functional calculus for Hamiltonians" },

    // Lane 2: Geometric QM
    { level: 85, name: "Berry connection: adiabatic transport as a U(1) bundle over parameter space" },
    { level: 90, name: "Geometric phase in degenerate subspaces: nonabelian holonomy" },
    { level: 94, name: "Adiabatic theorem: gap conditions and controlled breakdown mechanisms" },

    // Lane 3: Quantization as structure
    { level: 85, name: "Canonical quantization: Poisson brackets to commutators and ordering choices" },
    { level: 90, name: "Geometric quantization: prequantum line bundle and polarization choices" },
    { level: 94, name: "Path-integral vs operator quantization: equivalence via phase-space actions" },

    // Lane 4: Long-time dynamics + metastability
    { level: 85, name: "Time evolution in continuous spectrum: dispersive decay estimates and stationary phase" },
    { level: 90, name: "Metastable states: Gamow vectors and resonance expansions" },
    { level: 96, name: "Scattering completeness: Møller operators and asymptotic completeness statements" },

    // Lane 5: Information-theoretic structure
    { level: 85, name: "Entanglement entropy: von Neumann entropy and area-law vs volume-law structure" },
    { level: 90, name: "Quantum Fisher information: parameter estimation bounds from state geometry" },
    { level: 96, name: "Decoherence mechanisms: pointer bases from system–environment coupling structure" }

    // Note: no entry at level 99 (cap is 99)
  ]
});
