import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, MeshTransmissionMaterial, Float, Points, PointMaterial, Sparkles } from '@react-three/drei';
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

function GatewayObject() {
  const groupRef = useRef();
  const innerRef = useRef();

  useFrame((state, delta) => {
    // Continuous rotation
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x -= delta * 0.2;
      innerRef.current.rotation.y += delta * 0.3;
    }

    // Parallax effect
    const targetX = (state.mouse.x * Math.PI) / 8;
    const targetY = (state.mouse.y * Math.PI) / 8;

    // Smooth damp towards target
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY, 0.1);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -targetX, 0.1);
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5}>
        {/* Outer subtle frame */}
        <mesh position={[0, 0, 0]}>
          <octahedronGeometry args={[2.5, 0]} />
          <meshBasicMaterial color="#ffffff" wireframe={true} transparent opacity={0.15} />
        </mesh>

        {/* Inner glass-like object */}
        <mesh ref={innerRef}>
          <icosahedronGeometry args={[1.5, 0]} />
          <MeshTransmissionMaterial
            backside
            samples={4}
            thickness={0.5}
            chromaticAberration={0.05}
            anisotropy={0.3}
            distortion={0.1}
            distortionScale={0.5}
            temporalDistortion={0.1}
            color="#EAEAEA"
            attenuationColor="#ffffff"
            attenuationDistance={1}
            transmission={1}
            roughness={0.1}
            ior={1.5}
          />
        </mesh>

        {/* Small blue core */}
        <mesh>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshPhysicalMaterial
            color="#3b82f6"
            emissive="#1e3a8a"
            metalness={1}
            roughness={0.2}
            clearcoat={1}
          />
        </mesh>
      </Float>
    </group>
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

      {/* Environment for reflections on the glass object */}
      <Environment preset="city" />

      {/* Main 3D Abstract Object */}
      <GatewayObject />

      {/* Background Particles */}
      <ParticleField />

      {/* Additional Sparkles for "magic" Dust */}
      <Sparkles count={50} scale={10} size={2} speed={0.4} opacity={0.3} color="#ffffff" />
    </>
  );
}
