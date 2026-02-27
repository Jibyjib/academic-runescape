window.ACAD_RS_SKILLS.push({
  id: "cosmo",
  name: "Cosmology",
  cap: 120,
  techniques: [
    // ------------------------------------------------------------
    // Foundations + thermal history (core ≤ 60)
    // ------------------------------------------------------------
    { level: 1,  name: "FRW dynamics: Friedmann equations, continuity equation, and exact era solutions" },
    { level: 6,  name: "Distance measures: conformal time, comoving distance, d_L and d_A calculations" },
    { level: 12, name: "Horizons and curvature evolution: particle/event horizons and flatness scaling" },
    { level: 18, name: "Thermal history: entropy conservation, g_*(T), decoupling and freeze-out estimates" },
    { level: 22, name: "BBN-level scaling: reaction rates vs H(T) and light-element sensitivity estimates" },
    { level: 25, name: "Cosmological neutrinos: free-streaming scale and imprint on growth and CMB" },

    // ------------------------------------------------------------
    // Linear perturbations + CMB + linear LSS (core ≤ 60)
    // ------------------------------------------------------------
    { level: 30, name: "Linear perturbations: scalar/vector/tensor split and gauge transformation rules" },
    { level: 34, name: "Gauge-invariant variables: Φ/Ψ and ζ/ℛ; derive evolution and conservation limits" },
    { level: 38, name: "Einstein–Boltzmann setup: Liouville operator and moment hierarchy for species" },
    { level: 42, name: "Tight coupling regime: acoustic oscillations and Silk damping scale estimates" },
    { level: 46, name: "Recombination physics: Saha/Peebles limits and visibility-function control parameters" },
    { level: 50, name: "CMB sources: Sachs–Wolfe, Doppler, ISW; line-of-sight source decomposition" },
    { level: 54, name: "Linear matter transfer: equality scale, baryon loading, BAO scale from sound horizon" },
    { level: 57, name: "Linear growth: growth ODE, D(z), f(z) and growth-index parameterizations" },
    { level: 60, name: "Parameter response: how {Ω_b, Ω_c, H0, n_s, A_s, τ, Σm_ν} deform C_ℓ and P(k)" },

    // ------------------------------------------------------------
    // Late-time observables + projection effects (lane)
    // Starts near ~60; parallel entry points
    // ------------------------------------------------------------
    { level: 60, name: "Projection kernels: Limber approximation and curved-sky line-of-sight integrals" },
    { level: 66, name: "CMB lensing: remapping field, lensing potential reconstruction, and spectrum response" },
    { level: 70, name: "Reionization signatures: optical depth, large-angle polarization, and patchy effects" },
    { level: 74, name: "Weak lensing: convergence/shear fields and tomographic kernel construction" },
    { level: 78, name: "Nonlinear onset: breakdown of linear theory and halo-model level power-spectrum anatomy" },

    // ------------------------------------------------------------
    // LSS statistics + inference machinery (lane)
    // ------------------------------------------------------------
    { level: 60, name: "Two-point statistics: correlation functions, power spectra, and window-function convolution" },
    { level: 66, name: "Redshift-space distortions: Kaiser limit, multipoles, and Alcock–Paczyński distortion" },
    { level: 72, name: "Galaxy bias expansion: local operators, renormalized bias parameters, stochastic terms" },
    { level: 78, name: "Baryon acoustic oscillations: reconstruction logic and distance-scale extraction" },
    { level: 84, name: "Perturbation theory for LSS: SPT kernels and loop-level power-spectrum organization" },
    { level: 90, name: "EFT of LSS: counterterms, power counting, and IR resummation statements" },
    { level: 96, name: "Lensing–clustering consistency: cross-correlations and parameter degeneracy breaking" },

    // ------------------------------------------------------------
    // Inflation + correlators in time-dependent backgrounds (lane)
    // ------------------------------------------------------------
    { level: 78, name: "Inflationary background dynamics: slow-roll hierarchy and e-fold accounting" },
    { level: 82, name: "Single-field inflation observables: map slow-roll data to (n_s, r, α_s)" },
    { level: 86, name: "Mukhanov–Sasaki quantization: BD vacuum choice and scalar spectrum normalization" },
    { level: 90, name: "Tensor modes: quantization, spectrum normalization, and consistency relations" },
    { level: 94, name: "In-in formalism: Schwinger–Keldysh generating functional and time-ordered integrals" },
    { level: 98, name: "Primordial non-Gaussianity: bispectrum templates and squeezed-limit consistency constraints" },
    { level: 102, name: "Multi-field dynamics: isocurvature modes, transfer matrices, and δN bookkeeping" },
    { level: 105, name: "EFT of inflation: Goldstone π action, operator basis, and power counting" },
    { level: 110, name: "Loops in inflation: renormalization, secular terms, and IR regularization choices" },

    // ------------------------------------------------------------
    // Dark sector + beyond-ΛCDM structure (lane)
    // ------------------------------------------------------------
    { level: 60, name: "Dark matter in cosmology: relic abundance scaling and small-scale suppression mechanisms" },
    { level: 68, name: "Massive neutrinos: Σm_ν response in CMB+lensing+LSS and scale-dependent growth" },
    { level: 74, name: "Recombination perturbations: baryon sound speed, drag epoch, and parameter redefinitions" },
    { level: 82, name: "Extra radiation: ΔN_eff effects on H(z), damping tail, and phase shift" },
    { level: 88, name: "Interacting dark sector: drag/heat exchange terms in perturbation equations" },
    { level: 94, name: "Early dark energy: background tracking and perturbation signatures around equality" },

    // ------------------------------------------------------------
    // Late-time acceleration + modified gravity (lane)
    // ------------------------------------------------------------
    { level: 60, name: "Background reconstruction: H(z), distances, and consistency relations among observables" },
    { level: 76, name: "Dark energy parameterizations: w0–wa mapping to distances and growth" },
    { level: 86, name: "Modified growth: μ(k,a) and Σ(k,a) response in lensing and clustering" },
    { level: 96, name: "EFT of dark energy: operator basis in unitary gauge and linear perturbation reduction" },
    { level: 108, name: "Screening mechanisms: parameter regimes and observational footprints in large-scale structure" },

    // ------------------------------------------------------------
    // Precision systematics + robustness (lane)
    // ------------------------------------------------------------
    { level: 70, name: "Likelihood construction: Gaussian fields, covariance estimation, and nuisance marginalization" },
    { level: 78, name: "Foreground separation: component-mixing models and power-spectrum leakage control" },
    { level: 86, name: "Instrument/selection effects: beams, masks, completeness, and window-function propagation" },
    { level: 94, name: "Nonlinear baryonic effects: feedback response and marginalization strategies in P(k)" },
    { level: 102, name: "Consistency tests: internal tension metrics and posterior predictive checks" },
    { level: 118, name: "Model discrimination: feature searches, non-attractor phases, and robustness to systematics" }
  ]
});
