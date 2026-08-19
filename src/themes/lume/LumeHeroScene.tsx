"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

const pointer = { x: 0, y: 0 };

function TrackPointer() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return null;
}

function GoldCore({ calm = false }: { calm?: boolean }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.rotation.y = t * 0.16 + (calm ? 0 : pointer.x * 0.24);
    ref.current.rotation.x = t * 0.08 + (calm ? 0 : pointer.y * 0.18);
    ref.current.position.x = calm ? 0 : pointer.x * 0.35;
    ref.current.position.y = calm ? 0 : pointer.y * 0.25;
  });

  return (
    <Float
      speed={calm ? 0.6 : 1.4}
      floatIntensity={calm ? 0.3 : 0.8}
      rotationIntensity={0.4}
    >
      <mesh ref={ref} scale={1.7}>
        <icosahedronGeometry args={[1, 26]} />
        <MeshDistortMaterial
          color="#c89b3c"
          roughness={0.5}
          metalness={0.1}
          emissive="#b8892f"
          emissiveIntensity={0.35}
          distort={calm ? 0.18 : 0.4}
          speed={calm ? 0.6 : 1.3}
        />
      </mesh>
    </Float>
  );
}

function GoldRing({
  radius = 2.35,
  calm = false,
}: {
  radius?: number;
  calm?: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z =
      clock.elapsedTime * 0.1 + (calm ? 0 : pointer.x * 0.12);
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.22) * 0.45;
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2.2, 0.4, 0]}>
      <torusGeometry args={[radius, 0.008, 12, 140]} />
      <meshBasicMaterial color="#f4d98a" transparent opacity={0.55} />
    </mesh>
  );
}

function WireShell({ calm = false }: { calm?: boolean }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = -clock.elapsedTime * 0.06;
    ref.current.rotation.x = clock.elapsedTime * 0.04 + Math.PI / 6;
  });

  return (
    <mesh ref={ref} scale={3.4}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#d4ac52"
        wireframe
        transparent
        opacity={calm ? 0.06 : 0.12}
      />
    </mesh>
  );
}

function OrbitingMoon({
  radius,
  speed,
  size,
  calm = false,
}: {
  radius: number;
  speed: number;
  size: number;
  calm?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * speed;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius;
    ref.current.position.y = Math.sin(t * 0.7) * 0.4;
  });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[size, 20, 20]} />
        <meshBasicMaterial color={calm ? "#8a7440" : "#f4d98a"} />
      </mesh>
    </group>
  );
}

export default function LumeHeroScene({
  calm = false,
  className,
}: {
  calm?: boolean;
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={className}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: "none" }}
      >
        <TrackPointer />
        <ambientLight intensity={0.9} />

        <GoldCore calm={calm} />
        <WireShell calm={calm} />
        <GoldRing calm={calm} radius={2.5} />
        <GoldRing calm={calm} radius={3.1} />
        <OrbitingMoon calm={calm} radius={2.9} speed={0.5} size={0.07} />
        <OrbitingMoon calm={calm} radius={3.4} speed={-0.34} size={0.05} />
        <OrbitingMoon calm={calm} radius={2.1} speed={0.75} size={0.04} />

        <Sparkles
          count={90}
          scale={[12, 8, 6]}
          size={3}
          speed={0.5}
          color="#f6dfa0"
          opacity={0.7}
        />

        <EffectComposer>
          <Bloom
            intensity={0.32}
            luminanceThreshold={0.18}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}