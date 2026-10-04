import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  legend?: { label: string; color: string }[];
  children: ReactNode;
  className?: string;
}

/** Card wrapper with mockup-style header used around every Recharts chart. */
export default function ChartCard({
  title,
  subtitle,
  action,
  legend,
  children,
  className = '',
}: ChartCardProps) {
  return (
    <section className={`card p-4 ${className}`} aria-label={title}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-[#1E3A5F] leading-tight">{title}</h3>
          {subtitle && <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>

      {legend && (
        <div className="flex items-center gap-4 mb-2">
          {legend.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              <span className="text-[10px] text-gray-500">{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {children}
    </section>
  );
}
