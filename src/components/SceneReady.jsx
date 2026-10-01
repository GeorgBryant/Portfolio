import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

// Place inside the Canvas (and inside its asset Suspense boundary when present).
export default function SceneReady({ onReady }) {
  const reported = useRef(false);
  useFrame(() => {
    if (!reported.current) {
      reported.current = true;
      // Let the current WebGL frame finish before hiding the loading overlay.
      requestAnimationFrame(() => onReady?.());
    }
  });
  return null;
}
