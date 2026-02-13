'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ELEMENTS } from '@/data/constants';

// ============================================
// PARTICLES CONFIGURATION
// ============================================

// Number of particles in the scene
const PARTICLE_COUNT = 60;

// Visual appearance
// size    = diameter of each particle in 3D units (0.02 = tiny dot)
// opacity = transparency (0 = invisible, 1 = solid)
const PARTICLE_SIZE = 0.04;
const PARTICLE_OPACITY = 0.6;

// Movement
// speed = vertical drift speed per frame (higher = faster rising)
const PARTICLE_SPEED = 0.1;

// Spawn area (particles are randomly placed within this box)
// spread_x = horizontal range (centered on 0, so total width = spread_x * 2)
// spread_y = vertical range (total height = spread_y * 2)
// spread_z = depth range (total depth = spread_z * 2)
// z_offset = base Z position (must be > 0 to appear in front of the lion plane at Z=0,
//            and < 5 to stay in front of the camera at Z=5)
const PARTICLE_SPREAD_X = 2;
const PARTICLE_SPREAD_Y = 1;
const PARTICLE_SPREAD_Z = 1;
const PARTICLE_Z_OFFSET = 2;

// ============================================
// ENTRANCE ANIMATION
// ============================================

// Particles start invisible then fade in after a delay.
// Synced with the lion plane entrance animation.
// delay    = seconds before fade-in starts (match with Lion_Image ENTRANCE_DELAY)
// duration = fade-in duration in seconds
// ease     = GSAP easing curve
const ENTRANCE_DELAY = 4;
const ENTRANCE_DURATION = 2;
const ENTRANCE_EASE = 'power2.out';

// ============================================
// COMPONENT
// ============================================
//
// Particles renders a field of small floating dots that drift upward slowly.
// When a particle exits the top, it wraps back to the bottom.
//
// Uses THREE.Points (single draw call for all particles = very fast).
// Color comes from the current element's "third" color.
//
// AdditiveBlending makes particles glow softly against dark backgrounds
// (their color adds to whatever is behind them instead of replacing it).

export default function Particles({ element }) {
  const pointsRef = useRef();

  // Entrance animation: opacity animated by GSAP from 0 → target
  const entranceRef = useRef({ opacity: 0 });

  // Generate random starting positions once (Float32Array for GPU performance).
  // Each particle has 3 values: [x, y, z]
  const positions = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * PARTICLE_SPREAD_X * 2; // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * PARTICLE_SPREAD_Y * 2; // y
      pos[i * 3 + 2] = PARTICLE_Z_OFFSET + Math.random() * PARTICLE_SPREAD_Z; // z (in front of plane)
    }
    return pos;
  }, []);

  // Get the element's "third" color for particle tint
  const color = useMemo(() => {
    return new THREE.Color(ELEMENTS[element]?.colors.third || '#ffffff');
  }, [element]);

  // --------------------------------------------------------
  // ENTRANCE ANIMATION (runs once on mount)
  // --------------------------------------------------------
  // After ENTRANCE_DELAY, GSAP fades particles from 0 → PARTICLE_OPACITY.
  useEffect(() => {
    gsap.to(entranceRef.current, {
      opacity: PARTICLE_OPACITY,
      delay: ENTRANCE_DELAY,
      duration: ENTRANCE_DURATION,
      ease: ENTRANCE_EASE,
    });
  }, []);

  // --------------------------------------------------------
  // ANIMATION LOOP (60fps)
  // --------------------------------------------------------
  // Each frame, move every particle upward by PARTICLE_SPEED * deltaTime.
  // When a particle goes above the top boundary, wrap it back to the bottom.
  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    const posArray = pointsRef.current.geometry.attributes.position.array;
    const topLimit = PARTICLE_SPREAD_Y;
    const bottomReset = -PARTICLE_SPREAD_Y;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Y position is at index i*3 + 1
      posArray[i * 3 + 1] += PARTICLE_SPEED * delta;

      // Wrap: particle exited top → respawn at bottom with random X
      if (posArray[i * 3 + 1] > topLimit) {
        posArray[i * 3 + 1] = bottomReset;
        posArray[i * 3] = (Math.random() - 0.5) * PARTICLE_SPREAD_X * 2;
      }
    }

    // Tell Three.js that positions changed and need GPU re-upload
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Apply entrance opacity (animated by GSAP from 0 → PARTICLE_OPACITY)
    if (pointsRef.current.material) {
      pointsRef.current.material.opacity = entranceRef.current.opacity;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={PARTICLE_SIZE}
        opacity={0}
        transparent
        depthWrite={false}
        sizeAttenuation           // Distant particles appear smaller (perspective)
        blending={THREE.AdditiveBlending} // Glow effect: particle color adds to background
      />
    </points>
  );
}
