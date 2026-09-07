import { useState } from "react";
import { styles } from "./styles";

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
  panelHovered,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [sectionHovered, setSectionHovered] =
    useState(false);

  const sectionOpacity = !panelHovered
    ? 0.65
    : sectionHovered
      ? 1
      : 0.85;

  return (
    <section
      style={{
        ...styles.section,
        opacity: sectionOpacity,
      }}
      onMouseEnter={() => setSectionHovered(true)}
      onMouseLeave={() => setSectionHovered(false)}
    >
      <button
        type="button"
        style={styles.sectionButton}
        onClick={() =>
          setIsOpen((current) => !current)
        }
        aria-expanded={isOpen}
      >
        <span>{title}</span>

        <span
          style={{
            ...styles.sectionArrow,
            transform: isOpen
              ? "rotate(90deg)"
              : "rotate(0deg)",
          }}
        >
          ›
        </span>
      </button>

      {isOpen && (
        <div style={styles.sectionContent}>
          {children}
        </div>
      )}
    </section>
  );
}