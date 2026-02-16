'use client';

// === IMPORTS ===

import dynamic from 'next/dynamic';
import { ThemeProvider, useTheme } from '@/context';
import useCursor from '@/hooks/useCursor';

// Layout Components
import Main_Layout from '@/components/layout/Main_Layout/Main_Layout';
import Background_Kanji from '@/components/layout/Background_Kanji/Background_Kanji';
import Corner_Text from '@/components/layout/Corner_Text/Corner_Text';
import Element_Title from '@/components/layout/Element_Title/Element_Title';
import Element_Description from '@/components/layout/Element_Description/Element_Description';
import Header_Text from '@/components/layout/Header_Text/Header_Text';
import Footer_Icon from '@/components/layout/Footer_Icon/Footer_Icon';
import Zodiac_Symbol from '@/components/layout/Zodiac_Symbol/Zodiac_Symbol';

// UI Components
import Element_Switcher from '@/components/ui/Element_Switcher/Element_Switcher';
import Custom_Cursor from '@/components/ui/Custom_Cursor/Custom_Cursor';
import Loading_Screen from '@/components/ui/Loading_Screen/Loading_Screen';
import Portrait_Overlay from '@/components/ui/Portrait_Overlay/Portrait_Overlay';

// Dynamic import for Three.js
const Lion_Scene = dynamic(
  () => import('@/components/three/Lion_Scene'),
  { ssr: false, loading: () => null }
);

// === COMPONENT ===

function HomeContent() {
  // State
  const { isLoading, setIsLoading } = useTheme();
  const { isHovering, handleHoverChange } = useCursor();

  // Handlers
  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  // Render
  return (
    <main>
      {/* 3D Container - always mounted so it loads in background */}
      <Lion_Scene />

      {/* Cursor */}
      <Custom_Cursor isHovering={isHovering} />

      {/* Portrait orientation warning */}
      <Portrait_Overlay />

      {isLoading ? (
        /* Loader */
        <Loading_Screen onLoadComplete={handleLoadComplete} />
      ) : (
        /* Main Layout - mounts after loading, triggering CSS animations */
        <Main_Layout>
          {/* Corner Text Left */}
          <Corner_Text position="left" />

          {/* Header */}
          <Header_Text />

          {/* Corner Text Right */}
          <Corner_Text position="right" />

          {/* Background Kanji */}
          <Background_Kanji />

          {/* Zodiac Symbol */}
          <Zodiac_Symbol />

          {/* Element Switcher */}
          <Element_Switcher onHoverChange={handleHoverChange} />

          {/* Element Title */}
          <Element_Title />

          {/* Element Description */}
          <Element_Description />

          {/* Footer Icon */}
          <Footer_Icon />
        </Main_Layout>
      )}
    </main>
  );
}

// === PAGE ===

export default function Home() {
  return (
    <ThemeProvider>
      <HomeContent />
    </ThemeProvider>
  );
}
