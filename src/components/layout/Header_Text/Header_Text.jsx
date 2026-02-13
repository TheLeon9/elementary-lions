'use client';

import { LION_STYLIZED } from '@/data/constants';
import styles from './Header_Text.module.scss';

// ----------------------------------------
// Header_Text Component
// Displays katakana text with decorative lines
// ----------------------------------------
export default function Header_Text() {
  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <div className={styles.container}>
      <div className={styles.polygon}>
        <div className={`${styles.line} ${styles.left}`} />
        <h1>{LION_STYLIZED.japanese_modern}</h1>
        <div className={`${styles.line} ${styles.right}`} />
      </div>
    </div>
  );
}
