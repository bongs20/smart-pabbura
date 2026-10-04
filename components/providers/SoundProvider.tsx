'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { playClickSound, isSoundEnabled, setSoundEnabled } from '@/lib/sound/clickSound';

interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: (enabled?: boolean) => void;
  playClick: () => void;
}

const SoundContext = createContext<SoundContextType>({
  soundEnabled: true,
  toggleSound: () => {},
  playClick: () => {},
});

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundState] = useState<boolean>(true);

  useEffect(() => {
    setSoundState(isSoundEnabled());
  }, []);

  const toggleSound = useCallback((enabled?: boolean) => {
    setSoundState((prev) => {
      const next = enabled !== undefined ? enabled : !prev;
      setSoundEnabled(next);
      if (next) {
        playClickSound();
      }
      return next;
    });
  }, []);

  const playClick = useCallback(() => {
    playClickSound();
  }, []);

  // Global Event Delegator for Automatic Click Sound on All Interactive Elements
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      // Find closest interactive element
      const interactiveEl = target.closest<HTMLElement>(
        'button, a, input[type="checkbox"], input[type="radio"], input[type="submit"], input[type="button"], select, summary, [role="button"], [role="tab"], [role="menuitem"], [role="switch"], .clickable-card, [data-clickable="true"]'
      );

      if (interactiveEl) {
        playClickSound();
      }
    };

    window.addEventListener('click', handleGlobalClick, { capture: true, passive: true });
    return () => {
      window.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, []);

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound, playClick }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundContext() {
  return useContext(SoundContext);
}
