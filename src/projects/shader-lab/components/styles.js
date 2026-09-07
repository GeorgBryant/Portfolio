export const styles = {
  layout: {
    width: "100vw",
    height: "100vh",
    display: "grid",
    gridTemplateColumns: "1fr 320px",
    background: "#08080c",
    color: "#ffffff",
    overflow: "hidden",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, sans-serif",
  },

  preview: {
    minWidth: 0,
    minHeight: 0,
  },

  panel: {
    position: "relative",
    overflowY: "auto",
    overflowX: "hidden",

    background: "rgba(17, 17, 24, 0.55)",

    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",

    borderLeft:
      "1px solid rgba(255, 255, 255, 0.08)",

    transition:
      "background 250ms ease, border-color 250ms ease",
  },

  panelInner: {
    position: "relative",
    minHeight: "100%",
    padding: "24px",
  },

  menuParticles: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 0,
  },

  panelContent: {
    position: "relative",
    zIndex: 1,
  },

  title: {
    margin: "0 0 24px",
    fontSize: "22px",
    fontWeight: 600,
    letterSpacing: "-0.03em",
  },

  section: {
    marginBottom: "8px",
    borderBottom: "1px solid #292936",
    transition: "opacity 220ms ease",
  },

  sectionButton: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 0",
    color: "#ffffff",
    background: "transparent",
    border: "none",
    fontFamily: "inherit",
    fontSize: "14px",
    fontWeight: 500,
    textAlign: "left",
    cursor: "pointer",
  },

  sectionArrow: {
    display: "inline-block",
    color: "#8f8f9d",
    fontSize: "20px",
    lineHeight: 1,
    transition: "transform 160ms ease",
  },

  sectionContent: {
    padding: "8px 0 18px",
  },

  control: {
    display: "block",
    marginBottom: "18px",
  },

  controlHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "14px",
  },

  value: {
    color: "#9494a8",
    fontVariantNumeric: "tabular-nums",
  },

  slider: {
    width: "100%",
  },

  colorControl: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    fontSize: "14px",
  },

  button: {
    width: "100%",
    padding: "10px 12px",
    color: "#ffffff",
    background: "#252536",
    border: "1px solid #3b3b50",
    borderRadius: "6px",
    fontFamily: "inherit",
    cursor: "pointer",
  },

  resetButton: {
    width: "100%",
    marginTop: "18px",
    padding: "12px",
    color: "#ffffff",
    background: "transparent",
    border: "1px solid #3b3b50",
    borderRadius: "6px",
    fontFamily: "inherit",
    cursor: "pointer",
  },
};