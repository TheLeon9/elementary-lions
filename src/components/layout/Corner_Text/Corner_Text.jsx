'use client';

import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { LION_TRAD_TAB, ELEMENTS } from '@/data/constants';
import { ELEMENT_ICONS } from '@/data/Element_Icons';
import { useTheme } from '@/context';
import { useGlitchText } from '@/hooks/useGlitchText';
import styles from './Corner_Text.module.scss';

// ----------------------------------------
// Scramble animation constants
// ----------------------------------------
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SCRAMBLE_COUNT = 15;
const SCRAMBLE_SPEED = 40;
const TRANSLATION_INTERVAL = 2500;

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
// Corner_Text Component
// Left: scrolling translations with scramble effect
// Right: element name + colored kanji bubble
// ----------------------------------------
export default function Corner_Text({ position }) {
  const { element, currentElement, isTransitioning } = useTheme();
  const ColoredIcon = ELEMENT_ICONS[currentElement];
  const displayName = useGlitchText(element.name, isTransitioning);
  const displayKanji = useGlitchText(element.kanji, isTransitioning);

  // ----------------------------------------
  // State for left position (translations)
  // ----------------------------------------
  const [translationIndex, setTranslationIndex] = useState(0);
  const [displayText, setDisplayText] = useState(LION_TRAD_TAB[0]);

  // ----------------------------------------
  // Wipe crossfade for element icons (right)
  // ----------------------------------------
  const [exitElement, setExitElement] = useState(null);
  const prevElementRef = useRef(currentElement);

  useLayoutEffect(() => {
    if (currentElement !== prevElementRef.current) {
      setExitElement(prevElementRef.current);
      prevElementRef.current = currentElement;

      const timer = setTimeout(() => setExitElement(null), 750);
      return () => clearTimeout(timer);
    }
  }, [currentElement]);

  // ----------------------------------------
  // Scramble animation for translations
  // ----------------------------------------
  useEffect(() => {
    if (position !== 'left') return;

    const interval = setInterval(() => {
      const nextIndex = (translationIndex + 1) % LION_TRAD_TAB.length;
      const targetText = LION_TRAD_TAB[nextIndex];
      let scrambleCount = 0;

      const scrambleInterval = setInterval(() => {
        if (scrambleCount < SCRAMBLE_COUNT) {
          const randomText = Array.from(
            { length: targetText.length },
            () =>
              SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          ).join('');
          setDisplayText(randomText);
          scrambleCount++;
        } else {
          clearInterval(scrambleInterval);
          setDisplayText(targetText);
          setTranslationIndex(nextIndex);
        }
      }, SCRAMBLE_SPEED);
    }, TRANSLATION_INTERVAL);

    return () => clearInterval(interval);
  }, [position, translationIndex]);

  // ----------------------------------------
  // Render - Right position
  // ----------------------------------------
  if (position === 'right') {
    return (
      <div className={`${styles.container} ${styles.right}`}>
        <p>{displayName}</p>
        <p>-</p>
        <p>{displayKanji}</p>

        {/* Ornament decoration */}
        <div className={styles.ornament_container_right}>
          {/* Colored ornament - background layer */}
          <Ornament className={styles.ornament_colored_right} />
          {/* White ornament - foreground layer */}
          <Ornament className={styles.ornament_right} />
        </div>

        {/* Element icon - continuation of ornament */}
        <div className={styles.element_container}>
          {/* New icons - wipes in top to bottom */}
          <div className={exitElement ? styles.element_wipe_in : undefined}>
            <ColoredIcon className={styles.element_colored} />
            <Image
              className={styles.element_main}
              src={element.picture}
              alt={element.name}
              width={100}
              height={100}
              priority
            />
          </div>
          {/* Old icons - wipes out top to bottom */}
          {exitElement && (() => {
            const ExitIcon = ELEMENT_ICONS[exitElement];
            const exitPicture = ELEMENTS[exitElement]?.picture;
            return (
              <div className={styles.element_wipe_out}>
                <ExitIcon className={styles.element_colored} />
                <Image
                  className={styles.element_main}
                  src={exitPicture}
                  alt=""
                  width={100}
                  height={100}
                />
              </div>
            );
          })()}
        </div>
      </div>
    );
  }

  // ----------------------------------------
  // Render - Left position
  // ----------------------------------------
  return (
    <div className={`${styles.container} ${styles.left}`}>
      <p>{displayText}</p>

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
