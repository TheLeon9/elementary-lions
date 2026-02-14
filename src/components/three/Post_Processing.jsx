'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
// useFrame = runs every frame (60fps), useThree = access to clock/scene info
import { useFrame, useThree } from '@react-three/fiber';
// EffectComposer = container that chains post-processing effects
//                  (effects are applied on the ALREADY rendered image, like Instagram filters)
// Bloom            = glow effect on bright areas
// Vignette         = darkens screen edges ("old camera" effect)
// ChromaticAberration = shifts R/G/B channels (lens distortion effect)
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from '@react-three/postprocessing';
// BlendFunction = how the effect blends with the image
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
// gsap = animation library, used here to animate the chromatic spike on transition
import gsap from 'gsap';

// ============================================
// POST-PROCESSING CONFIGURATION (per element)
// ============================================
//
// Each element can have its own settings.
// Currently they're all identical, but you can
// customize them individually.
//
// bloomIntensity      - Glow strength (0 = none, 1 = very strong)
// bloomThreshold      - Brightness cutoff for bloom
//                       (0.2 = almost everything glows, 0.9 = only pure whites glow)
// chromaticAberration - RGB shift in pixels (0 = disabled, 0.005 = very visible)
// vignetteOffset      - Where edge darkening starts
//                       (0 = from center, 1 = only extreme corners)
// vignetteDarkness    - Edge darkening intensity
//                       (0 = none, 1 = fully black edges)

const BLOOM_INTENSITY = 0.2;
const BLOOM_THRESHOLD = 0.8;
const BLOOM_SMOOTHING = 0.8;
const CHROMATIC_ABERRATION = 0;
const VIGNETTE_OFFSET = 0.2;
const VIGNETTE_DARKNESS = 0.8;

// ============================================
// MICRO-ANIMATIONS (pulse effects)
// ============================================

// Bloom pulse - bloom intensity oscillates above its base value
// speed     = oscillation frequency (lower = slower)
// amplitude = extra intensity added at peak (e.g. 0.1 = +0.1 on top of base)
const BLOOM_PULSE_SPEED = 0.6;
const BLOOM_PULSE_AMPLITUDE = 0.2;

// Vignette pulse - darkness oscillates above its base value
// speed     = oscillation frequency (lower = slower)
// amplitude = extra darkness added at peak (e.g. 0.1 = +0.1 on top of base)
const VIGNETTE_PULSE_SPEED = 0.6;
const VIGNETTE_PULSE_AMPLITUDE = 0.2;

// Chromatic pulse - subtle constant oscillation of the RGB shift
// speed     = oscillation frequency (lower = slower)
// amplitude = max extra offset added on top of base (0.00005 = barely perceptible)
const CHROMATIC_PULSE_SPEED = 0;
const CHROMATIC_PULSE_AMPLITUDE = 0;

// Chromatic spike - RGB shift spikes during element transitions then returns to base
// peak     = max aberration value at the peak of the spike (0.005 = very visible)
// duration = total spike duration in seconds (ramps up then back down)
// ease     = easing for the ramp-down (power2.inOut = smooth return)
const CHROMATIC_SPIKE_DURATION = 0.6;
const CHROMATIC_SPIKE_PEAK = 0.004;
const CHROMATIC_SPIKE_EASE = 'power2.inOut';

const ELEMENT_EFFECTS = {
  electricity: { bloomIntensity: BLOOM_INTENSITY, bloomThreshold: BLOOM_THRESHOLD, chromaticAberration: CHROMATIC_ABERRATION, vignetteOffset: VIGNETTE_OFFSET, vignetteDarkness: VIGNETTE_DARKNESS },
  fire:        { bloomIntensity: BLOOM_INTENSITY, bloomThreshold: BLOOM_THRESHOLD, chromaticAberration: CHROMATIC_ABERRATION, vignetteOffset: VIGNETTE_OFFSET, vignetteDarkness: VIGNETTE_DARKNESS },
  water:       { bloomIntensity: BLOOM_INTENSITY, bloomThreshold: BLOOM_THRESHOLD, chromaticAberration: CHROMATIC_ABERRATION, vignetteOffset: VIGNETTE_OFFSET, vignetteDarkness: VIGNETTE_DARKNESS },
  nature:      { bloomIntensity: BLOOM_INTENSITY, bloomThreshold: BLOOM_THRESHOLD, chromaticAberration: CHROMATIC_ABERRATION, vignetteOffset: VIGNETTE_OFFSET, vignetteDarkness: VIGNETTE_DARKNESS },
  wind:        { bloomIntensity: BLOOM_INTENSITY, bloomThreshold: BLOOM_THRESHOLD, chromaticAberration: CHROMATIC_ABERRATION, vignetteOffset: VIGNETTE_OFFSET, vignetteDarkness: VIGNETTE_DARKNESS },
  ice:         { bloomIntensity: BLOOM_INTENSITY, bloomThreshold: BLOOM_THRESHOLD, chromaticAberration: CHROMATIC_ABERRATION, vignetteOffset: VIGNETTE_OFFSET, vignetteDarkness: VIGNETTE_DARKNESS },
  shadow:      { bloomIntensity: BLOOM_INTENSITY, bloomThreshold: BLOOM_THRESHOLD, chromaticAberration: CHROMATIC_ABERRATION, vignetteOffset: VIGNETTE_OFFSET, vignetteDarkness: VIGNETTE_DARKNESS },
};

