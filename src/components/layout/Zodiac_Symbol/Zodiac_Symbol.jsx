'use client';

import { LION_STYLIZED } from '@/data/constants';
import styles from './Zodiac_Symbol.module.scss';

// ----------------------------------------
// Zodiac_Symbol Component
// Displays the Leo zodiac symbol (♌︎)
// ----------------------------------------
export default function Zodiac_Symbol() {
  return (
    <div className={styles.container}>
      <span className={styles.symbol}>{LION_STYLIZED.zodiac}</span>
    </div>
  );
}
