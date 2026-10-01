import { useState } from "react";
import { styles } from "./styles";
import Slider from "./Slider";
import { PARAMS } from "../shaders/params";
import MenuParticles from "./MenuParticles";

const params = Object.fromEntries(PARAMS.map((param) => [param.key, param]));

const regenerateStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "22px",
  margin: "24px 0 0",
  padding: "10px 0",
  border: "none",
  borderBottom: "1px solid rgba(255,255,255,0.25)",
  borderRadius: 0,
  background: "transparent",
  color: "rgba(255,255,255,0.65)",
  fontFamily: '"Config Mono", monospace',
  fontSize: "13px",
  fontWeight: 400,
  letterSpacing: "0.1em",
  cursor: "pointer",
  transition: "color 180ms ease, border-color 180ms ease",
};

function ColorControl({ label, value, onChange }) {
  return (
    <label style={styles.colorControl}>
      <span>{label}</span>
      <span style={styles.colorSwatchWrap}>
        <span style={{ ...styles.colorSwatch, backgroundColor: value }} />
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          style={styles.hiddenColorInput}
        />
      </span>
    </label>
  );
}

export default function PublicControlPanel({
  settings,
  setSettings,
  collapsed,
  setCollapsed,
  randomizeUniverse,
}) {
  const [regenerateHovered, setRegenerateHovered] = useState(false);

  const updateSetting = (key, value) =>
    setSettings((current) => ({ ...current, [key]: value }));

  const galaxyRadius = params.galaxyRadius;
  const radiusRange = galaxyRadius.max - galaxyRadius.min;

  function updateLuminosity(value) {
    const multiplier = value / 50;
    setSettings((current) => ({
      ...current,
      coreBrightness: params.coreBrightness.default * multiplier,
      haloBrightness: params.haloBrightness.default * multiplier,
      nebulaBrightness: params.nebulaBrightness.default * multiplier,
      haloRadius: 1.2 + (value / 100) * (2.3 - 1.2),
      dustStrength: 0.9 + (value / 100) * (0.5 - 0.9),
      dustNebulaStrength: 0.6 + (value / 100) * (0.25 - 0.6),
    }));
  }

  return (
    <aside
      style={{
        ...styles.panel,
        ...styles.publicPanel,
        ...(collapsed ? styles.publicPanelCollapsed : {}),
        overflow: "hidden",
        fontFamily: '"Config Mono", monospace',
      }}
    >
      <MenuParticles />

      <button
        type="button"
        style={{
          ...styles.panelToggle,
          ...(collapsed ? { right: "8px", left: "8px", width: "28px" } : {}),
        }}
        onClick={() => setCollapsed((current) => !current)}
        aria-label={collapsed ? "Open controls" : "Close controls"}
      >
        {collapsed ? "‹" : "›"}
      </button>

      {!collapsed && (
        <div style={styles.panelInner}>
          <div style={styles.panelContent}>
            <h1 style={styles.title}>Shader Lab</h1>

            <button
              type="button"
              onClick={randomizeUniverse}
              onMouseEnter={() => setRegenerateHovered(true)}
              onMouseLeave={() => setRegenerateHovered(false)}
              onFocus={() => setRegenerateHovered(true)}
              onBlur={() => setRegenerateHovered(false)}
              aria-label="Regenerate universe"
              style={{
                ...regenerateStyle,
                ...(regenerateHovered
                  ? { color: "#ffffff", borderBottomColor: "#ffffff" }
                  : {}),
              }}
            >
              <span>REGENERATE</span>
              <span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  fontSize: "19px",
                  lineHeight: 1,
                  transform: regenerateHovered ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 350ms ease",
                }}
              >
                ↻
              </span>
            </button>

            <section>
              <h2 style={styles.publicSectionTitle}>Structure</h2>
              <Slider
                label={params.galaxyCount.label}
                value={settings.galaxyCount}
                min={params.galaxyCount.min}
                max={params.galaxyCount.max}
                step={params.galaxyCount.step}
                onChange={(value) => updateSetting("galaxyCount", value)}
              />
              <Slider
                label="Spiral"
                value={Math.round((settings.spiralTightness / 60) * 100)}
                min={0}
                max={100}
                step={1}
                suffix="%"
                onChange={(value) => updateSetting("spiralTightness", (value / 100) * 60)}
              />
              <Slider
                label="Galaxy Size"
                value={Math.round(((settings.galaxyRadius - galaxyRadius.min) / radiusRange) * 100)}
                min={0}
                max={100}
                step={1}
                suffix="%"
                onChange={(value) =>
                  updateSetting("galaxyRadius", galaxyRadius.min + (value / 100) * radiusRange)
                }
              />
            </section>

            <section>
              <h2 style={styles.publicSectionTitle}>Atmosphere</h2>
              <Slider
                label="Luminosity"
                value={Math.round((settings.coreBrightness / params.coreBrightness.default) * 50)}
                min={0}
                max={100}
                step={1}
                suffix="%"
                onChange={updateLuminosity}
              />
            </section>

            <section>
              <h2 style={styles.publicSectionTitle}>Scene</h2>
              <label style={styles.starToggle}>
                <span>Stars</span>
                <input
                  type="checkbox"
                  checked={settings.starsEnabled}
                  onChange={(event) => updateSetting("starsEnabled", event.target.checked)}
                  style={{ display: "none" }}
                />
                <span
                  style={{
                    ...styles.starCheckbox,
                    ...(settings.starsEnabled ? styles.starCheckboxActive : {}),
                  }}
                >
                  {settings.starsEnabled && <span style={styles.starCheckboxMark} />}
                </span>
              </label>
              <Slider
                label="Rotation"
                value={Math.round((settings.rotationSpeed / 1.5) * 100)}
                min={-100}
                max={100}
                step={1}
                suffix="%"
                onChange={(value) => updateSetting("rotationSpeed", (value / 100) * 1.5)}
                onReset={() => updateSetting("rotationSpeed", params.rotationSpeed.default - 0.25)}
              />
            </section>

            <section>
              <h2 style={styles.publicSectionTitle}>Colour</h2>
              <ColorControl
                label="Background"
                value={settings.colorA}
                onChange={(value) => updateSetting("colorA", value)}
              />
              <ColorControl
                label="Galaxy"
                value={settings.colorB}
                onChange={(value) => updateSetting("colorB", value)}
              />
              <ColorControl
                label="Nebula"
                value={settings.nebulaColor}
                onChange={(value) => updateSetting("nebulaColor", value)}
              />
            </section>
          </div>
        </div>
      )}
    </aside>
  );
}
