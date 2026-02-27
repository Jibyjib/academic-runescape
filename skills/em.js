window.ACAD_RS_SKILLS.push({
  id: "em",
  name: "Electromagnetism",
  cap: 99,
  techniques: [
    // ----------------------------
    // Foundations (L1–35)
    // ----------------------------
    { level: 1,  name: "Electrostatics modeling: Coulomb superposition and field construction from sources" },
    { level: 5,  name: "Potential methods: line/surface integrals, gauge shifts, and energy functionals" },
    { level: 10, name: "Gauss law techniques: symmetry reduction and flux-based field determination" },
    { level: 15, name: "Electrostatic boundaries: conductors, uniqueness logic, and interface conditions" },
    { level: 20, name: "Laplace/Poisson BVPs: separation of variables and method of images constructions" },
    { level: 25, name: "Electrostatic multipoles: moment tensors and far-field systematics" },
    { level: 30, name: "Magnetostatics: Biot–Savart, vector potential, Ampère law, and magnetostatic boundaries" },
    { level: 35, name: "Maxwell equations: integral–differential forms and charge conservation closure" },

    // ----------------------------
    // Completing core mastery (≤ 60)
    // ----------------------------
    { level: 38, name: "Energy and forces: field energy density, pressure, and virtual-work computation" },
    { level: 42, name: "Electromagnetic waves: plane-wave solutions, polarization, and impedance matching" },
    { level: 46, name: "Waves at interfaces: Fresnel coefficients and boundary matching in simple geometries" },
    { level: 50, name: "Poynting theorem: energy–momentum flow and Maxwell stress tensor force extraction" },
    { level: 55, name: "Macroscopic electromagnetism: D/H fields, P/M, and bound charge/current bookkeeping" },
    { level: 60, name: "Retarded potentials: Green-function construction and Liénard–Wiechert fields" },

    // ----------------------------
    // First-year grad fluency lanes (restart near ~60)
    // ----------------------------

    // Lane A: Gauge + field-theoretic structure
    { level: 60, name: "Gauge structure: Lorenz/Coulomb gauges, residual gauge freedom, constraint propagation" },
    { level: 66, name: "Maxwell action: gauge symmetry, boundary terms, and stress–energy derivation" },
    { level: 72, name: "Noether analysis: conserved charges and angular momentum of the EM field" },
    { level: 78, name: "Differential-forms Maxwell: bundle viewpoint, potentials, and cohomological flux" },

    // Lane B: Green functions + radiation
    { level: 60, name: "Green functions for Poisson/Helmholtz/wave operators: source reconstruction" },
    { level: 68, name: "Causal propagators: retarded/advanced solutions and support in spacetime" },
    { level: 74, name: "Multipole radiation: Eℓ/Mℓ decomposition and angular power systematics" },
    { level: 80, name: "Far-zone asymptotics: stationary-phase evaluation of radiation integrals" },

    // Lane C: Media + response theory
    { level: 60, name: "Linear response in media: susceptibility tensors and causality constraints" },
    { level: 68, name: "Kramers–Kronig relations: analyticity of ε(ω), μ(ω), and refractive index" },
    { level: 74, name: "Anisotropic and magneto-electric media: tensor constitutive laws" },
    { level: 80, name: "Plasma electrodynamics: dielectric tensor and dispersion surfaces" },

    // Lane D: Spectral + boundary structure
    { level: 60, name: "Mode expansions: orthogonality and completeness in bounded domains" },
    { level: 68, name: "Waveguides and cavities: spectral problems and dispersion relations" },
    { level: 74, name: "Scattering matrices: boundary matching and unitarity constraints" },
    { level: 80, name: "Integral-equation formulations: boundary layer potentials and well-posedness" },

    // Lane E: Self-fields + consistency
    { level: 60, name: "Radiation from accelerated charges: power and angular distributions" },
    { level: 70, name: "Bound vs radiative fields: near-zone/far-zone decomposition" },
    { level: 76, name: "Radiation reaction models: consistency and mass renormalization logic" },

    // ----------------------------
    // Post-first-year depth (restart near ~80; parallel lanes)
    // ----------------------------

    // Lane 1: Geometric/topological structure
    { level: 80, name: "Flux quantization: gauge potentials on nontrivial bundles and transition functions" },
    { level: 86, name: "Duality rotations: electric–magnetic symmetry and invariant structures" },
    { level: 92, name: "Cohomological classification: global charges and de Rham classes in EM" },

    // Lane 2: Advanced scattering + spectral theory
    { level: 80, name: "Partial-wave scattering: phase shifts and optical theorem constraints" },
    { level: 86, name: "Resonances and quasi-normal modes: complex-frequency poles of response" },
    { level: 94, name: "Analytic continuation in frequency: dispersion relations for scattering amplitudes" },

    // Lane 3: Structured media + effective descriptions
    { level: 80, name: "Homogenization limits: effective-medium parameters from microstructure" },
    { level: 88, name: "Nonlocal constitutive laws: spatial dispersion and k-dependent response" },
    { level: 96, name: "Effective action viewpoint: integrating out matter to obtain macroscopic response" },

    // Lane 4: Asymptotic + multiscale methods
    { level: 80, name: "Matched asymptotics: near-zone multipoles to far-zone radiation matching" },
    { level: 90, name: "High-frequency limits: geometric optics with polarization transport corrections" },
    { level: 98, name: "Multiscale wave propagation: envelope equations and slow-modulation structure" }

    // Note: no entry at level 99 (cap is 99)
  ]
});
