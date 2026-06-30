import { useGLTF, useVideoTexture, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useRef, useEffect } from 'react';
import * as THREE from "three";

export default function Macbook(props) {
  const group = useRef();
  const screenRef = useRef();
  const { scene } = useGLTF("/models/mac.glb");
  
  // Load local video to prevent CORS / Suspense blocking issues
  const videoTex = useVideoTexture("/models/video.mp4", { muted: true, loop: true, start: true });
  
  const meshes = {};

  // Find all meshes by name
  scene.traverse((e) => {
    meshes[e.name] = e;
  });

  useEffect(() => {
    if (meshes.screen) {
      // Start with screen closed (180 degrees)
      meshes.screen.rotation.x = THREE.MathUtils.degToRad(180);
      screenRef.current = meshes.screen;
    }
    
    // Apply texture to the matte (screen display)
    if (meshes.matte) {
      videoTex.flipY = false;
      videoTex.colorSpace = THREE.SRGBColorSpace;
      meshes.matte.material.map = videoTex;
      meshes.matte.material.emissive = new THREE.Color("white");
      meshes.matte.material.emissiveMap = videoTex;
      meshes.matte.material.emissiveIntensity = 1;
      meshes.matte.material.needsUpdate = true;
    }
  }, [meshes, videoTex]);

  useFrame((state, delta) => {
    // Smoothly open the screen from 180 to 90 degrees
    if (screenRef.current) {
      screenRef.current.rotation.x = THREE.MathUtils.lerp(
        screenRef.current.rotation.x,
        THREE.MathUtils.degToRad(90), 
        delta * 2
      );
    }

    // Subtle mouse tracking for the entire laptop
    const targetX = (state.pointer.x * Math.PI) / 8;
    const targetY = (state.pointer.y * Math.PI) / 8;
    
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetX, delta * 2);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -targetY, delta * 2);
  });

  return (
    <Float rotationIntensity={0.4} floatIntensity={1} speed={1.5}>
      <group ref={group} {...props} dispose={null}>
        <primitive object={scene} />
      </group>
    </Float>
  );
}

useGLTF.preload("/models/mac.glb");
