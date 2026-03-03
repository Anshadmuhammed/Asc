import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Procedurally generate some particles
function ParticleField() {
  const count = 300;
  const positions = useMemo(() => {
    const coords = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spread them across a wide volume
      coords[i * 3] = (Math.random() - 0.5) * 20;
      coords[i * 3 + 1] = (Math.random() - 0.5) * 20;
      coords[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    return coords;
  }, [count]);

  const pointsRef = useRef();

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
      pointsRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#ffffff" size={0.03} sizeAttenuation={true} depthWrite={false} opacity={0.6} />
    </Points>
  );
}

export default function Scene() {
  return (
    <>
      <color attach="background" args={['#0a192f']} />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} color="#ffffff" />
      <spotLight position={[-5, -5, -5]} intensity={2} color="#3b82f6" distance={20} penumbra={1} />

      {/* Background Particles */}
      <ParticleField />

      {/* Additional Sparkles for "magic" Dust */}
      <Sparkles count={50} scale={10} size={2} speed={0.4} opacity={0.3} color="#ffffff" />
    </>
  );
}
