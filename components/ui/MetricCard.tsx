import { cn } from '@/lib/utils';
import ProgressRing from './ProgressRing';

interface MetricCardProps {
  title: string;
  value: number;
  max: number;
  /** '%' renders "68%", otherwise renders "value/max" (e.g. "3/10"). */
  unit?: string;
  color?: string;
  className?: string;
}

/** Circular metric card used on the dashboard (VAS, pH, Kebersihan, Hidrasi). */
export default function MetricCard({
  title,
  value,
  max,
  unit,
  color = '#FF6B35',
  className,
}: MetricCardProps) {
  const isPercent = unit === '%';
  const displayUnit = unit || max.toString();

  return (
    <div className={cn('card flex flex-col items-center p-4 gap-2', className)}>
      <ProgressRing
        value={value}
        max={max}
        color={color}
        size={76}
        strokeWidth={7}
        centerText={isPercent ? `${value}%` : `${value}/${displayUnit}`}
      />
      <p className="text-xs text-gray-500 text-center font-medium leading-tight">
        {title}
      </p>
    </div>
  );
}
