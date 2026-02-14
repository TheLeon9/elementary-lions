'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
// useFrame  = hook that runs every frame (60fps), like requestAnimationFrame
// useThree  = gives access to scene info (viewport, camera, etc.)
import { useFrame, useThree } from '@react-three/fiber';
// useTexture = loads images and converts them to GPU textures (usable on 3D meshes)
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
// gsap = animation library, used here to animate the crossfade opacity
import gsap from 'gsap';

// ============================================
// LION IMAGE CONFIGURATION
// ============================================

// Path to each element's PNG background image
const IMAGE_MAP = {
  electricity: '/img/background/lightning_lion.png',
  fire: '/img/background/fire_lion.png',
  water: '/img/background/water_lion.png',
  nature: '/img/background/earth_lion.png',
  wind: '/img/background/wind_lion.png',
  ice: '/img/background/ice_lion.png',
  shadow: '/img/background/shadow_lion.png',
};

// Crossfade duration between two images (in seconds)
const CROSSFADE_DURATION = 0.6;
// Easing curve for the crossfade (power2.inOut = slow→fast→slow)
const CROSSFADE_EASE = 'power2.inOut';

// Per-element zoom (1 = just covers the viewport, >1 = zoomed in)
const IMAGE_SCALE = {
  electricity: 1.2,
  fire:        1.1,
  water:       1.1,
  nature:      1.1,
  wind:        1.2,
  ice:         1.05,
  shadow:      1.2,
};

// Per-element position offset [x, y] to adjust framing
// Negative = left/down, Positive = right/up
const IMAGE_OFFSET = {
  electricity: [-0.24, 0],
  fire:        [0, 0],
  water:       [0, 0],
  nature:      [0, 0],
  wind:        [0, 0],
  ice:         [0, 0],
  shadow:      [0, 0],
};

// Tint applied on the image (multiplies the texture colors)
// #ffffff = original colors (no tint)
// #cccccc = slightly darkened
// #999999 = noticeably darker
// #777777 = significantly darkened
// #444444 = very dark
// #000000 = full black
// #ff9999 = warm/red tint    #99ccff = cool/blue tint
// #99ff99 = green tint        #ffcc88 = orange/sepia tint
const IMAGE_TINT = '#ffffff';

// ============================================
// MICRO-ANIMATIONS
// ============================================

// Breathing - subtle scale oscillation (the image "breathes")
// speed     = oscillation frequency (lower = slower, 0.8 ≈ 1 cycle every ~8s)
// amplitude = scale variation (0.01 = ±1% size change)
const BREATHING_SPEED = 0.6;
const BREATHING_AMPLITUDE = 0.04;

// Slow drift - the image wanders slightly in X/Y
// Uses sin/cos with different speeds to create a smooth looping path
// speed     = movement frequency (lower = slower)
// amplitude = max displacement in 3D units
const DRIFT_SPEED_X = 0.2;
const DRIFT_SPEED_Y = 0.2;
const DRIFT_AMPLITUDE_X = 0.15;
const DRIFT_AMPLITUDE_Y = 0.15;

// Parallax - image reacts to mouse position (inverse direction = depth feeling)
// strength  = max shift when mouse is at screen edge (3D units)
// smoothing = interpolation speed per frame (lower = smoother, 0 to 1)
const PARALLAX_STRENGTH = 0.04;
const PARALLAX_SMOOTHING = 0.04;

// ============================================
// ENTRANCE ANIMATION
// ============================================

// Plane starts closer to the camera then slides back to Z=0.
// Synced with the loading screen tear via a fixed delay.
// start_z  = initial Z position (higher = closer to camera, 0 = normal)
// delay    = seconds before animation starts (tweak to match loading tear)
// duration = animation duration in seconds
// ease     = GSAP easing curve
const ENTRANCE_START_Z = 2;
const ENTRANCE_DELAY = 3;
const ENTRANCE_DURATION = 2;
const ENTRANCE_EASE = 'power2.out';

// Small Z advance for the 2nd mesh, otherwise both planes
// fight for the same pixel (z-fighting = flickering)
const NEXT_MESH_Z_OFFSET = 0;

// ============================================
// COMPONENT
// ============================================
//
// Lion_Image displays the lion background image in the 3D scene.
//
// HOW IT WORKS:
// - It's a simple 2D plane (planeGeometry) with a texture (the PNG image)
// - The plane is sized to cover the entire screen (like background-size: cover in CSS)
// - When the element changes, a 2nd plane appears with the new image
//   and we crossfade between them using GSAP
//
// CROSSFADE SYSTEM:
// - We have 2 stacked meshes: "current" (visible) and "next" (transitioning)
// - When the element changes:
//   1. The "next" mesh appears with the new texture (opacity 0)
//   2. GSAP animates: current opacity 1→0, next opacity 0→1
//   3. When done, "next" becomes "current" and the 2nd mesh is removed

