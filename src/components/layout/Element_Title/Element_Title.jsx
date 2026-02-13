'use client';

import { useTheme } from '@/context';
import { useGlitchText } from '@/hooks/useGlitchText';
import styles from './Element_Title.module.scss';

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
// Element_Title Component
// Displays current element title
// ----------------------------------------
export default function Element_Title() {
  const { element, isTransitioning } = useTheme();
  const displayTitle = useGlitchText(element.title, isTransitioning);

  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <div className={styles.container}>
      {/* Title text */}
      <div className={styles.title_cont}>
        <h2>{displayTitle}</h2>
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
