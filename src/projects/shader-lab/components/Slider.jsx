import { styles } from "./styles";

export default function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}) {
  return (
    <label style={styles.control}>
      <div style={styles.controlHeader}>
        <span>{label}</span>
        <span style={styles.value}>{value}</span>
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
        style={styles.slider}
      />
    </label>
  );
}