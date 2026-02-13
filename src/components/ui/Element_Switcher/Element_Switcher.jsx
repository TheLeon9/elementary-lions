'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ELEMENTS } from '@/data/constants';
import { useTheme } from '@/context';
import styles from './Element_Switcher.module.scss';

// ----------------------------------------
// Constants
// ----------------------------------------
const ELEMENT_KEYS = Object.keys(ELEMENTS);

// ----------------------------------------
// Rosette SVG Component
// ----------------------------------------
const Rosette = () => (
  <svg
    className={styles.rosette}
    width="62"
    height="62"
    viewBox="0 0 62 62"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer circle - element color */}
    <circle
      cx="30.6877"
      cy="30.6878"
      r="26.1667"
      stroke="var(--element-color)"
      strokeWidth="2"
    />
    {/* Square */}
    <rect
      x="12.6401"
      y="12.6401"
      width="36.0952"
      height="36.0952"
      stroke="currentColor"
      strokeWidth="2"
    />
    {/* Diamond (rotated square) */}
    <rect
      x="5.1647"
      y="30.6877"
      width="36.0952"
      height="36.0952"
      transform="rotate(-45 5.1647 30.6877)"
      stroke="currentColor"
      strokeWidth="2"
    />
    {/* Left arrow */}
    <path
      d="M12.5925 22.1163V39.2592H8.78298L0.687744 30.6878L8.78298 22.1163H12.5925Z"
      stroke="currentColor"
    />
    {/* Right arrow */}
    <path
      d="M48.783 22.1163V39.2592H52.5925L60.6877 30.6878L52.5925 22.1163H48.783Z"
      stroke="currentColor"
    />
    {/* Top arrow */}
    <path
      d="M39.2591 12.5925H22.1162V8.78298L30.6876 0.687744L39.2591 8.78298V12.5925Z"
      stroke="currentColor"
    />
    {/* Bottom arrow */}
    <path
      d="M22.1164 48.783H39.2593V52.5925L30.6878 60.6877L22.1164 52.5925V48.783Z"
      stroke="currentColor"
    />
  </svg>
);

// ----------------------------------------
// Element_Switcher Component
// Navigation dots for switching between elements
// ----------------------------------------
export default function Element_Switcher({ onHoverChange }) {
  // ----------------------------------------
  // State
  // ----------------------------------------
  const { currentElement, changeElement } = useTheme();

  // ----------------------------------------
  // Handlers
  // ----------------------------------------
  const handleKeyDown = useCallback(
    (e) => {
      const currentIndex = ELEMENT_KEYS.indexOf(currentElement);

      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const newIndex =
          currentIndex > 0 ? currentIndex - 1 : ELEMENT_KEYS.length - 1;
        changeElement(ELEMENT_KEYS[newIndex]);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const newIndex =
          currentIndex < ELEMENT_KEYS.length - 1 ? currentIndex + 1 : 0;
        changeElement(ELEMENT_KEYS[newIndex]);
      }
    },
    [currentElement, changeElement]
  );

  const handleMouseEnter = () => {
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    onHoverChange?.(false);
  };

  // ----------------------------------------
  // Effects
  // ----------------------------------------
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <nav className={styles.container} aria-label="Element selection">
      {/* Vertical line decoration */}
      <div className={styles.line} />

      {/* Elements list */}
      <ul className={styles.list}>
        {ELEMENT_KEYS.map((key) => {
          const isActive = key === currentElement;
          const elementData = ELEMENTS[key];

          return (
            <li key={key} className={styles.item}>
              <button
                className={`${styles.button} ${isActive ? styles.active : ''}`}
                onClick={() => changeElement(key)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                aria-label={`Select ${elementData.name} element`}
                aria-pressed={isActive}
                style={{
                  '--element-color': elementData.colors.main,
                }}
              >
                {/* Rosette symbol */}
                <Rosette />
                {/* Center dot */}
                <span className={styles.dot} />
                {/* Element icon */}
                <Image
                  className={styles.icon}
                  src={elementData.picture}
                  alt={elementData.name}
                  width={16}
                  height={16}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
