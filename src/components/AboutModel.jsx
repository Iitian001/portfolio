import React from 'react';
import { useGLTF } from '@react-three/drei';

export default function AboutModel(props) {
  const { scene } = useGLTF('/models/about-model.glb');
  
  return (
    <primitive object={scene} {...props} />
  );
}

useGLTF.preload('/models/about-model.glb');
