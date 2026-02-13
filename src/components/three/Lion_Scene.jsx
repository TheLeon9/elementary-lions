'use client';

// Canvas   = the 3D container from react-three-fiber, it creates
//            the WebGL <canvas> and handles 60fps rendering automatically
// Suspense = waits for textures/assets to load before showing the scene
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { useTheme } from '@/context';
import Lion_Image from './Lion_Image';
import Particles from './Particles';
import Post_Processing from './Post_Processing';

// ============================================
// SCENE CONFIGURATION
// ============================================

// Camera position in 3D space [x, y, z]
// z = 5 means the camera is 5 units in front of the scene
const CAMERA_POSITION = [0, 0, 5];

// Field of view in degrees (smaller = more zoomed in)
const CAMERA_FOV = 50;

// Scene background color
const BG_COLOR = '#040b12';

// ============================================
// COMPONENT
// ============================================
// Lion_Scene is the root component of the entire 3D part.
// It creates a fullscreen WebGL Canvas containing:
//   1. Lion_Image      → the lion background image (per element)
//   2. Post_Processing → visual effects (bloom, vignette)
//
// Structure:
//   <Canvas>              ← creates the WebGL context
//     <color>             ← fills the background
//     <Suspense>          ← waits for texture loading
//       <Lion_Image>      ← 2D plane with the lion image
//       <Post_Processing> ← filters on top
//     </Suspense>
//   </Canvas>

export default function Lion_Scene() {
  const { currentElement } = useTheme();

  return (
    // Fullscreen div fixed behind HTML content (low z-index)
    <div className="fullscreen">
      <Canvas
        // Perspective camera: position + field of view
        camera={{ position: CAMERA_POSITION, fov: CAMERA_FOV }}
        // WebGL options
        gl={{
          antialias: true, // Edge smoothing
          alpha: true, // Allows transparent background
          powerPreference: 'high-performance', // Use dedicated GPU
        }}
        // Device pixel ratio: min 1, max 2 (capped for performance)
        dpr={[1, 2]}
      >
        {/* Scene background color (fills the entire canvas) */}
        <color attach="background" args={[BG_COLOR]} />

        {/* Suspense: renders nothing (null) while textures are loading */}
        <Suspense fallback={null}>
          {/* Lion image - fullscreen 2D plane with crossfade between elements */}
          <Lion_Image element={currentElement} />

          {/* Floating particles - subtle dots drifting upward, colored per element */}
          <Particles element={currentElement} />

          {/* Post-processing - filters applied on top of the rendered image */}
          <Post_Processing element={currentElement} />
        </Suspense>
      </Canvas>
    </div>
  );
}
