import { Canvas } from "@react-three/fiber";
import SceneReady from "../../../components/SceneReady";
import { OrbitControls } from "@react-three/drei";
import { useState, useEffect } from "react";
import { readGalaxyPreferences, saveGalaxyPreferences } from "../../../shared/galaxyPreferences";

import GalaxyShader from "./GalaxyShader";
import ControlPanel from "./ControlPanel";
import PublicControlPanel from "./PublicControlPanel";

import { DEFAULT_SETTINGS } from "../shaders/params";
import { styles } from "./styles";

export default function ShaderLab({ onReady }) {
  const [settings, setSettings] = useState(readGalaxyPreferences);

  useEffect(() => { saveGalaxyPreferences(settings); }, [settings]);

  const [universeVersion, setUniverseVersion] =
    useState(0);

  function resetSettings() {
    setSettings({ ...DEFAULT_SETTINGS });
  }

  function randomizeUniverse() {
    setUniverseVersion(
      (current) => current + 1
    );
  }

  const [collapsed, setCollapsed] = useState(false);

  return (
<main style={styles.layout}>
<div
  style={{
    ...styles.preview,
    transition:
      "width 280ms cubic-bezier(0.22, 1, 0.36, 1)",
  }}
>


<div
  style={{
    ...styles.preview,
    transform: collapsed
      ? "translateX(-22px)"
      : "translateX(-160px)",
  }}
>

<Canvas
  gl={{ alpha: true }}
  camera={{ position: [0, 0, 3] }}
  style={{ background: "transparent" }}
>

    <GalaxyShader
      settings={settings}
      universeVersion={universeVersion}
    />

    <SceneReady onReady={onReady} />
    <OrbitControls
      enableDamping
      dampingFactor={0.08}
      enablePan={false}
      minDistance={1.5}
      maxDistance={6}
    />
  </Canvas>
</div>
</div>

<PublicControlPanel
  settings={settings}
  setSettings={setSettings}
  collapsed={collapsed}
  setCollapsed={setCollapsed}
  randomizeUniverse={randomizeUniverse}
/>

{/*
      <ControlPanel
        settings={settings}
        setSettings={setSettings}
        resetSettings={resetSettings}
        randomizeUniverse={randomizeUniverse}
      />

*/}
    </main>
  );
}