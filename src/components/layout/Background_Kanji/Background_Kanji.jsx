'use client';

import { LION_STYLIZED } from '@/data/constants';
import styles from './Background_Kanji.module.scss';

// ----------------------------------------
// Background_Kanji Component
// Large decorative kanji in background
// Two layers: colored (back) + main (front)
// ----------------------------------------
export default function Background_Kanji() {
  const kanji = LION_STYLIZED.east_asian;

  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <div className={styles.container}>
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
