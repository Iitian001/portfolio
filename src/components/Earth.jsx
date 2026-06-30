import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, Environment } from "@react-three/drei";
import ComputerModel from "./ComputerModel";
import CanvasLoader from "../Loader";

const EarthCanvas = () => {
  return (
    <Canvas
      shadows
      frameloop='demand'
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [0, 2, 4.5],
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} />
        <Environment preset="city" />
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
        <ComputerModel position={[0, -0.2, 0]} scale={0.028} />

        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default EarthCanvas;
