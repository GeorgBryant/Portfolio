import { useState } from "react";

import CollapsibleSection from "./CollapsibleSection";
import MenuParticles from "./MenuParticles";
import Slider from "./Slider";
import RangeSlider from "./RangeSlider";

import {
  PARAMS,
  PARAM_GROUPS,
} from "../shaders/params";

import { styles } from "./styles";

export default function ControlPanel({
  settings,
  setSettings,
  resetSettings,
  randomizeUniverse,
}) {
  const [hovered, setHovered] = useState(false);

  function updateSetting(name, value) {
    setSettings((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function clampPairedValue(parameter, value) {
    if (!parameter.pairKey) {
      return value;
    }

    const pairedValue =
      settings[parameter.pairKey];

    const margin =
      parameter.pairMargin ?? 0;

    if (parameter.pairRole === "low") {
      return Math.min(
        value,
        pairedValue - margin
      );
    }

    if (parameter.pairRole === "high") {
      return Math.max(
        value,
        pairedValue + margin
      );
    }

    return value;
  }

  function getDisplayedValue(parameter) {
    if (parameter.type === "density") {
      return Math.round(
        (1 - settings[parameter.key]) * 1000
      );
    }

    return settings[parameter.key];
  }

  function getStoredValue(parameter, value) {
    if (parameter.type === "density") {
      return 1 - value / 1000;
    }

    return clampPairedValue(
      parameter,
      value
    );
  }

  function renderParameter(parameter) {
  const {
    key,
    label,
    type = "slider",
    min,
    max,
    step,
    pairKey,
    pairRole,
    pairMargin,
  } = parameter;

  if (pairKey) {
    if (pairRole === "high") {
      return null;
    }

    return (
      <RangeSlider
        key={`${key}-${pairKey}`}
        label={label.replace(" low", "")}
        lowValue={settings[key]}
        highValue={settings[pairKey]}
        min={min}
        max={
          PARAMS.find(
            (item) => item.key === pairKey
          )?.max ?? max
        }
        step={step}
        margin={pairMargin}
        onChange={(lowValue, highValue) => {
          setSettings((current) => ({
            ...current,
            [key]: lowValue,
            [pairKey]: highValue,
          }));
        }}
      />
    );
  }

  if (type === "color") {
    return (
      <label
        key={key}
        style={styles.colorControl}
      >
        <span>{label}</span>

        <input
          type="color"
          value={settings[key]}
          onChange={(event) =>
            updateSetting(
              key,
              event.target.value
            )
          }
        />
      </label>
    );
  }

  return (
    <Slider
      key={key}
      label={label}
      value={getDisplayedValue(parameter)}
      min={min}
      max={max}
      step={step}
      onChange={(value) =>
        updateSetting(
          key,
          getStoredValue(parameter, value)
        )
      }
    />
  );
}

  return (
    <aside
      style={{
        ...styles.panel,

        background: hovered
          ? "rgba(17, 17, 24, 0.9)"
          : "rgba(17, 17, 24, 0.35)",

        borderLeft: hovered
          ? "1px solid rgba(255, 255, 255, 0.18)"
          : "1px solid rgba(255, 255, 255, 0.06)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.panelInner}>
        <MenuParticles />

        <div style={styles.panelContent}>
          <h1 style={styles.title}>
            Universe Shader Lab
          </h1>

          {PARAM_GROUPS.map((group) => {
            const groupParameters =
              PARAMS.filter(
                (parameter) =>
                  parameter.group === group.name
              );

            return (
              <CollapsibleSection
                key={group.name}
                title={group.name}
                defaultOpen={group.defaultOpen}
                panelHovered={hovered}
              >
                {groupParameters.map(
                  renderParameter
                )}

{group.name === "Structure" && (
  <button
    type="button"
    style={styles.button}
    onClick={randomizeUniverse}
  >
    Randomise universe
  </button>
)}

                {group.name === "Animation" && (
                  <button
                    type="button"
                    style={styles.button}
                    onClick={() =>
                      updateSetting(
                        "paused",
                        !settings.paused
                      )
                    }
                  >
                    {settings.paused
                      ? "Play"
                      : "Pause"}
                  </button>
                )}
              </CollapsibleSection>
            );
          })}

          <button
            type="button"
            style={styles.resetButton}
            onClick={resetSettings}
          >
            Reset shader
          </button>
        </div>
      </div>
    </aside>
  );
}