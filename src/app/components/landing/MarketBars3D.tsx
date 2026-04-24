import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface StockBar {
  ticker: string;
  height: number;
  up: boolean;
  targetHeight: number;
}

function Bar({ height, up, position, ticker }: { height: number; up: boolean; position: [number, number, number]; ticker: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const currentHeight = useRef(height);

  useFrame(() => {
    if (meshRef.current) {
      // Smooth interpolation to target height
      currentHeight.current += (height - currentHeight.current) * 0.05;
      meshRef.current.scale.y = currentHeight.current;
      meshRef.current.position.y = (currentHeight.current * 1.2) / 2;
    }
  });

  const color = up ? '#10B981' : '#ef4444';
  const emissive = up ? '#10B981' : '#ef4444';

  return (
    <Float floatIntensity={0.1} speed={1} rotationIntensity={0}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[0.25, 1.2, 0.25]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.3}
          transparent
          opacity={0.9}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
    </Float>
  );
}

function Grid() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[12, 6]} />
      <meshStandardMaterial color="#10B981" transparent opacity={0.02} wireframe />
    </mesh>
  );
}

const INITIAL_STOCKS = [
  { ticker: 'NVDA', height: 1.8, up: true },
  { ticker: 'AAPL', height: 1.3, up: true },
  { ticker: 'TSLA', height: 0.8, up: false },
  { ticker: 'MSFT', height: 1.5, up: true },
  { ticker: 'META', height: 1.6, up: true },
  { ticker: 'GOOGL', height: 1.1, up: false },
  { ticker: 'AMZN', height: 1.4, up: true },
  { ticker: 'NFLX', height: 0.9, up: false },
].map(s => ({ ...s, targetHeight: s.height }));

export default function MarketBars3D() {
  const [bars, setBars] = useState<StockBar[]>(INITIAL_STOCKS);

  // Randomly fluctuate bars
  useEffect(() => {
    const interval = setInterval(() => {
      setBars(prev => prev.map(b => ({
        ...b,
        targetHeight: Math.max(0.3, b.height + (Math.random() - 0.5) * 0.2),
        up: Math.random() > 0.45,
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 60 }} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 5, 5]} color="#10B981" intensity={3} />
      <pointLight position={[0, -2, 2]} color="#ffffff" intensity={0.5} />
      <Grid />
      {bars.map((b, i) => (
        <Bar
          key={b.ticker}
          height={b.height}
          up={b.up}
          ticker={b.ticker}
          position={[(i - bars.length / 2 + 0.5) * 1.2, 0, 0]}
        />
      ))}
    </Canvas>
  );
}
