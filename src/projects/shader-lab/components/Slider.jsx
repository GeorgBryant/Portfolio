
import { styles } from "./styles";

export default function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix = "",
  onReset,
}) {
  return (
    <label
      style={{
        ...styles.control,
        display: "block",
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          ...styles.controlHeader,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>{label}</span>

        <div style={styles.rotationValueGroup}>
          <span style={styles.value}>
            {value}{suffix}
          </span>

          {onReset && (
            <button
              type="button"
              style={styles.rotationReset}
              onClick={(event) => {
                event.preventDefault();
                onReset();
              }}
              aria-label={`Reset ${label}`}
              title={`Reset ${label}`}
            >
              ↺
            </button>
          )}
        </div>
      </div>

      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
        className="shader-slider"
        style={{
          display: "block",
          width: "100%",
          maxWidth: "none",
          minWidth: 0,
          margin: 0,
          boxSizing: "border-box",
        }}
      />
    </label>
  );
}
