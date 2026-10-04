'use client';

import { useState, useEffect, useCallback } from 'react';
import { playClickSound, isSoundEnabled, setSoundEnabled } from '@/lib/sound/clickSound';

export function useClickSound() {
  const [soundEnabled, setSoundState] = useState<boolean>(true);

  useEffect(() => {
    setSoundState(isSoundEnabled());
  }, []);

  const toggleSound = useCallback((enabled?: boolean) => {
    const nextState = enabled !== undefined ? enabled : !soundEnabled;
    setSoundEnabled(nextState);
    setSoundState(nextState);
    if (nextState) {
      playClickSound();
    }
  }, [soundEnabled]);

  const playClick = useCallback(() => {
    playClickSound();
  }, []);

  return {
    soundEnabled,
    toggleSound,
    playClick,
  };
}
