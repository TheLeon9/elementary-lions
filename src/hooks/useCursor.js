'use client';

import { useState, useCallback } from 'react';

export default function useCursor() {
  const [isHovering, setIsHovering] = useState(false);

  const handleHoverChange = useCallback((hovering) => {
    setIsHovering(hovering);
  }, []);

  return {
    isHovering,
    handleHoverChange,
  };
}