export default function Lion_Image({ element }) {
  // References to both 3D meshes (to update their opacity each frame)
  const meshRef = useRef();
  const secondMeshRef = useRef();

  // Smoothed parallax position (lerped each frame to avoid jitter)
  const parallaxRef = useRef({ x: 0, y: 0 });

  // Raw mouse position normalized to [-1, 1] (tracked via window event
  // because the Canvas sits behind HTML content and doesn't receive pointer events)
  const mouseRef = useRef({ x: 0, y: 0 });

  // Entrance animation: Z offset animated by GSAP from start_z → 0
  const entranceRef = useRef({ z: ENTRANCE_START_Z });

  // viewport = visible scene size in 3D units (not pixels)
  // e.g. viewport.width = 8.5 units if camera is at z=5 with fov=50
  // viewport = visible scene size in 3D units
  // clock    = elapsed time in seconds (for oscillation-based animations)
  const { viewport, clock } = useThree();

  // --------------------------------------------------------
  // MOUSE TRACKING (for parallax)
  // --------------------------------------------------------
  // Listen on window so it works even when HTML content is on top of the Canvas.
  // Normalizes mouse position to [-1, 1] (same range as R3F pointer).
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // --------------------------------------------------------
  // ENTRANCE ANIMATION (runs once on mount)
  // --------------------------------------------------------
  // After ENTRANCE_DELAY, GSAP slides the Z offset from ENTRANCE_START_Z → 0.
  // The plane appears to "pull back" from the camera to its resting position.
  useEffect(() => {
    gsap.to(entranceRef.current, {
      z: 0,
      delay: ENTRANCE_DELAY,
      duration: ENTRANCE_DURATION,
      ease: ENTRANCE_EASE,
    });
  }, []);

  // --------------------------------------------------------
  // TRANSITION STATE
  // --------------------------------------------------------
  // activeElement = the currently displayed element
  // nextElement   = the element being transitioned to (null if no transition)
  const [activeElement, setActiveElement] = useState(element);
  const [nextElement, setNextElement] = useState(null);

  // Ref for opacities (ref instead of state because GSAP modifies it every frame
  // without wanting to trigger a React re-render each frame)
  const opacityRef = useRef({ current: 1, next: 0 });

  // --------------------------------------------------------
  // TEXTURE LOADING
  // --------------------------------------------------------
  // useTexture loads ALL 7 images at once on component mount.
  // This avoids loading time when switching elements.
  const textures = useTexture(Object.values(IMAGE_MAP));

  // Create an object { electricity: texture1, fire: texture2, ... }
  // for easy access by element name
  const textureMap = useMemo(() => {
    const map = {};
    Object.keys(IMAGE_MAP).forEach((key, index) => {
      // SRGBColorSpace = colors display like in Photoshop
      // (without this, colors would look darker/washed out)
      textures[index].colorSpace = THREE.SRGBColorSpace;
      map[key] = textures[index];
    });
    return map;
  }, [textures]);

  // --------------------------------------------------------
  // CROSSFADE ON ELEMENT CHANGE
  // --------------------------------------------------------
  useEffect(() => {
    // Conditions: element has changed AND we're not already transitioning
    if (element !== activeElement && !nextElement) {
      // Prepare the 2nd mesh with the new image
      setNextElement(element);
      opacityRef.current.next = 0;

      // GSAP animates both opacities in parallel:
      // current: 1 → 0 (old image fades out)
      // next:    0 → 1 (new image fades in)
      gsap.to(opacityRef.current, {
        current: 0,
        next: 1,
        duration: CROSSFADE_DURATION,
        ease: CROSSFADE_EASE,
        onComplete: () => {
          // Transition done: new image becomes the main one
          setActiveElement(element);
          setNextElement(null);   // Removes the 2nd mesh
          opacityRef.current.current = 1;
          opacityRef.current.next = 0;
        },
      });
    }
  }, [element, activeElement, nextElement]);

  // --------------------------------------------------------
  // CURRENT TEXTURES
  // --------------------------------------------------------
  const currentTexture = textureMap[activeElement];
  const nextTexture = nextElement ? textureMap[nextElement] : null;

  // --------------------------------------------------------
  // SCALE CALCULATION (plane size to cover the screen)
  // --------------------------------------------------------
  // Image width/height ratio (e.g. 1920/1080 = 1.77)
  const imageAspect = currentTexture?.image
    ? currentTexture.image.width / currentTexture.image.height
    : 1;

  // Calculate plane size so the image covers the entire viewport
  // Same logic as background-size: cover in CSS:
  //   - If image is wider than screen → scale based on height
  //   - If image is taller than screen → scale based on width
  const activeScale = useMemo(() => {
    const zoom = IMAGE_SCALE[activeElement] || 1.1;
    const viewportAspect = viewport.width / viewport.height;
    if (imageAspect > viewportAspect) {
      return [viewport.height * imageAspect * zoom, viewport.height * zoom, 1];
    }
    return [viewport.width * zoom, (viewport.width / imageAspect) * zoom, 1];
  }, [viewport, imageAspect, activeElement]);

  // Same calculation for the transition image (may have a different zoom)
  const nextScale = useMemo(() => {
    if (!nextElement) return activeScale;
    const zoom = IMAGE_SCALE[nextElement] || 1.1;
    const viewportAspect = viewport.width / viewport.height;
    if (imageAspect > viewportAspect) {
      return [viewport.height * imageAspect * zoom, viewport.height * zoom, 1];
    }
    return [viewport.width * zoom, (viewport.width / imageAspect) * zoom, 1];
  }, [viewport, imageAspect, nextElement, activeScale]);

  // --------------------------------------------------------
  // OFFSETS (position shift per element)
  // --------------------------------------------------------
  const activeOffset = IMAGE_OFFSET[activeElement] || [0, 0];
  const nextOffset = nextElement ? (IMAGE_OFFSET[nextElement] || [0, 0]) : [0, 0];

  // --------------------------------------------------------
  // ANIMATION LOOP (60fps)
  // --------------------------------------------------------
  // useFrame runs every rendered frame.
  // Updates: opacity (crossfade), breathing, drift, parallax
  useFrame(() => {
    const elapsed = clock.elapsedTime;

    // Breathing: oscillate a scale multiplier ABOVE 1 only (never shrinks)
    // sin goes [-1, 1] → (sin + 1) / 2 goes [0, 1] → result goes [1, 1 + amplitude]
    const breathScale = 1 + ((Math.sin(elapsed * BREATHING_SPEED) + 1) / 2) * BREATHING_AMPLITUDE;

    // Drift: slow wandering offset using sin/cos (different speeds = looping path)
    const driftX = Math.sin(elapsed * DRIFT_SPEED_X) * DRIFT_AMPLITUDE_X;
    const driftY = Math.cos(elapsed * DRIFT_SPEED_Y) * DRIFT_AMPLITUDE_Y;

    // Parallax: lerp toward target to smooth out mouse movement
    // mouseRef.x/y are in [-1, 1], negative multiplier = inverse direction (depth feel)
    const targetX = -mouseRef.current.x * PARALLAX_STRENGTH;
    const targetY = -mouseRef.current.y * PARALLAX_STRENGTH;
    parallaxRef.current.x += (targetX - parallaxRef.current.x) * PARALLAX_SMOOTHING;
    parallaxRef.current.y += (targetY - parallaxRef.current.y) * PARALLAX_SMOOTHING;

    const meshes = [meshRef.current, secondMeshRef.current].filter(Boolean);

    meshes.forEach((mesh, index) => {
      if (!mesh?.material) return;

      // Opacity (crossfade between current and transition image)
      mesh.material.opacity = index === 0 ? opacityRef.current.current : opacityRef.current.next;

      // Base values for this mesh
      const baseScale = index === 0 ? activeScale : nextScale;
      const baseOffset = index === 0 ? activeOffset : nextOffset;
      const z = index === 0 ? 0 : NEXT_MESH_Z_OFFSET;

      // Apply breathing to scale
      mesh.scale.set(
        baseScale[0] * breathScale,
        baseScale[1] * breathScale,
        1
      );

      // Apply drift + parallax + entrance offset to position
      mesh.position.set(
        baseOffset[0] + driftX + parallaxRef.current.x,
        baseOffset[1] + driftY + parallaxRef.current.y,
        z + entranceRef.current.z
      );
    });
  });

  // --------------------------------------------------------
  // 3D RENDER
  // --------------------------------------------------------
  // Renders 1 or 2 planes (meshes) depending on whether a transition is active:
  //
  //   <mesh> = a 3D object made of:
  //     <planeGeometry>     = the shape (a flat 1x1 rectangle)
  //     <meshBasicMaterial>  = the appearance (texture + color, unaffected by lighting)
  //
  //   scale    = [width, height, 1] in 3D units
  //   position = [x, y, z] offset in the scene
  //   map      = the texture (image) applied on the plane
  //   color    = tint multiplied on the texture (IMAGE_TINT)
  //   transparent + opacity = enables fading
  //   depthWrite: false     = prevents this plane from hiding objects in front of it

  return (
    <group>
      {/* Current image (always visible) */}
      <mesh ref={meshRef} scale={activeScale} position={[activeOffset[0], activeOffset[1], 0]}>
        <planeGeometry args={[1, 1, 32, 32]} />
        <meshBasicMaterial
          map={currentTexture}
          color={IMAGE_TINT}
          transparent
          opacity={1}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Transition image (only exists during crossfade) */}
      {/* Positioned slightly in front (Z_OFFSET) to avoid z-fighting */}
      {nextTexture && (
        <mesh ref={secondMeshRef} scale={nextScale} position={[nextOffset[0], nextOffset[1], NEXT_MESH_Z_OFFSET]}>
          <planeGeometry args={[1, 1, 32, 32]} />
          <meshBasicMaterial
            map={nextTexture}
            color={IMAGE_TINT}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
