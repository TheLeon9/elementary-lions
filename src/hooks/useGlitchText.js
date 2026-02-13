import { useState, useEffect, useRef } from 'react';

// ----------------------------------------
// Glitch text scramble hook
// Scrambles text during element transitions,
// then progressively reveals the new text
// ----------------------------------------

const UPPER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const CJK_CHARS = '獅龍虎鬼神風火雷水土氷影自然';

const SCRAMBLE_SPEED = 50;
const REVEAL_SPEED = 40;
const REVEAL_STEPS = 8;

function randomFrom(str) {
  return str[Math.floor(Math.random() * str.length)];
}

function scrambleChar(char) {
  if (/[A-Z]/.test(char)) return randomFrom(UPPER_CHARS);
  if (/[a-z]/.test(char)) return randomFrom(LOWER_CHARS);
  if (/[\u3000-\u9FFF\u30A0-\u30FF\u3040-\u309F]/.test(char)) return randomFrom(CJK_CHARS);
  return char;
}

function isScrambleable(char) {
  return /[a-zA-Z0-9\u3000-\u9FFF\u30A0-\u30FF\u3040-\u309F]/.test(char);
}

function scrambleText(text) {
  return [...text].map(scrambleChar).join('');
}

export function useGlitchText(text, isTransitioning) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef(null);
  const hasTransitionedRef = useRef(false);
  const latestTextRef = useRef(text);

  // Always track the latest text
  latestTextRef.current = text;

  useEffect(() => {
    // Cleanup helper
    const cleanup = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    if (isTransitioning) {
      // Phase 1: Full scramble
      hasTransitionedRef.current = true;
      cleanup();

      intervalRef.current = setInterval(() => {
        setDisplayText(scrambleText(latestTextRef.current));
      }, SCRAMBLE_SPEED);

    } else if (hasTransitionedRef.current) {
      // Phase 2: Progressive reveal
      hasTransitionedRef.current = false;
      cleanup();

      const finalText = latestTextRef.current;
      const chars = [...finalText];
      let step = 0;

      intervalRef.current = setInterval(() => {
        step++;

        if (step >= REVEAL_STEPS) {
          cleanup();
          setDisplayText(finalText);
          return;
        }

        const revealedCount = Math.floor((step / REVEAL_STEPS) * chars.length);

        setDisplayText(
          chars.map((char, i) => {
            if (!isScrambleable(char)) return char;
            if (i < revealedCount) return char;
            return scrambleChar(char);
          }).join('')
        );
      }, REVEAL_SPEED);

    } else {
      // Initial mount: just show the text
      setDisplayText(text);
    }

    return cleanup;
  }, [isTransitioning, text]);

  return displayText;
}
