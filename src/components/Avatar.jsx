import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useFrame, useGraph } from "@react-three/fiber";
import React, { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";

export function Avatar({ animation = "Idle", ...props }) {
  const group = useRef();
  
  // Load the expressive robot model
  const { scene, animations } = useGLTF("/models/RobotExpressive.glb");
  
  // Clone the scene and optimize materials for premium glossy and metallic looks
  const clone = useMemo(() => {
    const c = SkeletonUtils.clone(scene);
    c.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        
        // Keep the original colors but make them look premium under WebGL lighting
        if (node.material) {
          node.material = node.material.clone();
          
          if (node.name.includes("Head") || node.name.includes("Torso")) {
            // White body plates: Sleek, glossy ceramic look
            node.material.roughness = 0.15;
            node.material.metalness = 0.05;
          } else {
            // Joints, hands, feet: Cyberpunk metallic look
            node.material.metalness = 0.8;
            node.material.roughness = 0.25;
          }
        }
      }
    });
    return c;
  }, [scene]);

  // Bind the embedded animations
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // Map the animations to the mixer actions
    const action = actions[animation];
    if (action) {
      action.reset().fadeIn(0.3).play();
      return () => action.fadeOut(0.3);
    }
  }, [animation, actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={clone} />
    </group>
  );
}

useGLTF.preload("/models/RobotExpressive.glb");
