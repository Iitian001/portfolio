import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
} from "@react-three/rapier";
import WebGLErrorBoundary from "./WebGLErrorBoundary";
import { canUseWebGLRenderer } from "./utils/webgl";

const textureLoader = new THREE.TextureLoader();
const imageUrls = [
  "/images/react2.webp",
  "/images/next2.webp",
  "/images/node2.webp",
  "/images/express.webp",
  "/images/mongo.webp",
  "/images/mysql.webp",
  "/images/typescript.webp",
  "/images/javascript.webp",
  "/images/python.png",
  "/images/cplusplus.png",
  "/images/rust.png",
  "/images/tensorflow.png",
  "/images/ai.png",
];
const textures = imageUrls.map((url) => textureLoader.load(url));

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

const spheres = [...Array(45)].map(() => ({
  scale: [0.7, 1, 0.8, 1, 1][Math.floor(Math.random() * 5)],
}));

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}) {
  const api = useRef(null);

  useFrame((_state, delta) => {
    if (!isActive || !api.current) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );

    api.current.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

function Pointer({ vec = new THREE.Vector3(), isActive }) {
  const ref = useRef(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const [isActive, setIsActive] = useState(false);
  const [webglAvailable] = useState(() => canUseWebGLRenderer());

  useEffect(() => {
    const handleScroll = () => {
      // In this setup, we will just make it active if it's rendered,
      // or check the scroll position. We can just force it to true for simplicity
      // and ensure the physics runs.
      setIsActive(true);
    };
    handleScroll();
  }, []);

  const materials = useMemo(() => {
    return textures.map(
      (texture) =>
        new THREE.MeshPhysicalMaterial({
          map: texture,
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.3,
          metalness: 0.5,
          roughness: 1,
          clearcoat: 0.1,
        })
    );
  }, []);

  const fallback = (
    <div className="techstack-fallback" role="status">
      <span>Interactive tech stack unavailable on this device.</span>
    </div>
  );

  return (
    <div className="techstack" style={{ height: '600px', width: '100%', position: 'relative', zIndex: 10 }}>
      {webglAvailable ? (
        <WebGLErrorBoundary fallback={fallback}>
          <Canvas
            shadows
            gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
            camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
            onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
            className="tech-canvas"
          >
            <ambientLight intensity={1} />
            <spotLight
              position={[20, 20, 25]}
              penumbra={1}
              angle={0.2}
              color="white"
              castShadow
              shadow-mapSize={[512, 512]}
            />
            <directionalLight position={[0, 5, -4]} intensity={2} />
            <Physics gravity={[0, 0, 0]}>
              <Pointer isActive={isActive} />
              {spheres.map((props, i) => (
                <SphereGeo
                  key={i}
                  {...props}
                  material={materials[Math.floor(Math.random() * materials.length)]}
                  isActive={isActive}
                />
              ))}
            </Physics>
            <Environment
              files="/models/char_enviorment.hdr"
              environmentIntensity={0.5}
              environmentRotation={[0, 4, 2]}
            />
            <EffectComposer enableNormalPass={false}>
              <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
            </EffectComposer>
          </Canvas>
        </WebGLErrorBoundary>
      ) : (
        fallback
      )}
    </div>
  );
};

export default TechStack;
