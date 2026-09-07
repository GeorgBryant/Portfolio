import { useRef } from "react";

export default function RangeSlider({
  label,
  lowValue,
  highValue,
  min,
  max,
  step,
  margin = step,
  onChange,
}) {
  const trackRef = useRef(null);
  const activeHandle = useRef(null);

  const range = max - min;

  const lowPercent =
    ((lowValue - min) / range) * 100;

  const highPercent =
    ((highValue - min) / range) * 100;

  function snapToStep(value) {
    const snapped =
      Math.round((value - min) / step) * step +
      min;

    const decimalPlaces =
      step.toString().split(".")[1]?.length ?? 0;

    return Number(
      Math.min(max, Math.max(min, snapped)).toFixed(
        decimalPlaces
      )
    );
  }

  function getValueFromPointer(clientX) {
    const bounds =
      trackRef.current.getBoundingClientRect();

    const percentage = Math.min(
      1,
      Math.max(
        0,
        (clientX - bounds.left) / bounds.width
      )
    );

    return snapToStep(
      min + percentage * range
    );
  }

  function updateHandle(handle, value) {
    if (handle === "low") {
      const nextLow = Math.min(
        value,
        highValue - margin
      );

      onChange(nextLow, highValue);
      return;
    }

    const nextHigh = Math.max(
      value,
      lowValue + margin
    );

    onChange(lowValue, nextHigh);
  }

  function handlePointerDown(event) {
    event.preventDefault();

    const value = getValueFromPointer(
      event.clientX
    );

    const distanceFromLow = Math.abs(
      value - lowValue
    );

    const distanceFromHigh = Math.abs(
      value - highValue
    );

    activeHandle.current =
      distanceFromLow <= distanceFromHigh
        ? "low"
        : "high";

    updateHandle(activeHandle.current, value);

    window.addEventListener(
      "pointermove",
      handlePointerMove
    );

    window.addEventListener(
      "pointerup",
      handlePointerUp
    );
  }

  function handlePointerMove(event) {
    if (!activeHandle.current) {
      return;
    }

    const value = getValueFromPointer(
      event.clientX
    );

    updateHandle(activeHandle.current, value);
  }

  function handlePointerUp() {
    activeHandle.current = null;

    window.removeEventListener(
      "pointermove",
      handlePointerMove
    );

    window.removeEventListener(
      "pointerup",
      handlePointerUp
    );
  }

  return (
    <div style={rangeStyles.control}>
      <div style={rangeStyles.header}>
        <span>{label}</span>

        <span style={rangeStyles.values}>
          {lowValue} – {highValue}
        </span>
      </div>

      <div
        ref={trackRef}
        style={rangeStyles.trackArea}
        onPointerDown={handlePointerDown}
      >
        <div style={rangeStyles.track} />

        <div
          style={{
            ...rangeStyles.activeTrack,
            left: `${lowPercent}%`,
            width: `${
              highPercent - lowPercent
            }%`,
          }}
        />

        <div
          style={{
            ...rangeStyles.handle,
            left: `${lowPercent}%`,
          }}
        />

        <div
          style={{
            ...rangeStyles.handle,
            left: `${highPercent}%`,
          }}
        />
      </div>
    </div>
  );
}

const rangeStyles = {
  control: {
    marginBottom: "18px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
    fontSize: "14px",
  },

  values: {
    color: "#9494a8",
    fontVariantNumeric: "tabular-nums",
  },

  trackArea: {
    position: "relative",
    height: "18px",
    cursor: "pointer",
    touchAction: "none",
  },

  track: {
    position: "absolute",
    top: "50%",
    left: 0,
    width: "100%",
    height: "4px",
    borderRadius: "999px",
    background: "#3b3b50",
    transform: "translateY(-50%)",
  },

  activeTrack: {
    position: "absolute",
    top: "50%",
    height: "4px",
    borderRadius: "999px",
    background: "#ffffff",
    transform: "translateY(-50%)",
  },

  handle: {
    position: "absolute",
    top: "50%",
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    background: "#ffffff",
    border: "2px solid #252536",
    boxSizing: "border-box",
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
  },
};