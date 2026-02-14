'use client';

import { useEffect, useRef, useState } from 'react';
import { LION_STYLIZED } from '@/data/constants';
import styles from './Loading_Screen.module.scss';

// ----------------------------------------
// Timing constants
// ----------------------------------------
const KANJI_INTERVAL = 800;
const MIN_DISPLAY_TIME = 3500;

// ----------------------------------------
// Scramble constants
// ----------------------------------------
const SCRAMBLE_CHARS = [
  '獅',
  '龍',
  '虎',
  '鬼',
  '神',
  '風',
  '火',
  '雷',
  '水',
  '土',
];
const SCRAMBLE_COUNT = 4;
const SCRAMBLE_SPEED = 50;

// ----------------------------------------
// Kanji sequence
// ----------------------------------------
const KANJI_SEQUENCE = [
  LION_STYLIZED.east_asian,
  LION_STYLIZED.korean,
  LION_STYLIZED.greek_classical,
  LION_STYLIZED.zodiac,
];

// ----------------------------------------
// Images to preload
// ----------------------------------------
const IMAGES_TO_PRELOAD = [
  '/img/background/lightning_lion.png',
  '/img/background/fire_lion.png',
  '/img/background/water_lion.png',
  '/img/background/earth_lion.png',
  '/img/background/wind_lion.png',
  '/img/background/ice_lion.png',
  '/img/background/shadow_lion.png',
];

// ----------------------------------------
// Loading_Screen Component
// ----------------------------------------
export default function Loading_Screen({ onLoadComplete }) {
  const [progress, setProgress] = useState(0);
  const [kanjiIndex, setKanjiIndex] = useState(0);
  const [displayChar, setDisplayChar] = useState(KANJI_SEQUENCE[0]);
  const [isExiting, setIsExiting] = useState(false);
  const [startTime] = useState(Date.now());

  // ----------------------------------------
  // Gradient stops animation
  // ----------------------------------------
  const stopInnerRef = useRef(null);
  const stopOuterRef = useRef(null);

  useEffect(() => {
    let rafId;
    const animate = () => {
      const t = (Math.sin(Date.now() * 0.00314) + 1) / 2; // 0 → 1 (2s cycle)
      const inner = 20 + t * 20; // 20% → 40%
      const outer = 80 - t * 20; // 80% → 60%
      stopInnerRef.current?.setAttribute('offset', `${inner}%`);
      stopOuterRef.current?.setAttribute('offset', `${outer}%`);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // ----------------------------------------
  // Preload images
  // ----------------------------------------
  useEffect(() => {
    let loaded = 0;
    const total = IMAGES_TO_PRELOAD.length;

    IMAGES_TO_PRELOAD.forEach((src) => {
      const img = new Image();

      img.onload = img.onerror = () => {
        loaded += 1;
        setProgress((loaded / total) * 100);

        if (loaded === total) {
          const elapsed = Date.now() - startTime;
          const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsed);

          setTimeout(() => {
            setIsExiting(true);
            // Wait for exit animation: panels start at 0.3s + stagger 0.4s + slide 0.5s = ~1.2s
            setTimeout(onLoadComplete, 1200);
          }, remainingTime);
        }
      };

      img.src = src;
    });
  }, [onLoadComplete, startTime]);

  // ----------------------------------------
  // Kanji scramble animation
  // ----------------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (kanjiIndex + 1) % KANJI_SEQUENCE.length;
      let scrambleCount = 0;

      const scrambleInterval = setInterval(() => {
        if (scrambleCount < SCRAMBLE_COUNT) {
          const randomChar =
            SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          setDisplayChar(randomChar);
          scrambleCount++;
        } else {
          clearInterval(scrambleInterval);
          setDisplayChar(KANJI_SEQUENCE[nextIndex]);
          setKanjiIndex(nextIndex);
        }
      }, SCRAMBLE_SPEED);
    }, KANJI_INTERVAL);

    return () => clearInterval(interval);
  }, [kanjiIndex]);

  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <div className={`${styles.container} ${isExiting ? styles.exiting : ''}`}>
      {/* Background panels */}
      <div className={styles.panels}>
        <div className={`${styles.panel} ${styles.triangle_bottom_left}`} />
        <div className={`${styles.panel} ${styles.rect_left}`} />
        <div className={`${styles.panel} ${styles.rect_middle}`} />
        <div className={`${styles.panel} ${styles.rect_right}`} />
        <div className={`${styles.panel} ${styles.triangle_top_right}`} />
      </div>

      {/* Decorative border lines */}
      <div className={styles.border_lines}>
        <svg
          className={styles.line_svg}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f8f8ff" />
              <stop ref={stopInnerRef} offset="20%" stopColor="transparent" />
              <stop ref={stopOuterRef} offset="80%" stopColor="transparent" />
              <stop offset="100%" stopColor="#f8f8ff" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="0.2"
                result="blur"
              />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Left edge of center band */}
          <line
            x1="0"
            y1="20"
            x2="80"
            y2="100"
            stroke="url(#lineGradient)"
            strokeWidth="0.1"
            filter="url(#glow)"
          />
          {/* Right edge of center band */}
          <line
            x1="20"
            y1="0"
            x2="100"
            y2="80"
            stroke="url(#lineGradient)"
            strokeWidth="0.1"
            filter="url(#glow)"
          />
          {/* Between rect_left and triangle_bottom_left */}
          <line
            x1="0"
            y1="50"
            x2="50"
            y2="100"
            stroke="url(#lineGradient)"
            strokeWidth="0.1"
            filter="url(#glow)"
          />
          {/* Between rect_right and triangle_top_right */}
          <line
            x1="50"
            y1="0"
            x2="100"
            y2="50"
            stroke="url(#lineGradient)"
            strokeWidth="0.1"
            filter="url(#glow)"
          />
        </svg>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.kanji}>
          <h2>{displayChar}</h2>
        </div>

        <div className={styles.progress_container}>
          <div
            className={styles.progress_bar}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
