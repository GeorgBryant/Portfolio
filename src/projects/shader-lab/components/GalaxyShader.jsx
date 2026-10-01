import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import { PARAMS } from "../shaders/params";
import { vertexShader } from "../shaders/vertex";
import { fragmentShader } from "../shaders/fragment";
import { useGLTF } from "@react-three/drei";

const MAX_GALAXIES = 5;

export default function GalaxyShader({
  settings,
  universeVersion,
}) {
  const elapsedTime = useRef(0);

const galaxies = useMemo(() => {
  const generated = [];

  for (let i = 0; i < MAX_GALAXIES; i++) {
    const scale =
      0.25 +
      Math.random() * 0.35;

    let offset = new THREE.Vector2();
    let bestOffset = offset.clone();
    let bestClearance = -Infinity;

    const maxAttempts = 20;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const edgePadding =
  scale * 0.22;

const maxOffset =
  0.5 - edgePadding;

const candidate =
  new THREE.Vector2(
    Math.random() * maxOffset * 2 - maxOffset,
    Math.random() * maxOffset * 2 - maxOffset
  );

      let valid = true;
      let minimumClearance = Infinity;

      for (const existing of generated) {
        const distance =
          candidate.distanceTo(
            existing.offset
          );

        const requiredDistance =
          (scale + existing.scale) * 0.90;

        const clearance =
          distance -
          requiredDistance;

        minimumClearance =
          Math.min(
            minimumClearance,
            clearance
          );

        if (distance < requiredDistance) {
          valid = false;
        }
      }

      if (generated.length === 0) {
        valid = true;
        minimumClearance = Infinity;
      }

      if (minimumClearance > bestClearance) {
        bestClearance =
          minimumClearance;

        bestOffset =
          candidate.clone();
      }

      if (valid) {
        offset = candidate;
        break;
      }

      if (attempt === maxAttempts - 1) {
        offset = bestOffset;
      }
    }

let colorBias;
let colorAttempts = 0;

do {
  colorBias =
    Math.random() * 0.44 - 0.22;

  colorAttempts++;
} while (
  generated.some(
    (existing) =>
      Math.abs(
        existing.colorBias - colorBias
      ) < 0.09
  ) &&
  colorAttempts < 20
);

    generated.push({
      offset,

      scale,

      rotation:
        Math.random() *
        Math.PI *
        2,

      seed:
        Math.random() *
        1000,

        colorBias,
    });
  }

const galaxiesWithInteractions =
  generated.map((galaxy, index) => {
    let nearestGalaxy = null;
    let nearestDistance = Infinity;

    generated.forEach(
      (otherGalaxy, otherIndex) => {
        if (index === otherIndex) return;

        const distance =
          galaxy.offset.distanceTo(
            otherGalaxy.offset
          );

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestGalaxy = otherGalaxy;
        }
      }
    );

    if (!nearestGalaxy) {
      return {
        ...galaxy,
        interactionDirection:
          new THREE.Vector2(0, 0),
        interactionStrength: 0,
      };
    }

    const interactionDirection =
      nearestGalaxy.offset
        .clone()
        .sub(galaxy.offset)
        .normalize();

    const combinedScale =
      galaxy.scale +
      nearestGalaxy.scale;

    const interactionStart =
      combinedScale * 0.8;

    const interactionFull =
      combinedScale * 0.45;

    const interactionStrength =
      THREE.MathUtils.clamp(
        (interactionStart -
          nearestDistance) /
          (interactionStart -
            interactionFull),
        0,
        1
      );

    return {
      ...galaxy,
      interactionDirection,
      interactionStrength,
    };
  });

return galaxiesWithInteractions;
}, [universeVersion]);

  const { scene } = useGLTF(
    "/Models/ShaderBall.glb"
  );

  const material = useMemo(() => {

const uniforms = {
  time: {
    value: 0,
  },

  starsEnabled: {
  value: settings.starsEnabled ? 1.0 : 0.0,
},


  galaxyInteractionDirections: {
  value: galaxies.map(
    (galaxy) =>
      galaxy.interactionDirection
  ),
},

galaxyInteractionStrengths: {
  value: galaxies.map(
    (galaxy) =>
      galaxy.interactionStrength
  ),
},


  galaxyOffsets: {
    value: galaxies.map(
      (galaxy) => galaxy.offset
    ),
  },

  galaxyScales: {
    value: galaxies.map(
      (galaxy) => galaxy.scale
    ),
  },

  galaxyRotations: {
    value: galaxies.map(
      (galaxy) => galaxy.rotation
    ),
  },

  galaxySeeds: {
    value: galaxies.map(
      (galaxy) => galaxy.seed
    ),
  },

  galaxyColorBiases: {
  value: galaxies.map(
    (galaxy) => galaxy.colorBias
  ),
},
};

    for (const parameter of PARAMS) {
      const {
        key,
        type,
      } = parameter;

      if (key === "paused") continue;

      uniforms[key] = {
        value:
          type === "color"
            ? new THREE.Color(settings[key])
            : settings[key],
      };
    }

    return new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });
  }, [galaxies]);

  const shaderBall = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = material;
      }
    });

    return clone;
  }, [scene, material]);

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  useFrame((state, delta) => {
    if (!settings.paused) {
      elapsedTime.current += delta;
    }

    material.uniforms.time.value =
      elapsedTime.current;

      material.uniforms.starsEnabled.value =
  settings.starsEnabled ? 1.0 : 0.0;

    for (const parameter of PARAMS) {
      const {
        key,
        type,
      } = parameter;

      if (
        key === "paused" ||
        !material.uniforms[key]
      ) {
        continue;
      }

      if (type === "color") {
        material.uniforms[key].value.set(
          settings[key]
        );
      } else {
        material.uniforms[key].value =
          settings[key];
      }
    }
  });

  return (
    <primitive object={shaderBall} />
  );
}