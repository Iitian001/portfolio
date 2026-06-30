import * as THREE from "three";

let webglSupportCache: boolean | null = null;

const suppressedMessages = [
  "THREE.WebGLRenderer: A WebGL context could not be created.",
  "THREE.WebGLRenderer: Error creating WebGL context.",
];

export function canUseWebGLRenderer() {
  if (webglSupportCache !== null) {
    return webglSupportCache;
  }

  if (typeof window === "undefined" || !window.WebGLRenderingContext) {
    webglSupportCache = false;
    return webglSupportCache;
  }

  const originalConsoleError = console.error;
  let renderer: THREE.WebGLRenderer | null = null;

  console.error = (...args: unknown[]) => {
    const [message] = args;
    if (
      typeof message === "string" &&
      suppressedMessages.some((entry) => message.includes(entry))
    ) {
      return;
    }

    originalConsoleError(...args);
  };

  try {
    renderer = new THREE.WebGLRenderer({
      canvas: document.createElement("canvas"),
      alpha: true,
      antialias: false,
      failIfMajorPerformanceCaveat: true,
      powerPreference: "high-performance",
    });

    webglSupportCache = true;
  } catch {
    webglSupportCache = false;
  } finally {
    if (renderer) {
      renderer.dispose();
      renderer.forceContextLoss();
    }

    console.error = originalConsoleError;
  }

  return webglSupportCache;
}