'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

import { useTheme } from '@/context';
import styles from './Element_Description.module.scss';
import Grass from 'p/img/decoration/grass.svg';

// ----------------------------------------
// Ornament SVG Component
// ----------------------------------------
const Ornament = ({ className }) => (
  <svg
    className={className}
    width="60"
    height="61"
    viewBox="0 0 60 61"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M59.9989 21.9989C47.9929 21.9989 38.26 12.2659 38.26 0.259766" stroke="currentColor" />
    <path d="M59.9995 26.3467C45.5923 26.3467 33.9128 14.6672 33.9128 0.259766" stroke="currentColor" strokeWidth="2" />
    <line y1="1" x2="34.7823" y2="1" stroke="currentColor" strokeWidth="2" />
    <line x1="58.9995" y1="60.2595" x2="58.9995" y2="25.477" stroke="currentColor" strokeWidth="2" />
    <line x1="52.5432" y1="52.4348" x2="52.5432" y2="0.260975" stroke="currentColor" />
    <line x1="7.82642" y1="7.58423" x2="59.9998" y2="7.58423" stroke="currentColor" />
    <line y1="-0.5" x2="9.56517" y2="-0.5" transform="matrix(0.707104 0.70711 -0.707104 0.70711 10.4351 1.12915)" stroke="currentColor" />
    <line y1="-0.5" x2="9.56517" y2="-0.5" transform="matrix(0.707104 0.70711 -0.707104 0.70711 52.1692 42.8693)" stroke="currentColor" />
    <line y1="-0.5" x2="9.56517" y2="-0.5" transform="matrix(0.707104 0.70711 -0.707104 0.70711 15.6506 1.12915)" stroke="currentColor" />
    <line y1="-0.5" x2="9.56517" y2="-0.5" transform="matrix(0.707104 0.70711 -0.707104 0.70711 52.1692 37.6511)" stroke="currentColor" />
    <line x1="53.0432" y1="0.62915" x2="59.9997" y2="0.62915" stroke="currentColor" />
    <line x1="59.4995" y1="7.21606" x2="59.4995" y2="0.259548" stroke="currentColor" />
  </svg>
);

// ----------------------------------------
// Element_Description Component
// Displays element description with paw icon
// ----------------------------------------
export default function Element_Description() {
  const { element } = useTheme();

  // ----------------------------------------
  // Wipe crossfade: old text overlays new,
  // clip-path wipes it away right-to-left
  // ----------------------------------------
  const [exitText, setExitText] = useState(null);
  const prevTextRef = useRef(element.text);

  useEffect(() => {
    if (element.text !== prevTextRef.current) {
      setExitText(prevTextRef.current);
      prevTextRef.current = element.text;

      const timer = setTimeout(() => setExitText(null), 750);
      return () => clearTimeout(timer);
    }
  }, [element.text]);

  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <div className={styles.container}>
      {/* Decorative Elements */}
      <div className={styles.grass_container}>
        <svg
          width="400"
          height="400"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.deco_img_colored}
        >
          <path
            d="M89.484 11.0002C60.5527 35.632 44.7432 75.8842 40.4117 99.5865H55.4934C61.6646 75.6617 65.4807 48.1228 89.4842 11L89.484 11.0002ZM14.6426 21.2416C24.8764 33.5064 34.625 47.1107 42.3953 60.1635C43.7919 62.5097 45.1469 64.8804 46.4598 67.2744C48.0314 63.4243 49.7313 59.6278 51.5564 55.8912C41.4359 41.9791 29.3955 29.523 14.6424 21.2418L14.6426 21.2416ZM91.0465 47.3588C80.9707 56.4404 75.6449 69.7129 73.3523 84.5961C76.0428 89.642 78.568 94.6146 80.957 99.4154H88.6475C83.7158 85.4584 86.3941 67.7045 91.0465 47.3588ZM12.4209 50.3555C26.6713 64.6641 36.0135 87.1914 28.0643 99.3359H36.8533C37.7311 94.4297 39.0682 88.8607 40.8937 82.8809C37.2916 66.4185 25.0029 50.8418 12.4209 50.3561V50.3555ZM6 67.5307C16.3555 83.3385 18.0518 91.9381 13.9957 99.2877H27.1793C24.6207 85.2213 21.0379 76.5719 6 67.5309V67.5307ZM64.7769 76.4357C62.6969 84.5139 61.0293 92.1461 59.1494 99.5314H77.0635C73.3244 92.0537 69.2668 84.2205 64.7769 76.4357Z"
            fill="#f8f8ff"
          />
        </svg>
      </div>

      {/* Line And SVG */}
      <div className={styles.header}>
        <Image
          src={Grass}
          width={100}
          height={100}
          alt="Grass"
          className={styles.deco_img}
        />
      </div>

      {/* Text Description */}
      <div className={styles.text_cont}>
        {/* New text - wipes in from right to left */}
        <div className={exitText ? styles.wipe_in : undefined}>
          <p>{element.text}</p>
        </div>
        {/* Old text - wipes out from right to left */}
        {exitText && (
          <p className={styles.text_exit}>{exitText}</p>
        )}
      </div>

      {/* Ornament decoration */}
      <div className={styles.ornament_container}>
        {/* Colored ornament - background layer */}
        <Ornament className={styles.ornament_colored} />
        {/* White ornament - foreground layer */}
        <Ornament className={styles.ornament} />
      </div>
    </div>
  );
}
