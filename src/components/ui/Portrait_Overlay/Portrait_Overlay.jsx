'use client';

import Image from 'next/image';

import { LION_STYLIZED } from '@/data/constants';
import styles from './Portrait_Overlay.module.scss';

import Lion_Print from 'p/img/decoration/lion_print.svg';

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
// Rotate Phone SVG Icon
// ----------------------------------------
const RotateIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Phone in portrait */}
    <rect
      x="30"
      y="20"
      width="30"
      height="50"
      rx="4"
      stroke="currentColor"
      strokeWidth="2"
      opacity="0.3"
    />
    <circle cx="45" cy="64" r="2" fill="currentColor" opacity="0.3" />

    {/* Phone in landscape */}
    <rect
      x="55"
      y="45"
      width="50"
      height="30"
      rx="4"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="99" cy="60" r="2" fill="currentColor" />

    {/* Rotation arrow */}
    <path
      d="M50 35 C60 25, 75 30, 70 45"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path d="M68 39 L70 46 L63 44" fill="currentColor" />
  </svg>
);

// ----------------------------------------
// Portrait_Overlay Component
// Shows on mobile portrait orientation
// ----------------------------------------
export default function Portrait_Overlay() {
  return (
    <div className={styles.overlay}>
      {/* Header text */}
      <h1 className={styles.header}>{LION_STYLIZED.japanese_modern}</h1>

      {/* Top-left ornament */}
      <div className={styles.ornament_top_left}>
        <Ornament className={styles.ornament_colored} />
        <Ornament className={styles.ornament} />
      </div>

      {/* Top-right ornament */}
      <div className={styles.ornament_top_right}>
        <Ornament className={styles.ornament_colored} />
        <Ornament className={styles.ornament} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <RotateIcon className={styles.icon} />
        <p className={styles.text}>
          For a better experience, please rotate your phone to landscape
        </p>
      </div>

      {/* Bottom-left ornament */}
      <div className={styles.ornament_bottom_left}>
        <Ornament className={styles.ornament_colored} />
        <Ornament className={styles.ornament} />
      </div>

      {/* Bottom-right ornament */}
      <div className={styles.ornament_bottom_right}>
        <Ornament className={styles.ornament_colored} />
        <Ornament className={styles.ornament} />
      </div>

      {/* Footer lion print */}
      <div className={styles.footer}>
        <Image src={Lion_Print} width={14} height={16} alt="Lion Print" />
      </div>
    </div>
  );
}
