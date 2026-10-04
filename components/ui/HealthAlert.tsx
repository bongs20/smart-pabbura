import { AlertTriangle } from 'lucide-react';

interface HealthAlertProps {
  title?: string;
  message: string;
  type?: 'warning' | 'info' | 'danger';
}

const styles = {
  warning: {
    bg: '#FFFBEB',
    border: '#FDE68A',
    icon: '#F59E0B',
    title: '#92400E',
    text: '#78350F',
  },
  info: {
    bg: '#EFF6FF',
    border: '#BFDBFE',
    icon: '#3B82F6',
    title: '#1E40AF',
    text: '#1E3A8A',
  },
  danger: {
    bg: '#FEF2F2',
    border: '#FECACA',
    icon: '#EF4444',
    title: '#991B1B',
    text: '#7F1D1D',
  },
};

export default function HealthAlert({
  title = 'Perhatian',
  message,
  type = 'warning',
}: HealthAlertProps) {
  const s = styles[type];

  return (
    <div
      className="rounded-2xl p-4 flex gap-3"
      style={{
        backgroundColor: s.bg,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: s.border,
      }}
      role="alert"
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: s.icon + '22' }}
      >
        <AlertTriangle size={18} style={{ color: s.icon }} />
      </div>
      <div>
        <p className="font-semibold text-sm" style={{ color: s.title }}>
          {title}
        </p>
        <p className="text-xs mt-1 leading-relaxed" style={{ color: s.text }}>
          {message}
        </p>
      </div>
    </div>
  );
}
