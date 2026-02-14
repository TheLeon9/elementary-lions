'use client';

import { useEffect, useRef } from 'react';
import { LION_STYLIZED } from '@/data/constants';
import styles from './Background_Kanji.module.scss';

// ----------------------------------------
// Parallax config
// ----------------------------------------
const PARALLAX_STRENGTH = 4; // max px shift per layer
const PARALLAX_SMOOTHING = 0.02; // lerp speed (lower = smoother)

// ----------------------------------------
// Background_Kanji Component
// Large decorative kanji in background
// Two layers: colored (back) + main (front)
// ----------------------------------------
export default function Background_Kanji() {
  const kanji = LION_STYLIZED.east_asian;

  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const parallaxRef = useRef({ x: 0, y: 0 });

  // ----------------------------------------
  // Mouse tracking + parallax animation
  // ----------------------------------------
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let rafId;
    const animate = () => {
      // Lerp toward mouse target
      const targetX = mouseRef.current.x * PARALLAX_STRENGTH;
      const targetY = mouseRef.current.y * PARALLAX_STRENGTH;
      parallaxRef.current.x += (targetX - parallaxRef.current.x) * PARALLAX_SMOOTHING;
      parallaxRef.current.y += (targetY - parallaxRef.current.y) * PARALLAX_SMOOTHING;

      const px = parallaxRef.current.x;
      const py = parallaxRef.current.y;

      // Move entire container with mouse
      if (containerRef.current) {
        containerRef.current.style.translate = `${px}px ${-py}px`;
      }

      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <div ref={containerRef} className={styles.container}>
      {/* Colored kanji - background layer */}
      <div className={styles.colored_kanji}>
        {kanji.split('').map((char, i) => (
          <span key={i}>{char}</span>
        ))}
      </div>

      {/* Main kanji - foreground layer */}
      <div className={styles.main_kanji}>
        {kanji.split('').map((char, i) => (
          <span key={i}>{char}</span>
        ))}
      </div>
    </div>
  );
}
