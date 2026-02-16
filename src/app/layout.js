// === IMPORTS ===

import '@/styles/globals.scss';

// === METADATA ===

export const metadata = {
  title: 'Elemental Lions - Guardians of the Elements',
  description:
    'An immersive experience featuring 7 elemental lions with stunning Three.js effects and premium dark cinematic aesthetic.',
  keywords: [
    'elemental',
    'lions',
    'three.js',
    'react',
    'nextjs',
    'webgl',
    '3d',
  ],
  authors: [{ name: 'TheLeon' }],
  icons: {
    icon: [{ url: '/img/logo/lion_print.png', type: 'image/png' }],
    apple: '/img/logo/lion_print.png',
  },
  openGraph: {
    title: 'Elemental Lions',
    description: 'Immersive 3D experience featuring 7 elemental lions',
    type: 'website',
  },
};

// === VIEWPORT ===

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// === COMPONENT ===

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
