import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment } from "@react-three/drei";
import type { Mesh, Group } from "three";

function Shard() {
  const ref = useRef<Mesh>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.25;
    ref.current.rotation.x += delta * 0.08;
  });
  return (
    <mesh ref={ref} scale={2.2}>
      <icosahedronGeometry args={[1, 1]} />
      <MeshDistortMaterial
        color="#0a0a0a"
        roughness={0.15}
        metalness={0.9}
        distort={0.35}
        speed={1.4}
        emissive="#00110a"
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}

function Rig({ children }: { children: React.ReactNode }) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const { x, y } = state.pointer;
    ref.current.rotation.y += (x * 0.4 - ref.current.rotation.y) * 0.05;
    ref.current.rotation.x += (-y * 0.3 - ref.current.rotation.x) * 0.05;
  });
  return <group ref={ref}>{children}</group>;
}

export function ObsidianShard() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-4, -2, -3]} intensity={2} color="#7cff9e" />
      <pointLight position={[4, 3, 2]} intensity={1.4} color="#ffffff" />
      <Suspense fallback={null}>
        <Rig>
          <Float speed={1.2} rotationIntensity={0.6} floatIntensity={1.2}>
            <Shard />
          </Float>
        </Rig>
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
