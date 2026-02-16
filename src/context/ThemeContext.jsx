'use client';

// === IMPORTS ===

import { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { ELEMENTS, DEFAULT_ELEMENT } from '@/data/constants';

// === CONSTANTS ===

const TRANSITION_DURATION = 600;

// === CONTEXT ===

const ThemeContext = createContext(null);

// === COMPONENT ===

export function ThemeProvider({ children }) {
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [currentElement, setCurrentElement] = useState(DEFAULT_ELEMENT);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef(null);

  // Current element data (all-in-one)
  const element = useMemo(() => {
    return ELEMENTS[currentElement] ?? ELEMENTS[DEFAULT_ELEMENT];
  }, [currentElement]);

  // Change element with transition
  const changeElement = useCallback((newElement) => {
    if (newElement === currentElement || isTransitioning) return;
    if (!ELEMENTS[newElement]) return;

    setIsTransitioning(true);

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    transitionTimeoutRef.current = setTimeout(() => {
      setCurrentElement(newElement);

      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, TRANSITION_DURATION / 2);
    }, TRANSITION_DURATION / 2);
  }, [currentElement, isTransitioning]);

  // Effects: Sync CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', element.colors.main);
    root.style.setProperty('--color-secondary', element.colors.second);
    root.style.setProperty('--color-tertiary', element.colors.third);
  }, [element]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Render
  const value = useMemo(() => ({
    isLoading,
    setIsLoading,
    currentElement,
    element,
    isTransitioning,
    changeElement,
  }), [isLoading, currentElement, element, isTransitioning, changeElement]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// === HOOK ===

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
