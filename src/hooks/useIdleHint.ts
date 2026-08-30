import { useEffect, useState } from 'react';

const DEFAULT_RESET_EVENTS = ['pointermove', 'pointerdown', 'keydown', 'touchstart'] as const;

type UseIdleHintOptions = {
  active?: boolean;
  delay?: number;
  resetOn?: readonly string[];
};

export function useIdleHint({ active = true, delay = 8000, resetOn = DEFAULT_RESET_EVENTS }: UseIdleHintOptions = {}) {
  const [level, setLevel] = useState(0);

  useEffect(() => {
    if (!active || level >= 3) return;
    const timer = window.setTimeout(() => setLevel((current) => Math.min(3, current + 1)), delay);
    return () => window.clearTimeout(timer);
  }, [active, delay, level]);

  useEffect(() => {
    if (!active) {
      setLevel(0);
      return;
    }
    const reset = () => setLevel(0);
    resetOn.forEach((eventName) => window.addEventListener(eventName, reset, { passive: true }));
    return () => resetOn.forEach((eventName) => window.removeEventListener(eventName, reset));
  }, [active, resetOn]);

  return level;
}
