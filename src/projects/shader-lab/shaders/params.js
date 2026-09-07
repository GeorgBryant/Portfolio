// params.js
//
// Single source of truth for every tweakable shader setting.
// Everything else (default settings, ShaderMaterial uniforms,
// the per-frame sync loop, and the control panel UI) is derived
// from this array so a setting only has to be declared once.
//
// type:
//   "slider"  (default) - a plain numeric range input
//   "density" - a numeric range input, but displayed/edited as an
//               inverted, scaled value (see ControlPanel for the
//               transform) while the underlying setting stays a
//               0-1 probability threshold
//   "color"   - a color input, backed by a THREE.Color uniform
//
// pairKey / pairRole / pairMargin:
//   used for the low/high threshold sliders (arm noise, nebula,
//   dust) so the low slider can never cross the high slider and
//   vice versa.

export const PARAMS = [
  // Structure
  { key: "galaxyCount", label: "Galaxy count", group: "Structure", default: 2, min: 1, max: 5, step: 1 },
  { key: "armCount", label: "Arm count", group: "Structure", default: 3, min: 1, max: 12, step: 1 },
  { key: "spiralTightness", label: "Spiral tightness", group: "Structure", default: 14, min: 0, max: 60, step: 0.5 },
  { key: "armSharpness", label: "Arm sharpness", group: "Structure", default: 8, min: 1.5, max: 20, step: 0.5 },
  { key: "galaxyRadius", label: "Galaxy radius", group: "Structure", default: 0.5, min: 0.1, max: 1, step: 0.01 },

  { key: "rotationSpeed", label: "Rotation speed", group: "Animation", default: 0.25, min: -10, max: 10, step: 0.1 },
  // Warp 
  { key: "warpScale", label: "Warp scale", group: "Warp", default: 4.5, min: 0.1, max: 12, step: 0.1 },
  { key: "warpStrength", label: "Warp strength", group: "Warp", default: 0.045, min: 0, max: 0.3, step: 0.005 },
  { key: "warpSpeed", label: "Warp speed", group: "Warp", default: 0.01, min: -0.2, max: 0.2, step: 0.005 },
  // Arm texture
  { key: "armNoiseScale", label: "Noise scale", group: "Arm texture", default: 11.0, min: 0.5, max: 30, step: 0.5 },
  { key: "armNoiseSpeed", label: "Noise speed", group: "Arm texture", default: 0.008, min: -0.2, max: 0.2, step: 0.005 },
  {
    key: "armNoiseLow",
    label: "Noise threshold low",
    group: "Arm texture",
    default: 0.32,
    min: 0,
    max: 0.99,
    step: 0.01,
    pairKey: "armNoiseHigh",
    pairRole: "low",
    pairMargin: 0.01,
  },
  {
    key: "armNoiseHigh",
    label: "Noise threshold high",
    group: "Arm texture",
    default: 0.72,
    min: 0.01,
    max: 1,
    step: 0.01,
    pairKey: "armNoiseLow",
    pairRole: "high",
    pairMargin: 0.01,
  },

  // Core
  { key: "coreRadius", label: "Core radius", group: "Core", default: 0.12, min: 0.01, max: 0.5, step: 0.01 },
  { key: "coreSharpness", label: "Core sharpness", group: "Core", default: 2.8, min: 0.1, max: 10, step: 0.1 },
  { key: "coreBrightness", label: "Core brightness", group: "Core", default: 1.65, min: 0, max: 5, step: 0.05 },
  // Halo
  { key: "haloRadius", label: "Halo radius", group: "Halo", default: 1.75, min: 0.5, max: 3, step: 0.05 },
  { key: "haloPower", label: "Halo falloff", group: "Halo", default: 3.4, min: 0.1, max: 10, step: 0.1 },
  { key: "haloBrightness", label: "Halo brightness", group: "Halo", default: 0.07, min: 0, max: 2, step: 0.01 },
  // Nebula
  { key: "nebulaScale", label: "Nebula scale", group: "Nebula", default: 4.5, min: 0.1, max: 20, step: 0.1 },
  { key: "nebulaSpeed", label: "Nebula speed", group: "Nebula", default: 0.004, min: -0.2, max: 0.2, step: 0.005 },
{
    key: "nebulaLow",
    label: "Threshold low",
    group: "Nebula",
    default: 0.38,
    min: 0,
    max: 0.99,
    step: 0.01,
    pairKey: "nebulaHigh",
    pairRole: "low",
    pairMargin: 0.01,
  },
  {
    key: "nebulaHigh",
    label: "Threshold high",
    group: "Nebula",
    default: 0.69,
    min: 0.01,
    max: 1,
    step: 0.01,
    pairKey: "nebulaLow",
    pairRole: "high",
    pairMargin: 0.01,
  },
  { key: "nebulaBrightness", label: "Nebula brightness", group: "Nebula", default: 0.22, min: 0, max: 3, step: 0.05 },

  // Dust
  { key: "dustScale", label: "Dust scale", group: "Dust", default: 14.0, min: 0.5, max: 40, step: 0.5 },
  {
    key: "dustLow",
    label: "Threshold low",
    group: "Dust",
    default: 0.49,
    min: 0,
    max: 0.99,
    step: 0.01,
    pairKey: "dustHigh",
    pairRole: "low",
    pairMargin: 0.01,
  },
  {
    key: "dustHigh",
    label: "Threshold high",
    group: "Dust",
    default: 0.67,
    min: 0.01,
    max: 1,
    step: 0.01,
    pairKey: "dustLow",
    pairRole: "high",
    pairMargin: 0.01,
  },
  { key: "dustStrength", label: "Arm darkening", group: "Dust", default: 0.72, min: 0, max: 1, step: 0.01 },
  { key: "dustNebulaStrength", label: "Nebula darkening", group: "Dust", default: 0.42, min: 0, max: 1, step: 0.01 },

  // Large stars
  { key: "largeStarDensity", label: "Density", group: "Large stars", default: 0.992, type: "density", min: 1, max: 30, step: 1 },
  { key: "largeStarSize", label: "Size", group: "Large stars", default: 0.085, min: 0.01, max: 0.45, step: 0.005 },
  { key: "largeStarBrightness", label: "Brightness", group: "Large stars", default: 1.6, min: 0, max: 5, step: 0.05 },
  { key: "largeStarTwinkle", label: "Twinkle speed", group: "Large stars", default: 0.55, min: 0, max: 8, step: 0.1 },

  // Small stars
  { key: "smallStarDensity", label: "Density", group: "Small stars", default: 0.978, type: "density", min: 1, max: 40, step: 1 },
  { key: "smallStarSize", label: "Size", group: "Small stars", default: 0.04, min: 0.005, max: 0.25, step: 0.005 },
  { key: "smallStarBrightness", label: "Brightness", group: "Small stars", default: 0.75, min: 0, max: 5, step: 0.05 },
  { key: "smallStarTwinkle", label: "Twinkle speed", group: "Small stars", default: 0.25, min: 0, max: 8, step: 0.1 },

  // Colour
  { key: "colorA", label: "Background", group: "Colour", default: "#01030a", type: "color" },
  { key: "colorB", label: "Galaxy highlights", group: "Colour", default: "#7da7ff", type: "color" },
  { key: "nebulaColor", label: "Nebula", group: "Colour", default: "#633ca6", type: "color" },
  { key: "warmStarColor", label: "Large stars", group: "Colour", default: "#ffd6a3", type: "color" },
  { key: "coolStarColor", label: "Small stars", group: "Colour", default: "#b9d4ff", type: "color" },
];

// Section order and open/closed state, matching the original layout exactly.
export const PARAM_GROUPS = [
  { name: "Structure", defaultOpen: true },
  { name: "Animation", defaultOpen: true },
  { name: "Warp", defaultOpen: false },
  { name: "Arm texture", defaultOpen: false },
  { name: "Core", defaultOpen: true },
  { name: "Halo", defaultOpen: false },
  { name: "Nebula", defaultOpen: false },
  { name: "Dust", defaultOpen: false },
  { name: "Large stars", defaultOpen: false },
  { name: "Small stars", defaultOpen: false },
  { name: "Colour", defaultOpen: false },
];

// `paused` isn't a shader uniform, so it isn't in PARAMS - it's added
// here as the one extra field the settings object needs.
export const DEFAULT_SETTINGS = {
  ...Object.fromEntries(PARAMS.map((param) => [param.key, param.default])),
  paused: false,
};

