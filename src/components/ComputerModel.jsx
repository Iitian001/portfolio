import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF, useTexture, Float, Center } from '@react-three/drei';
import * as THREE from 'three';

export default function ComputerModel(props) {
  const group = useRef();
  
  // Load the retro computer desk model
  const { scene } = useGLTF("/models/computer-optimized-transformed.glb");
  
  // Clone to avoid parent hierarchy mutation conflicts across multiple canvases
  const clone = useMemo(() => scene.clone(), [scene]);
  
  // Load static project screener thumbnail as the screen texture (100% reliable, no video block issues)
  const screenTex = useTexture("/projects/bharat.png");

  useEffect(() => {
    if (screenTex) {
      screenTex.colorSpace = THREE.SRGBColorSpace;
      screenTex.minFilter = THREE.LinearFilter;
      screenTex.magFilter = THREE.LinearFilter;
    }
  }, [screenTex]);

  // Programmatically attach the screen overlay to the computer desk mesh node
  useEffect(() => {
    if (!clone || !screenTex) return;

    // Create plane geometry and material mapped to the static image texture
    const geometry = new THREE.PlaneGeometry(1.35, 0.98);
    const material = new THREE.MeshBasicMaterial({
      map: screenTex,
      toneMapped: false,
      side: THREE.DoubleSide
    });
    
    const overlayMesh = new THREE.Mesh(geometry, material);
    
    // Position relative to the local origin of the ComputerDesk mesh node
    overlayMesh.position.set(0.0, 0.60, 0.28);
    overlayMesh.rotation.set(-0.08, 0, 0);

    let attached = false;
    clone.traverse((node) => {
      if (node.isMesh && node.name.includes("ComputerDesk")) {
        // Clear any old overlay meshes if hot-reloading
        node.children = node.children.filter(child => child.name !== "video_overlay");
        
        overlayMesh.name = "video_overlay";
        node.add(overlayMesh);
        attached = true;
      }
    });

    console.log("Attached image overlay:", attached);
  }, [clone, screenTex]);

  return (
    <Float rotationIntensity={0.15} floatIntensity={0.3} speed={1.2}>
      <group ref={group} {...props} dispose={null}>
        
        {/* Render the centered 3D Computer Desk Model */}
        <Center>
          <primitive object={clone} />
        </Center>
        
        {/* Screen Bezel Glow light effect */}
        <pointLight position={[0, 0.1, 0.4]} color="#a78bfa" intensity={0.5} distance={3} />
      </group>
    </Float>
  );
}

useGLTF.preload("/models/computer-optimized-transformed.glb");