// ============================================
// COMPONENT
// ============================================
//
// Post_Processing applies visual filters on the ENTIRE already-rendered 3D image.
// It works like applying a filter on a photo:
//   1. The 3D scene is rendered normally into a "buffer" (temporary image)
//   2. Effects are applied one by one on this image
//   3. The final result is displayed on screen
//
// The order of effects inside <EffectComposer> matters:
//   Bloom → Vignette → ChromaticAberration

export default function Post_Processing({ element }) {
  // Get settings for the current element (defaults to electricity)
  const effects = ELEMENT_EFFECTS[element] || ELEMENT_EFFECTS.electricity;

  // Animated pulse values applied on top of the base effect settings.
  // Updated via useFrame at ~10fps (throttled) — slow sine waves don't need 60fps updates.
  const [pulse, setPulse] = useState({ bloom: 0, vignette: 0, chromatic: 0 });
  const frameCountRef = useRef(0);

  // Chromatic spike: animated value that goes 0 → peak → 0 on element change.
  // Uses a ref so GSAP can mutate it every frame without React re-renders,
  // then the throttled useFrame picks it up along with the other pulse values.
  const chromaticSpikeRef = useRef({ value: 0 });
  const prevElementRef = useRef(element);

  // clock = elapsed time in seconds (for oscillation-based animations)
  const { clock } = useThree();

  // --------------------------------------------------------
  // CHROMATIC SPIKE ON ELEMENT CHANGE
  // --------------------------------------------------------
  // When the element changes, GSAP ramps the chromatic value up to the peak
  // then back down to 0, creating a brief RGB-split "glitch" during the crossfade.
  useEffect(() => {
    if (element !== prevElementRef.current) {
      prevElementRef.current = element;

      // Kill any ongoing spike animation before starting a new one
      gsap.killTweensOf(chromaticSpikeRef.current);

      // Ramp up to peak instantly, then ease back down to 0
      chromaticSpikeRef.current.value = CHROMATIC_SPIKE_PEAK;
      gsap.to(chromaticSpikeRef.current, {
        value: 0,
        duration: CHROMATIC_SPIKE_DURATION,
        ease: CHROMATIC_SPIKE_EASE,
      });
    }
  }, [element]);

  // ChromaticAberration expects a Vector2 (x, y) for the offset.
  // Base value from config + spike value (0 when idle, peaks during transitions).
  // Recomputed by the throttled useFrame via pulse.chromatic.
  const chromaticOffset = useMemo(() => {
    const total = effects.chromaticAberration + pulse.chromatic;
    return new THREE.Vector2(total, total);
  }, [effects.chromaticAberration, pulse.chromatic]);

  // --------------------------------------------------------
  // ANIMATION LOOP (throttled to ~10fps)
  // --------------------------------------------------------
  // Pulses bloom intensity and vignette darkness above their base values.
  // Uses (sin + 1) / 2 to oscillate in [0, 1] range → result stays >= base value.
  // Throttled: only updates state every 6 frames (~10fps at 60fps).
  // This is plenty smooth for slow sine waves and avoids unnecessary re-renders.
  useFrame(() => {
    frameCountRef.current++;
    if (frameCountRef.current % 6 !== 0) return;

    const elapsed = clock.elapsedTime;

    setPulse({
      // Bloom pulse: [0 … amplitude]
      bloom: ((Math.sin(elapsed * BLOOM_PULSE_SPEED) + 1) / 2) * BLOOM_PULSE_AMPLITUDE,
      // Vignette pulse: [0 … amplitude]
      vignette: ((Math.sin(elapsed * VIGNETTE_PULSE_SPEED) + 1) / 2) * VIGNETTE_PULSE_AMPLITUDE,
      // Chromatic: constant pulse + spike from transitions (0 when idle)
      chromatic:
        ((Math.sin(elapsed * CHROMATIC_PULSE_SPEED) + 1) / 2) * CHROMATIC_PULSE_AMPLITUDE +
        chromaticSpikeRef.current.value,
    });
  });

  return (
    // multisampling={0} = disables post-processing anti-aliasing (already handled by Canvas)
    <EffectComposer multisampling={0}>

      {/* BLOOM - makes bright areas of the image glow */}
      {/* Like a light halo around bright parts */}
      <Bloom
        intensity={effects.bloomIntensity + pulse.bloom} // Glow strength + pulse
        luminanceThreshold={effects.bloomThreshold} // Threshold: below = no glow
        luminanceSmoothing={BLOOM_SMOOTHING}        // Smooth transition around threshold
        mipmapBlur                                  // Optimized blur technique (GPU-friendly)
      />

      {/* VIGNETTE - darkens the screen edges */}
      {/* Draws the eye toward the center (the lion) */}
      <Vignette
        offset={effects.vignetteOffset}     // Where it starts (0 = center, 1 = edges)
        darkness={effects.vignetteDarkness + pulse.vignette} // Darkness intensity + pulse
        blendFunction={BlendFunction.NORMAL} // Normal blending (replaces pixels)
      />

      {/* CHROMATIC ABERRATION - slightly separates R/G/B channels */}
      {/* Gives a cinematic "lens" effect (currently disabled: offset = 0) */}
      <ChromaticAberration
        offset={chromaticOffset}             // RGB shift [x, y]
        blendFunction={BlendFunction.NORMAL}
        radialModulation={false}             // false = uniform across entire screen
        modulationOffset={0.5}               // No effect when radialModulation = false
      />
    </EffectComposer>
  );
}
