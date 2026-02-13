'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Custom_Cursor.module.scss';

export default function Custom_Cursor({ isHovering }) {
  // ----------------------------------------
  // Refs to DOM elements (dot & ring)
  // ----------------------------------------
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  // ----------------------------------------
  // Cursor visibility state
  // Used to fade in / out the cursor
  // ----------------------------------------
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // ----------------------------------------
    // Safety check: ensure DOM nodes exist
    // ----------------------------------------
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    // ----------------------------------------
    // Target mouse position (raw input)
    // ----------------------------------------
    let mouseX = 0;
    let mouseY = 0;

    // ----------------------------------------
    // Current animated positions
    // These values are interpolated every frame
    // ----------------------------------------
    let cursorX = 0;
    let cursorY = 0;
    let ringX = 0;
    let ringY = 0;

    // ----------------------------------------
    // Lerp factors (animation smoothness)
    // Higher = faster follow
    // Lower = heavier / smoother feel
    // ----------------------------------------
    const CURSOR_SPEED = 0.2; // Fast and reactive
    const RING_SPEED = 0.12; // Slower, more cinematic

    // ----------------------------------------
    // Mouse move handler
    // Updates the target position
    // ----------------------------------------
    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);
    };

    // ----------------------------------------
    // Cursor visibility handlers
    // ----------------------------------------
    const show = () => setIsVisible(true);
    const hide = () => setIsVisible(false);

    // ----------------------------------------
    // Main animation loop
    // Uses requestAnimationFrame for smooth motion
    // ----------------------------------------
    const animate = () => {
      // Smooth interpolation toward mouse position
      cursorX += (mouseX - cursorX) * CURSOR_SPEED;
      cursorY += (mouseY - cursorY) * CURSOR_SPEED;

      ringX += (mouseX - ringX) * RING_SPEED;
      ringY += (mouseY - ringY) * RING_SPEED;

      // Apply transforms to DOM elements
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;

      requestAnimationFrame(animate);
    };

    // ----------------------------------------
    // Event listeners
    // ----------------------------------------
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseenter', show);
    document.addEventListener('mouseleave', hide);

    // ----------------------------------------
    // Start animation loop
    // ----------------------------------------
    requestAnimationFrame(animate);

    // ----------------------------------------
    // Cleanup on component unmount
    // ----------------------------------------
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseenter', show);
      document.removeEventListener('mouseleave', hide);
    };
  }, []);

  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
      {/* Main cursor dot */}
      <div ref={cursorRef} className={styles.dot} />

      {/* Outer ring (reacts to hover state) */}
      <div
        ref={ringRef}
        className={`${styles.ring} ${isHovering ? styles.hovering : ''}`}
      />
    </div>
  );
}
