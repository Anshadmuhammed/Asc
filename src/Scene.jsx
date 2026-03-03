import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function InteractiveParticleField({ count = 5000, color = "#3b82f6", size = 0.05, radius = 20, flattenY = 0.3, scrollMultiplier = 0.001 }) {
  const mesh = useRef();

  // Custom setup for Float32Arrays and Physics Parameters (Incredibly optimized layout for CPU)
  const { positions, basePositions, randomFactors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);
    const rand = new Float32Array(count); // Cache random offsets to avoid expensive loops later

    for (let i = 0; i < count; i++) {
      // Gaussian distribution for 'Galaxy / Dense Field' aesthetics
      const r = radius * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);

      // Calculate coordinates and flatten them vertically
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = (r * Math.sin(phi) * Math.sin(theta)) * flattenY;
      const z = r * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      base[i * 3] = x;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = z;

      rand[i] = Math.random() * Math.PI * 2; // Pre-cache random phase
    }

    return { positions: pos, basePositions: base, randomFactors: rand };
  }, [count, radius, flattenY]);

  const scratchVec = new THREE.Vector3();

  useFrame((state) => {
    if (!mesh.current || !mesh.current.geometry.attributes.position) return;

    // 1. Capture exact mouse state dynamically in the 3D viewport space
    scratchVec.set(
      (state.mouse.x * state.viewport.width) / 2,
      (state.mouse.y * state.viewport.height) / 2,
      0
    );

    // Translate mouse strictly to local object coordinate rotation matrix
    mesh.current.worldToLocal(scratchVec);

    const positionsAttr = mesh.current.geometry.attributes.position;
    const posArray = positionsAttr.array;

    // Optimize: Pre-calculate time and scroll logic OUTSIDE the massive item loop
    const t = state.clock.elapsedTime;
    const scrollY = window.scrollY;

    // 2. Ultra-Lightweight CPU physics loop strictly modifying the position buffers
    // This scales massively because there are NO new objects/arrays created on frame updates
    for (let i = 0; i < count; i++) {
      const idx = i * 3;

      let x = posArray[idx];
      let y = posArray[idx + 1];
      let z = posArray[idx + 2];

      const baseX = basePositions[idx];
      const baseY = basePositions[idx + 1];
      const baseZ = basePositions[idx + 2];

      // Repulsion Engine / Mouse Distance calculation
      const dx = scratchVec.x - x;
      const dy = scratchVec.y - y;
      const dz = scratchVec.z - z;

      // Use fast distance squared to avoid expensive Math.sqrt calls 10,000 times
      const distSq = dx * dx + dy * dy + dz * dz;
      const interactRadiusSq = 15;

      if (distSq < interactRadiusSq) {
        const force = (interactRadiusSq - distSq) / interactRadiusSq;
        // Evasively push particles outwards from mouse cheaply
        x -= dx * force * 0.05;
        y -= dy * force * 0.05;
        z -= dz * force * 0.05;
      }

      // Elastic organic spring back to base formation when mouse leaves
      x += (baseX - x) * 0.08;
      y += (baseY - y) * 0.08;
      z += (baseZ - z) * 0.08;

      // Extremely cheap floating - using pre-cached random offsets to avoid Math.sin spam
      const wobble = Math.sin(t + randomFactors[i]) * 0.005;
      x += wobble;
      y += wobble;

      // Apply updated coordinates
      posArray[idx] = x;
      posArray[idx + 1] = y;
      posArray[idx + 2] = z;
    }

    // Alert GPU to rerender the vertices
    positionsAttr.needsUpdate = true;

    // 3. Ambient environmental rotation and strict SCROLL responsiveness
    mesh.current.rotation.y = t * 0.05 + (scrollY * scrollMultiplier);
    mesh.current.rotation.x = Math.sin(t * 0.1) * 0.1 + (scrollY * scrollMultiplier * 0.5);
  });

  return (
    <points ref={mesh} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.8}
      />
    </points>
  );
}

export default function Scene() {
  // Adaptive Performance: Dynamically scale particle count based on user's screen size!
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Determine if device is a phone/tablet (screen width < 768px)
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Check on initial load
    window.addEventListener('resize', checkMobile); // Bind to resize events
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      <color attach="background" args={['#0a192f']} />

      {/* Dynamic Swarm - Adjusts count based on screen size for guaranteed lag-free mobile frames */}
      <InteractiveParticleField
        count={isMobile ? 3000 : 8000}
        color="#3b82f6"
        size={0.03}
        radius={isMobile ? 15 : 22}
        flattenY={0.6}
        scrollMultiplier={0.002}
      />

      {/* Top Layer Swarm */}
      <InteractiveParticleField
        count={isMobile ? 1000 : 2000}
        color="#ffffff"
        size={0.05}
        radius={isMobile ? 18 : 25}
        flattenY={0.8}
        scrollMultiplier={-0.0015}
      />
    </>
  );
}
