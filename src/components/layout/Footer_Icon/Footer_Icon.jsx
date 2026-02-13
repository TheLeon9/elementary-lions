'use client';

import Image from 'next/image'

import styles from './Footer_Icon.module.scss';

import Lion_Print from 'p/img/decoration/lion_print.svg';

// ----------------------------------------
// Footer_Icon Component
// Displays lion print icon in footer with polygon
// ----------------------------------------
export default function Footer_Icon() {
  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <div className={styles.container}>
      <Image src={Lion_Print} width={24} height={28} alt="Lion Print" />
    </div>
  );
}
