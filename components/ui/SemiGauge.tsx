'use client';

import React from 'react';

interface SemiGaugeProps {
  value: number;
  max: number;
  label: string;
  subValue?: string;
  color?: string;
  trackColor?: string;
  size?: number;
}

export default function SemiGauge({
  value,
  max,
  label,
  subValue,
  color = '#F28C38',
  trackColor = '#F1F5F9',
  size = 110,
}: SemiGaugeProps) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2 + 10;
  
  // Semi-circle arc length (180 degrees = Math.PI * radius)
  const arcLength = Math.PI * radius;
  const percentage = Math.min(Math.max(value / max, 0), 1);
  const strokeDashoffset = arcLength * (1 - percentage);

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <p className="text-xs font-bold text-slate-600 mb-1 text-center">{label}</p>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size / 2 + 15 }}>
        <svg width={size} height={size / 2 + 15} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
          {/* Background Arc */}
          <path
            d={`M ${strokeWidth / 2} ${cy} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${cy}`}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Progress Arc */}
          <path
            d={`M ${strokeWidth / 2} ${cy} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${cy}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <div className="absolute bottom-1 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-extrabold text-[#102A43] leading-none">{value}</span>
          <span className="text-[10px] font-semibold text-slate-400 mt-0.5">
            {subValue || `/${max}`}
          </span>
        </div>
      </div>
    </div>
  );
}
