'use client';

import React from 'react';
import Image from 'next/image';

interface MouthIllustrationProps {
  size?: number;
  showLabels?: boolean;
  className?: string;
  useImage?: boolean;
}

export default function MouthIllustration({
  size = 280,
  className = '',
  useImage = true,
}: MouthIllustrationProps) {
  if (useImage) {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl ${className}`}>
        <img
          src="/mouth-illustration.png"
          alt="Ilustrasi Mouth Diagram & Sensor Smart-Pabbura System"
          className="w-full h-auto object-contain max-h-[420px] rounded-2xl shadow-sm hover:scale-[1.01] transition-transform duration-300"
        />

      </div>
    );
  }

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 240 200"
        width={size}
        height={size * 0.833}
        className="drop-shadow-sm max-w-full h-auto"
        role="img"
        aria-label="Ilustrasi mulut dan sensor Smart-Pabbura"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lipGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFA085" />
            <stop offset="100%" stopColor="#E05238" />
          </linearGradient>
          <linearGradient id="cavityGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7E1D21" />
            <stop offset="100%" stopColor="#4A0E11" />
          </linearGradient>
          <linearGradient id="tongueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F48B7B" />
            <stop offset="100%" stopColor="#D95341" />
          </linearGradient>
        </defs>
        <path d="M 30 100 C 60 50, 180 50, 210 100 C 180 170, 60 170, 30 100 Z" fill="url(#lipGrad)" stroke="#C5432B" strokeWidth="3" />
        <path d="M 45 100 C 70 68, 170 68, 195 100 C 170 152, 70 152, 45 100 Z" fill="url(#cavityGrad)" />
        <ellipse cx="120" cy="132" rx="55" ry="24" fill="url(#tongueGrad)" />
        <circle cx="75" cy="118" r="8" fill="#EF4444" opacity="0.9" />
      </svg>
    </div>
  );
}
