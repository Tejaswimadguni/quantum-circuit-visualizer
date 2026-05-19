import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { useMemo, useRef } from 'react';
import { Euler, Group, Mesh, Vector3 } from 'three';

type QubitState = {
  label: string;
  probabilityZero: number;
  probabilityOne: number;
  vector: [number, number, number];
  color: string;
};

type BlochSphereProps = {
  qubitStates: QubitState[];
  loading: boolean;
};

function SphereFrame() {
  return (
    <mesh>
      <sphereGeometry args={[1.01, 64, 64]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
    </mesh>
  );
}

function Axis({ color, direction }: { color: string; direction: [number, number, number] }) {
  const rotation = direction[0]
    ? new Euler(0, 0, Math.PI / 2)
    : direction[2]
    ? new Euler(Math.PI / 2, 0, 0)
    : new Euler(0, 0, 0);

  return (
    <group>
      <mesh position={direction.map((value) => value * 0.85) as [number, number, number]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} />
      </mesh>
      <mesh rotation={rotation}>
        <cylinderGeometry args={[0.01, 0.01, 1.7, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function StateDot({ vector, color }: { vector: [number, number, number]; color: string }) {
  const ref = useRef<Mesh>(null);
  const target = useMemo(() => new Vector3(...vector), [vector]);

  useFrame((_, delta) => {
    if (!ref.current) {
      return;
    }
    ref.current.position.lerp(target, Math.min(1, delta * 2.5));
    ref.current.rotation.y += delta * 1.1;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.07, 32, 32]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} metalness={0.3} roughness={0.2} />
    </mesh>
  );
}

function ParticleField() {
  const particles = useMemo(
    () =>
      new Array(11).fill(null).map((_, idx) => {
        const angle = (idx / 11) * Math.PI * 2;
        const radius = 1.35 + (idx % 2 ? 0.04 : -0.04);
        return {
          position: [Math.cos(angle) * radius, Math.sin(angle) * 0.05, Math.sin(angle) * radius] as [number, number, number],
          scale: 0.02 + Math.random() * 0.03,
          delay: idx * 0.1,
        };
      }),
    []
  );

  return (
    <group>
      {particles.map((particle, index) => (
        <mesh
          key={index}
          position={particle.position}
          scale={[particle.scale, particle.scale, particle.scale]}
        >
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial color="#5eead4" transparent opacity={0.25} />
        </mesh>
      ))}
    </group>
  );
}

function BlochScene({ vector, color, loading }: { vector: [number, number, number]; color: string; loading: boolean }) {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.12;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.08;
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#061125"
          transparent
          opacity={0.35}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      <SphereFrame />
      <Axis color="#5eead4" direction={[0, 1, 0]} />
      <Axis color="#f472b6" direction={[1, 0, 0]} />
      <Axis color="#7c3aed" direction={[0, 0, 1]} />
      <axesHelper args={[1.05]} />
      <StateDot vector={vector} color={color} />
      <ParticleField />
    </group>
  );
}

export default function BlochSphere({ qubitStates, loading }: BlochSphereProps) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#061028]/95 p-5 shadow-glow">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/85">Bloch visualization</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Qubit state spheres</h3>
        </div>
        <div className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-300">
          {loading ? 'Updating...' : 'Synchronized'}
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {qubitStates.map((state) => (
          <motion.div
            key={state.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#07111f]/90 p-4"
          >
            <div className="absolute inset-x-4 top-4 flex items-center justify-between text-xs uppercase tracking-[0.28em] text-slate-500">
              <span className="text-cyan-300">{state.label}</span>
              <span>{(state.probabilityZero * 100).toFixed(1)}% |0⟩</span>
            </div>
            <div className="pointer-events-none absolute inset-0">
              <span className="absolute left-3 top-10 text-[10px] uppercase tracking-[0.2em] text-cyan-300">X</span>
              <span className="absolute right-3 top-10 text-[10px] uppercase tracking-[0.2em] text-fuchsia-300">Y</span>
              <span className="absolute left-1/2 top-3 -translate-x-1/2 text-[10px] uppercase tracking-[0.2em] text-slate-400">|0⟩</span>
              <span className="absolute left-1/2 bottom-3 -translate-x-1/2 text-[10px] uppercase tracking-[0.2em] text-slate-400">|1⟩</span>
              <span className="absolute right-3 bottom-10 text-[10px] uppercase tracking-[0.2em] text-violet-300">Z</span>
            </div>
            {loading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[1.75rem] bg-slate-950/40 backdrop-blur-sm">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-300/40 border-t-cyan-100" />
              </div>
            )}
            <div className="h-72">
              <Canvas camera={{ position: [0, 0, 3.6], fov: 35 }} dpr={[1, 2]}>
                <ambientLight intensity={0.45} />
                <directionalLight position={[4, 5, 4]} intensity={0.8} />
                <pointLight position={[-4, -2, 3]} intensity={0.5} />
                <BlochScene vector={state.vector} color={state.color} loading={loading} />
              </Canvas>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <div className="flex items-center justify-between rounded-3xl bg-white/5 px-3 py-2">
                <span>X axis</span>
                <span className="font-semibold text-white">{state.vector[0].toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between rounded-3xl bg-white/5 px-3 py-2">
                <span>Y axis</span>
                <span className="font-semibold text-white">{state.vector[1].toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between rounded-3xl bg-white/5 px-3 py-2">
                <span>Z axis</span>
                <span className="font-semibold text-white">{state.vector[2].toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
