import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

async function generateAESKey(password: string): Promise<CryptoKey> {
  const passwordBuffer = new TextEncoder().encode(password);
  const hashedPassword = await crypto.subtle.digest("SHA-256", passwordBuffer);
  return crypto.subtle.importKey("raw", hashedPassword.slice(0, 32), { name: "AES-CBC" }, false, ["decrypt"]);
}

async function decryptFile(url: string, password: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  const encryptedData = await response.arrayBuffer();
  const iv = new Uint8Array(encryptedData.slice(0, 16));
  const data = encryptedData.slice(16);
  const key = await generateAESKey(password);
  return crypto.subtle.decrypt({ name: "AES-CBC", iv }, key, data);
}

export function CharacterHero() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const hoverRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "unsupported">("loading");

  useEffect(() => {
    if (!mountRef.current) {
      return;
    }

    const container = mountRef.current;
    const scene = new THREE.Scene();
    const initialWidth = Math.max(container.clientWidth, 1);
    const initialHeight = Math.max(container.clientHeight, 1);
    const camera = new THREE.PerspectiveCamera(26, initialWidth / initialHeight, 0.1, 1000);
    camera.position.set(0, 1.8, 12.8);
    camera.updateProjectionMatrix();

    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
    } catch {
      setStatus("unsupported");
      return;
    }

    renderer.setSize(initialWidth, initialHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const directionalLight = new THREE.DirectionalLight(0xc7a9ff, 1.2);
    directionalLight.position.set(2, 4, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xc2a4ff, 5.5, 100, 3);
    pointLight.position.set(-3, 4, 6);
    scene.add(pointLight);

    const fillLight = new THREE.PointLight(0x38bdf8, 3.2, 100, 2);
    fillLight.position.set(4, 2, 4);
    scene.add(fillLight);

    new RGBELoader().setPath("/models/").load("char_enviorment.hdr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0.55;
      scene.environmentRotation.set(5.76, 85.85, 1);
    });

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    let headBone: THREE.Object3D | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let rootCharacter: THREE.Object3D | null = null;
    let animationFrameId = 0;
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    const clock = new THREE.Clock();
    let mouse = { x: 0, y: 0 };
    let interpolation = { x: 0.08, y: 0.12 };

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const onResize = () => {
      if (!mountRef.current) {
        return;
      }
      const rect = mountRef.current.getBoundingClientRect();
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const onTouchMove = (event: TouchEvent) => {
      mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    };

    decryptFile("/models/character.enc", "Character3D#@")
      .then((buffer) => {
        const blobUrl = URL.createObjectURL(new Blob([buffer]));
        loader.load(
          blobUrl,
          async (gltf) => {
            rootCharacter = gltf.scene;
            rootCharacter.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
              }
            });
            await renderer.compileAsync(rootCharacter, camera, scene);

            const box = new THREE.Box3().setFromObject(rootCharacter);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            const targetHeight = 7.1;
            const scale = targetHeight / Math.max(size.y, 0.001);

            rootCharacter.scale.setScalar(scale);
            rootCharacter.position.x = -center.x * scale;
            rootCharacter.position.y = -center.y * scale + 1.35;
            rootCharacter.position.z = -center.z * scale;
            rootCharacter.rotation.y = 0.32;

            headBone = rootCharacter.getObjectByName("spine006") ?? rootCharacter.getObjectByName("Head") ?? null;
            modelGroup.add(rootCharacter);

            if (gltf.animations.length > 0) {
              mixer = new THREE.AnimationMixer(rootCharacter);
              gltf.animations.forEach((clip) => {
                if (clip.name === "introAnimation") {
                  const action = mixer!.clipAction(clip);
                  action.setLoop(THREE.LoopOnce, 1);
                  action.clampWhenFinished = true;
                  action.play();
                }
              });
            }

            setStatus("ready");
            URL.revokeObjectURL(blobUrl);
          },
          undefined,
          () => {
            setStatus("error");
            URL.revokeObjectURL(blobUrl);
          },
        );
      })
      .catch(() => setStatus("error"));

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (headBone) {
        const maxRotation = Math.PI / 6;
        headBone.rotation.y = THREE.MathUtils.lerp(headBone.rotation.y, mouse.x * maxRotation, interpolation.y);
        headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, -mouse.y * 0.25, interpolation.x);
      }

      modelGroup.rotation.y = THREE.MathUtils.lerp(modelGroup.rotation.y, 0.24 + mouse.x * 0.08, 0.03);
      modelGroup.rotation.x = THREE.MathUtils.lerp(modelGroup.rotation.x, -0.02 + mouse.y * 0.03, 0.03);
      modelGroup.position.y = Math.sin(clock.elapsedTime * 0.9) * 0.08;

      const delta = clock.getDelta();
      mixer?.update(delta);
      renderer.render(scene, camera);
    };

    animate();
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);
    container.addEventListener("touchmove", onTouchMove);

    const handleMouseEnter = () => {
      interpolation = { x: 0.12, y: 0.16 };
    };
    const handleMouseLeave = () => {
      interpolation = { x: 0.08, y: 0.12 };
    };

    if (hoverRef.current) {
      hoverRef.current.addEventListener("mouseenter", handleMouseEnter);
      hoverRef.current.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("touchmove", onTouchMove);
      if (hoverRef.current) {
        hoverRef.current.removeEventListener("mouseenter", handleMouseEnter);
        hoverRef.current.removeEventListener("mouseleave", handleMouseLeave);
      }
      scene.clear();
      renderer.dispose();
      dracoLoader.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="character-shell relative mx-auto h-[500px] w-full max-w-[500px]">
      <div className="character-rim absolute left-1/2 top-[72%] z-0 h-[220px] w-[320px] -translate-x-1/2 scale-x-[1.35] rounded-full bg-[#f59bf8]/60 blur-[50px]" />
      <div
        ref={mountRef}
        className="character-model relative z-10 h-full w-full overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_48%),linear-gradient(180deg,rgba(6,10,23,0.96),rgba(4,7,18,0.92))]"
      />
      <div ref={hoverRef} className="character-hover absolute left-1/2 top-[52%] z-20 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full" />

      {status !== "ready" ? (
        <div className="absolute inset-0 z-30 flex items-center justify-center rounded-[2rem] border border-white/10 bg-black/35 backdrop-blur-sm">
          <div className="px-6 text-center">
            {status === "loading" ? (
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
            ) : (
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
                3D
              </div>
            )}
            <p className="mt-4 text-sm uppercase tracking-[0.3em] text-cyan-300">
              {status === "loading" ? "Loading Model" : "3D Preview Unavailable"}
            </p>
            {status !== "loading" ? (
              <p className="mt-3 max-w-[240px] text-xs leading-5 text-slate-300/80">
                This browser could not create a WebGL context, so the hero falls back to a static panel.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
