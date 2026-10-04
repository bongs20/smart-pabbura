'use client';

import { useEffect, useState } from 'react';
import ProgressRing from './ProgressRing';
import { formatCountdown } from '@/lib/utils';

const DOSE_INTERVAL_SECONDS = 8 * 60 * 60; // 8 hours between doses

interface DoseTimerProps {
  nextDoseAt?: string; // ISO timestamp
}

export default function DoseTimer({ nextDoseAt }: DoseTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [nextTime, setNextTime] = useState('09:30');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const getOrSetNextDoseTime = () => {
      if (typeof window === 'undefined') return DOSE_INTERVAL_SECONDS;

      const stored = localStorage.getItem('sp_next_dose_time');
      let targetMs: number;

      if (stored) {
        targetMs = parseInt(stored, 10);
      } else {
        // Default: next dose in 1h20m35s (matching mockup)
        targetMs = Date.now() + (1 * 3600 + 20 * 60 + 35) * 1000;
        localStorage.setItem('sp_next_dose_time', targetMs.toString());
      }

      const now = Date.now();
      const diff = Math.max(0, Math.floor((targetMs - now) / 1000));

      // Format next time
      const next = new Date(targetMs);
      setNextTime(next.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB');

      return diff;
    };

    setSecondsLeft(getOrSetNextDoseTime());

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 0) {
          // Reset timer for next dose
          const nextTarget = Date.now() + DOSE_INTERVAL_SECONDS * 1000;
          localStorage.setItem('sp_next_dose_time', nextTarget.toString());
          return DOSE_INTERVAL_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="w-44 h-44 rounded-full bg-gray-100 animate-pulse" />
      </div>
    );
  }

  const totalSeconds = DOSE_INTERVAL_SECONDS;
  const progress = Math.max(0, secondsLeft / totalSeconds);
  const displayTime = formatCountdown(secondsLeft);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Outer ring */}
      <div className="relative" style={{ width: 176, height: 176 }}>
        <svg width={176} height={176} viewBox="0 0 176 176" style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            cx={88}
            cy={88}
            r={80}
            fill="none"
            stroke="#FEE2D3"
            strokeWidth={10}
          />
          {/* Progress */}
          <circle
            cx={88}
            cy={88}
            r={80}
            fill="none"
            stroke="#FF6B35"
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 80}
            strokeDashoffset={2 * Math.PI * 80 * (1 - progress)}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xs text-gray-400 mb-1">Time</p>
          <p className="text-3xl font-bold text-[#1E3A5F] tabular-nums tracking-tight">
            {displayTime}
          </p>
          <p className="text-sm text-gray-500 mt-1">{nextTime}</p>
        </div>
      </div>
    </div>
  );
}
