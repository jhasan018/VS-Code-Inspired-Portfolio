"use client";

import { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
} from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
} from "@react-three/postprocessing";

function Object3D({
                    calm = false,
                  }: {
  calm?: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock, pointer }) => {
    if (!ref.current) return;

    ref.current.rotation.y =
        clock.elapsedTime * 0.18 +
        pointer.x * 0.22;

    ref.current.rotation.x =
        pointer.y * 0.16;
  });

  return (
      <Float
          speed={calm ? 0.6 : 1.2}
          floatIntensity={calm ? 0.35 : 0.7}
          rotationIntensity={0.35}
      >
        <mesh
            ref={ref}
            scale={2.15}
        >
          <icosahedronGeometry args={[1, 32]} />

          <MeshDistortMaterial
              color="#ff5a1f"
              roughness={0.32}
              metalness={0.74}
              distort={calm ? 0.22 : 0.42}
              speed={calm ? 0.7 : 1.4}
          />
        </mesh>
      </Float>
  );
}

export default function SignatureScene({
                                         calm = false,
                                       }: {
  calm?: boolean;
}) {
  return (
      <div
          className="signature-canvas"
          aria-hidden="true"
      >
        <Canvas
            dpr={[1, 1.5]}
            camera={{
              position: [0, 0, 6],
              fov: 45,
            }}
            gl={{
              antialias: true,
              alpha: true,
            }}
        >
          <ambientLight intensity={0.25} />

          <pointLight
              color="#fff"
              intensity={18}
              position={[2, 3, 4]}
          />

          <pointLight
              color="#ff5a1f"
              intensity={24}
              position={[-3, -2, 2]}
          />

          <Object3D calm={calm} />

          <EffectComposer>
            <Bloom
                intensity={0.65}
                luminanceThreshold={0.2}
            />
          </EffectComposer>
        </Canvas>
      </div>
  );
}