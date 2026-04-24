import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Animated stock chart line
function StockLine() {
  const ref = useRef<THREE.Line>(null!);
  const glowRef = useRef<THREE.Line>(null!);

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const data = [0, 0.3, 0.1, 0.5, 0.3, 0.7, 0.5, 0.9, 0.6, 1.0, 0.75, 1.1, 0.85, 1.3, 1.0, 1.2, 1.1, 1.5];
    const w = 4;
    data.forEach((y, i) => {
      pts.push(new THREE.Vector3((i / (data.length - 1)) * w - w / 2, y - 0.5, 0));
    });
    return pts;
  }, []);

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = Math.sin(t * 0.3) * 0.15;
      ref.current.rotation.x = Math.sin(t * 0.2) * 0.05;
      ref.current.position.y = Math.sin(t * 0.4) * 0.1;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y = ref.current?.rotation.y ?? 0;
      glowRef.current.rotation.x = ref.current?.rotation.x ?? 0;
      glowRef.current.position.y = ref.current?.position.y ?? 0;
    }
  });

  return (
    <group>
      {/* Glow line (wider, semi-transparent) */}
      <primitive ref={glowRef} object={new THREE.Line(geometry,
        new THREE.LineBasicMaterial({ color: '#10B981', transparent: true, opacity: 0.15, linewidth: 3 })
      )} scale={[1, 1, 1]} />
      {/* Main line */}
      <primitive ref={ref} object={new THREE.Line(geometry,
        new THREE.LineBasicMaterial({ color: '#10B981', linewidth: 2 })
      )} />
    </group>
  );
}

// Vertical bar chart
function BarChart() {
  const group = useRef<THREE.Group>(null!);
  const heights = [0.4, 0.7, 0.5, 0.9, 0.6, 1.1, 0.8, 1.3, 1.0, 0.7, 1.2];

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={group} position={[0, -0.5, 0]}>
      {heights.map((h, i) => (
        <Float key={i} speed={1.5} rotationIntensity={0} floatIntensity={0.2} floatingRange={[0, 0.05]}>
          <mesh position={[(i - heights.length / 2) * 0.3, h / 2 - 0.5, 0]}>
            <boxGeometry args={[0.18, h, 0.18]} />
            <meshStandardMaterial
              color="#10B981"
              emissive="#10B981"
              emissiveIntensity={0.4}
              transparent
              opacity={0.85}
              metalness={0.3}
              roughness={0.4}
            />
          </mesh>
        </Float>
      ))}
      {/* Grid plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[heights.length * 0.3 + 0.5, 2]} />
        <meshStandardMaterial color="#10B981" transparent opacity={0.03} />
      </mesh>
    </group>
  );
}

// Floating rupee/dollar symbols
function FloatingSymbols() {
  const group = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const positions: [number, number, number][] = [
    [2.5, 1.2, -1], [-2.3, 0.8, -0.5], [1.8, -0.9, -1.5],
    [-1.5, -1.2, -0.8], [3, -0.3, -2], [-2.8, 1.5, -1.2],
  ];

  return (
    <group ref={group}>
      {positions.map((pos, i) => (
        <Float key={i} speed={1 + i * 0.3} floatIntensity={0.5} rotationIntensity={0.3}>
          <mesh position={pos}>
            <torusGeometry args={[0.12, 0.03, 8, 16]} />
            <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.6} transparent opacity={0.5} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// Particle field
function Particles() {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const count = 800;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.05;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#10B981" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

// Mouse parallax scene wrapper
function Scene({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 0.3 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 3, 3]} color="#10B981" intensity={2} />
      <pointLight position={[-3, -2, 2]} color="#10B981" intensity={1} />
      <Stars radius={80} depth={50} count={2000} factor={2} fade speed={0.5} />
      <Particles />
      <FloatingSymbols />
      <group scale={[1, 1, 1]}>
        <BarChart />
        <StockLine />
      </group>
    </>
  );
}

interface HeroCanvasProps {
  mouseX: number;
  mouseY: number;
}

export default function HeroCanvas({ mouseX, mouseY }: HeroCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Scene mouseX={mouseX} mouseY={mouseY} />
    </Canvas>
  );
}
