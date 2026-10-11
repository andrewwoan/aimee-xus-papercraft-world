import React, { Suspense, useEffect } from "react";
import { useThree } from "@react-three/fiber";

import MovingCharacters from "./models/Moving_Characters";
import Winter from "./models/Scene_1_Winter";
import Spring from "./models/Scene_2_Spring";
import Summer from "./models/Scene_3_Summer";
import Fall from "./models/Scene_4_Fall";
import CustomCamera from "./components/CustomCamera";
import { useExperienceStore } from "../store/useExperienceStore";

// Only flag the scene ready once the GPU pipelines are compiled and a few
// frames have actually rendered, otherwise the first visible frames are black.
const SceneReadySentinel = () => {
  const setIsSceneReady = useExperienceStore((state) => state.setIsSceneReady);
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    let cancelled = false;
    let raf;

    const run = async () => {
      try {
        await gl.compileAsync?.(scene, camera);
      } catch (e) {
        console.warn("Scene precompile failed", e);
      }
      let frames = 0;
      const tick = () => {
        if (cancelled) return;
        if (++frames >= 3) setIsSceneReady(true);
        else raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    run();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [gl, scene, camera, setIsSceneReady]);
  return null;
};

const Scene = () => {
  return (
    <>
      <CustomCamera />
      <Suspense fallback={null}>
        <MovingCharacters />
        <Winter />
        <Spring />
        <Summer />
        <Fall />
        <SceneReadySentinel />
      </Suspense>
    </>
  );
};

export default Scene;
