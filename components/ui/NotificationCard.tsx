import { Bell, BookOpen, Activity } from 'lucide-react';
import type { Notification } from '@/types';

const iconMap: Record<Notification['type'], React.ReactNode> = {
  dose: <Bell size={18} className="text-[#FF6B35]" />,
  education: <BookOpen size={18} className="text-[#1E3A5F]" />,
  measurement: <Activity size={18} className="text-[#22C55E]" />,
  alert: <Bell size={18} className="text-[#EF4444]" />,
};

const bgMap: Record<Notification['type'], string> = {
  dose: '#FFF0EB',
  education: '#EEF4FF',
  measurement: '#F0FDF4',
  alert: '#FEF2F2',
};

interface NotificationCardProps {
  notification: Notification;
}

export default function NotificationCard({ notification }: NotificationCardProps) {
  return (
    <div
      className={`card flex items-start gap-4 p-4 ${!notification.read ? 'border-l-4 border-l-[#FF6B35]' : ''}`}
    >
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: bgMap[notification.type] }}
      >
        {iconMap[notification.type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#1E3A5F] leading-tight">{notification.title}</p>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{notification.description}</p>
        <p className="text-xs text-gray-400 mt-1.5 font-medium">{notification.time}</p>
      </div>
      {!notification.read && (
        <div className="w-2 h-2 rounded-full bg-[#FF6B35] mt-1 flex-shrink-0" />
      )}
    </div>
  );
}
