import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState } from "react";

import GalaxyShader from "./GalaxyShader";
import ControlPanel from "./ControlPanel";

import { DEFAULT_SETTINGS } from "../shaders/params";
import { styles } from "./styles";

export default function ShaderLab() {
  const [settings, setSettings] = useState(
    DEFAULT_SETTINGS
  );

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

  return (
    <main style={styles.layout}>
      <div style={styles.preview}>
        <Canvas camera={{ position: [0, 0, 3] }}>
          <GalaxyShader
            settings={settings}
            universeVersion={universeVersion}
          />

          <OrbitControls
            enableDamping
            dampingFactor={0.08}
            enablePan={false}
            minDistance={1.5}
            maxDistance={6}
          />
        </Canvas>
      </div>

      <ControlPanel
        settings={settings}
        setSettings={setSettings}
        resetSettings={resetSettings}
        randomizeUniverse={randomizeUniverse}
      />
    </main>
  );
}