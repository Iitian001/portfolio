import React, { useRef, useMemo } from 'react';
import { useGLTF, useVideoTexture, Float, Center } from '@react-three/drei';
import * as THREE from 'three';

export default function ComputerModel(props) {
  const group = useRef();
  
  // Load the retro computer desk model
  const { scene } = useGLTF("/models/computer-optimized-transformed.glb");
  
  // Clone to avoid parent hierarchy mutation conflicts across multiple canvases
  const clone = useMemo(() => scene.clone(), [scene]);
  
  // Load 5s contact video texture
  const screenTex = useVideoTexture("/videos/contact-video.mp4", { muted: true, loop: true, start: true });

  if (screenTex) {
    screenTex.colorSpace = THREE.SRGBColorSpace;
  }

  return (
    <Float rotationIntensity={0.15} floatIntensity={0.3} speed={1.2}>
      <group ref={group} {...props} dispose={null}>
        
        {/* Render the centered 3D Computer Desk Model */}
        <Center>
          <primitive object={clone} />
          {/* Declarative Video Screen Overlay */}
          <mesh position={[0.0, 0.60, 0.28]} rotation={[-0.08, 0, 0]}>
            <planeGeometry args={[1.35, 0.98]} />
            <meshBasicMaterial map={screenTex} toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
        </Center>
        
        {/* Screen Bezel Glow light effect */}
        <pointLight position={[0, 0.1, 0.4]} color="#a78bfa" intensity={0.5} distance={3} />
      </group>
    </Float>
  );
}

useGLTF.preload("/models/computer-optimized-transformed.glb");
