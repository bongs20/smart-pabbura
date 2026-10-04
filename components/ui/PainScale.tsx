'use client';

interface PainScaleProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const painColors = [
  '#22C55E', '#4ADE80', '#86EFAC', '#FDE047',
  '#FCD34D', '#FBBF24', '#F97316', '#FB923C',
  '#EF4444', '#DC2626', '#991B1B',
];

const painLabels = [
  'Tidak Nyeri', 'Sangat Ringan', 'Ringan', 'Ringan-Sedang',
  'Sedang', 'Cukup Nyeri', 'Nyeri', 'Nyeri Berat',
  'Sangat Berat', 'Mendekati Tak Tertahankan', 'Tak Tertahankan',
];

export default function PainScale({
  value,
  onChange,
  min = 0,
  max = 10,
}: PainScaleProps) {
  const activeColor = painColors[value] || '#FF6B35';
  const activeLabel = painLabels[value] || '';

  const sliderStyle = {
    background: `linear-gradient(to right, ${activeColor} 0%, ${activeColor} ${(value / max) * 100}%, #F1F5F9 ${(value / max) * 100}%, #F1F5F9 100%)`,
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Slider CSS injected via style tag */}
      <style>{`
        .pain-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: ${activeColor};
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        .pain-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: ${activeColor};
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        .pain-slider { -webkit-appearance: none; appearance: none; }
      `}</style>

      {/* Current value display */}
      <div className="flex items-center gap-3">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: activeColor + '22' }}
        >
          <span className="text-2xl font-bold" style={{ color: activeColor }}>
            {value}
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1E3A5F]">{activeLabel}</p>
          <p className="text-xs text-gray-400">Skala {value} dari {max}</p>
        </div>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="pain-slider w-full h-3 rounded-full cursor-pointer"
        style={sliderStyle}
        aria-label={`Skala nyeri: ${value} dari ${max}`}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
      />

      {/* Scale labels */}
      <div className="flex justify-between px-1">
        {[0, 2, 4, 6, 8, 10].map((n) => (
          <span key={n} className="text-xs text-gray-400">{n}</span>
        ))}
      </div>

      {/* Color gradient bar */}
      <div
        className="h-2 rounded-full"
        style={{
          background: 'linear-gradient(to right, #22C55E, #FCD34D, #F97316, #EF4444, #991B1B)',
        }}
      />
      <div className="flex justify-between">
        <span className="text-[10px] text-gray-400">Tidak Nyeri</span>
        <span className="text-[10px] text-gray-400">Tak Tertahankan</span>
      </div>
    </div>
  );
}
