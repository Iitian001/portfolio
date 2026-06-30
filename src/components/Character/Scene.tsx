import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";
import { canUseWebGLRenderer } from "../utils/webgl";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  useEffect(() => {
    const containerElement = canvasDiv.current;

    if (!containerElement) {
      return;
    }

    let isMounted = true;
    let debounce: number | undefined;
    let animationFrameId = 0;
    let renderer: THREE.WebGLRenderer | null = null;
    let character: THREE.Object3D | null = null;
    let headBone: THREE.Object3D | null = null;
    let screenLight: THREE.Object3D | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    const scene = sceneRef.current;
    const rect = containerElement.getBoundingClientRect();
    const container = {
      width: rect.width || containerElement.clientWidth || window.innerWidth,
      height:
        rect.height || containerElement.clientHeight || window.innerHeight,
    };
    const aspect = container.width / Math.max(container.height, 1);
    const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    const clock = new THREE.Clock();

    const handleWebGLFailure = () => {
      if (!isMounted) {
        return;
      }

      setWebglUnavailable(true);
      setLoading(100);
    };

    if (!canUseWebGLRenderer()) {
      handleWebGLFailure();
      return;
    }

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
    } catch {
      handleWebGLFailure();
      return;
    }

    setWebglUnavailable(false);
    renderer.setSize(container.width, container.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    containerElement.appendChild(renderer.domElement);

    camera.position.z = 10;
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.1;
    camera.updateProjectionMatrix();

    const light = setLighting(scene);
    const progress = setProgress((value) => {
      if (isMounted) {
        setLoading(value);
      }
    });
    const { loadCharacter } = setCharacter(renderer, scene, camera);

    loadCharacter()
      .then((gltf) => {
        if (!isMounted || !gltf) {
          return;
        }

        const animations = setAnimations(gltf);
        if (hoverDivRef.current) {
          animations.hover(gltf, hoverDivRef.current);
        }

        mixer = animations.mixer;
        character = gltf.scene;
        scene.add(character);
        headBone = character.getObjectByName("spine006") || null;
        screenLight = character.getObjectByName("screenlight") || null;

        progress.loaded().then(() => {
          if (!isMounted) {
            return;
          }

          setTimeout(() => {
            if (!isMounted) {
              return;
            }

            light.turnOnLights();
            animations.startIntro();
          }, 2500);
        });
      })
      .catch(() => {
        handleWebGLFailure();
      });

    let mouse = { x: 0, y: 0 };
    let interpolation = { x: 0.1, y: 0.2 };
    const touchMoveHandler = (event: TouchEvent) => {
      handleTouchMove(event, (x, y) => {
        mouse = { x, y };
      });
    };

    const onMouseMove = (event: MouseEvent) => {
      handleMouseMove(event, (x, y) => {
        mouse = { x, y };
      });
    };

    const onTouchStart = (event: TouchEvent) => {
      const element = event.target as HTMLElement;
      debounce = window.setTimeout(() => {
        element?.addEventListener("touchmove", touchMoveHandler);
      }, 200);
    };

    const onTouchEnd = () => {
      handleTouchEnd((x, y, interpolationX, interpolationY) => {
        mouse = { x, y };
        interpolation = { x: interpolationX, y: interpolationY };
      });
    };

    const onResize = () => {
      if (renderer && character) {
        handleResize(renderer, camera, canvasDiv, character);
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);

    const landingDiv = document.getElementById("landingDiv");
    if (landingDiv) {
      landingDiv.addEventListener("touchstart", onTouchStart);
      landingDiv.addEventListener("touchend", onTouchEnd);
    }

    const animate = () => {
      animationFrameId = window.requestAnimationFrame(animate);
      if (!renderer) {
        return;
      }

      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x,
          mouse.y,
          interpolation.x,
          interpolation.y,
          THREE.MathUtils.lerp
        );
        light.setPointLight(screenLight);
      }

      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isMounted = false;
      window.clearTimeout(debounce);
      window.cancelAnimationFrame(animationFrameId);
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);

      if (landingDiv) {
        landingDiv.removeEventListener("touchstart", onTouchStart);
        landingDiv.removeEventListener("touchend", onTouchEnd);
        landingDiv.removeEventListener("touchmove", touchMoveHandler);
      }

      scene.clear();

      if (renderer) {
        renderer.renderLists.dispose();
        renderer.dispose();
        renderer.forceContextLoss();

        if (containerElement.contains(renderer.domElement)) {
          containerElement.removeChild(renderer.domElement);
        }
      }
    };
  }, [setLoading]);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
          {webglUnavailable && (
            <div className="character-fallback" role="status">
              <span>3D preview unavailable on this device.</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Scene;
