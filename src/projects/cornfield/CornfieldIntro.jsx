import { useEffect, useState } from "react";

/** Overlay disappears on first successful pointer lock, then stays hidden until remount. */
export default function CornfieldIntro() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handlePointerLock = () => {
      if (document.pointerLockElement) setDismissed(true);
    };
    document.addEventListener("pointerlockchange", handlePointerLock);
    handlePointerLock();
    return () => document.removeEventListener("pointerlockchange", handlePointerLock);
  }, []);

  if (dismissed) return null;

  return (
    <div style={{
      position: "absolute", top: "35%", left: "50%",
      transform: "translate(-50%, -50%)", zIndex: 30,
      width: "min(300px, calc(100% - 48px))", boxSizing: "border-box",
      padding: "23px 25px", borderRadius: 12,
      background: "rgba(0, 0, 0, 0.7)", color: "#f4f4f4",
      fontFamily: "inherit", pointerEvents: "none",
    }} aria-label="Cornfield controls">
      <div style={{ textAlign: "center", fontSize: 13, fontWeight: 700, letterSpacing: ".13em" }}>
        CLICK TO EXPLORE
      </div>
      <p style={{ margin: "13px 0 19px", fontSize: 12, lineHeight: 1.5, textAlign: "center", color: "#ddd" }}>
        Click anywhere in the field to enter view mode.
      </p>
      <div style={{ height: 1, background: "rgba(255,255,255,.2)", marginBottom: 15 }} />
      {[["Move around", "W A S D"], ["Release cursor", "ESC"]].map(([label, key]) => (
        <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginTop: 12, fontSize: 12 }}>
          <span style={{ color: "#d0d0d0" }}>{label}</span>
          <strong style={{ fontSize: 11, letterSpacing: ".09em", fontWeight: 600, whiteSpace: "nowrap" }}>{key}</strong>
        </div>
      ))}
    </div>
  );
}
