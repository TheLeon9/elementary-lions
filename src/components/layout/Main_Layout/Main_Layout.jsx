'use client';

// === IMPORTS ===

import styles from './Main_Layout.module.scss';

// ----------------------------------------
// Main_Layout Component
// Global container for layout elements
// ----------------------------------------
export default function Main_Layout({ children }) {
  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <div className={styles.global_container}>
      {/* Children - Others Elements */}
      {children}
    </div>
  );
}
