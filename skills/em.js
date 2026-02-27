window.ACAD_RS_SKILLS.push({
  id: "em",
  name: "Electromagnetism",
  cap: 99,
  techniques: [
    // ----------------------------
    // Griffiths foundations (L1–35)
    // ----------------------------
    { level: 1,  name: "Coulomb’s law / superposition / basic field intuition" },
    { level: 5,  name: "Electric field & potential (line/surface integrals, gauge freedom basics)" },
    { level: 10, name: "Gauss’s law + symmetry methods" },
    { level: 15, name: "Conductors + boundary conditions (electrostatics)" },
    { level: 20, name: "Laplace/Poisson BVPs (separation, images)" },
    { level: 25, name: "Multipole expansion (electrostatics working fluency)" },
    { level: 30, name: "Magnetostatics (Biot–Savart, A, Ampère)" },
    { level: 35, name: "Maxwell eqs: integral ↔ differential + continuity equation" },

    // ----------------------------
    // Completing Griffiths mastery (~60)
    // ----------------------------
    { level: 40, name: "EM waves in vacuum: plane waves, polarization, energy/momentum flow" },
    { level: 45, name: "Waves at interfaces: Fresnel coefficients + boundary matching (working)" },
    { level: 50, name: "Poynting theorem + Maxwell stress tensor (operational)" },
    { level: 55, name: "Macroscopic EM: D/H, P/M, bound charge/current" },
    { level: 60, name: "Retarded potentials + Liénard–Wiechert fields (derivation-level)" },

    // ----------------------------
    // First-year grad fluency (Jackson + Landau–Lifshitz) (~60–80)
    // ----------------------------
    { level: 64, name: "Gauge choices (Lorenz/Coulomb) + residual gauge; potentials vs fields" },
    { level: 66, name: "Green’s functions for Poisson/Helmholtz/wave operator (operational, gauge-aware)" },
    { level: 68, name: "Vector spherical harmonics + EM multipoles (setup-level)" },
    { level: 70, name: "Radiation multipoles: angular patterns + power systematics (working)" },
    { level: 72, name: "Waveguides: TE/TM modes + dispersion relations (working)" },
    { level: 74, name: "Cavities/resonators: mode normalization + stored energy/Q (working)" },
    { level: 76, name: "Covariant Maxwell: F_{μν}, dual, invariants; 4-potential and gauge" },
    { level: 78, name: "Action principle for EM + covariant stress–energy (variation-level)" },
    { level: 80, name: "Radiation from accelerated charges: Larmor/Liénard + angular distribution (working)" },

    // ----------------------------
    // Post-first-year depth (~80–97)
    // ----------------------------
    { level: 83, name: "Scattering toolkit: partial waves + Born approximation (EM-relevant)" },
    { level: 86, name: "Dispersive/absorbing media: response functions + Kramers–Kronig literacy" },
    { level: 89, name: "Constitutive relations covariantly: frame-dependence + material tensors (working)" },
    { level: 92, name: "Differential-forms EM: dF=0, d⋆G=J; geometric organization of Maxwell" },
    { level: 95, name: "Causal Green functions: retarded/advanced structure + support intuition (working)" },
    { level: 97, name: "Radiation reaction & self-force (statement→working understanding)" }
  ]
});
