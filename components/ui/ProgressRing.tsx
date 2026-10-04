'use client';

interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  unit?: string;
  centerText?: string;
  className?: string;
}

export default function ProgressRing({
  value,
  max,
  size = 80,
  strokeWidth = 7,
  color = '#FF6B35',
  trackColor = '#F1F5F9',
  label,
  unit,
  centerText,
  className = '',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(value / max, 1);
  const dashOffset = circumference * (1 - percentage);

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(-90deg)' }}
          aria-label={`${label}: ${value} dari ${max}`}
          role="img"
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              transition: 'stroke-dashoffset 0.6s ease-out',
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerText ? (
            <span className="text-xs font-bold text-[#1E3A5F]">{centerText}</span>
          ) : (
            <>
              <span className="text-sm font-bold text-[#1E3A5F] leading-none">{value}</span>
              {unit && <span className="text-[9px] text-gray-400">/{unit}</span>}
            </>
          )}
        </div>
      </div>

      {label && (
        <span className="text-xs text-gray-500 text-center leading-tight">{label}</span>
      )}
    </div>
  );
}
