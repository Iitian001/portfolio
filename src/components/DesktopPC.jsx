import { useGLTF, useVideoTexture, Float, Center } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useRef, useEffect } from 'react';
import * as THREE from "three";

export default function DesktopPC(props) {
  const group = useRef();
  // Load the desktop GLB
  const { scene } = useGLTF("/models/desktop.glb");
  
  // Load local video to prevent CORS / Suspense blocking issues
  const videoTex = useVideoTexture("/videos/hero-video.mp4", { muted: true, loop: true, start: true });
  
  const meshes = {};

  // Find all meshes by name
  scene.traverse((e) => {
    meshes[e.name] = e;
  });

  useEffect(() => {
    // Apply texture to the screen display
    const screenMesh = meshes["MY_SCREEN_MY_SCREEN_0"];
    if (screenMesh) {
      videoTex.flipY = true;
      videoTex.colorSpace = THREE.SRGBColorSpace;
      videoTex.minFilter = THREE.LinearFilter;
      videoTex.magFilter = THREE.LinearFilter;
      videoTex.generateMipmaps = false;
      // Replace the material entirely to avoid any old normal maps or alpha maps causing dot-matrix artifacts
      screenMesh.material = new THREE.MeshBasicMaterial({
        map: videoTex,
        side: THREE.FrontSide
      });
    }
  }, [meshes, videoTex]);

  useFrame((state, delta) => {
    // Subtle mouse tracking for the entire setup
    const targetX = (state.pointer.x * Math.PI) / 16;
    const targetY = (state.pointer.y * Math.PI) / 16;
    
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetX, delta * 2);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -targetY, delta * 2);
  });

  return (
    <Float rotationIntensity={0.2} floatIntensity={0.5} speed={1.5}>
      <group ref={group} {...props} dispose={null}>
        {/* Custom 3D Desk */}
        <group position={[0, -2.1, 0]}>
          {/* Table Top */}
          <mesh position={[0, 0, 0]} receiveShadow castShadow>
            <boxGeometry args={[14, 0.3, 6]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.2} />
          </mesh>
          
          {/* Neon LED Strip behind the desk */}
          <mesh position={[0, -0.15, -3.05]}>
            <boxGeometry args={[14, 0.1, 0.1]} />
            <meshBasicMaterial color="#a78bfa" />
            <pointLight color="#a78bfa" intensity={2} distance={10} position={[0, 0, 0]} />
          </mesh>

          {/* Desk Legs */}
          <mesh position={[-6.5, -2, -2.5]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 4]} />
            <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[6.5, -2, -2.5]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 4]} />
            <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[-6.5, -2, 2.5]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 4]} />
            <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[6.5, -2, 2.5]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 4]} />
            <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* The PC Model */}
        {/* We use position-y to align the bottom of the PC exactly on top of the desk */}
        <Center scale={4} position={[0, -0.5, 0]}>
          <primitive object={scene} />
        </Center>
      </group>
    </Float>
  );
}

useGLTF.preload("/models/desktop.glb");
