'use client';

import { useRouter } from 'next/navigation';
import { X, Clipboard, Activity, Pill, Camera } from 'lucide-react';
import { useEffect, useState } from 'react';

const quickActions = [
  {
    id: 'pain',
    label: 'Catat Nyeri',
    description: 'Rekam tingkat nyeri VAS',
    icon: Activity,
    href: '/pain-log',
    color: '#FF6B35',
    bg: '#FFF0EB',
  },
  {
    id: 'condition',
    label: 'Catat Kondisi Mulut',
    description: 'Rekam kondisi sariawan hari ini',
    icon: Clipboard,
    href: '/ulcer-documentation',
    color: '#1E3A5F',
    bg: '#EEF4FF',
  },
  {
    id: 'dose',
    label: 'Catat Dosis',
    description: 'Konfirmasi konsumsi lozenges',
    icon: Pill,
    href: '/lozenges',
    color: '#22C55E',
    bg: '#F0FDF4',
  },
  {
    id: 'photo',
    label: 'Upload Foto Ulser',
    description: 'Dokumentasi visual luka',
    icon: Camera,
    href: '/ulcer-documentation',
    color: '#8B5CF6',
    bg: '#F5F3FF',
  },
];

// Simple global event bus
export const openQuickAction = () => {
  window.dispatchEvent(new CustomEvent('open-quick-action'));
};

export default function QuickActionSheet() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('open-quick-action', handler);
    return () => window.removeEventListener('open-quick-action', handler);
  }, []);

  const closeModal = () => setIsOpen(false);

  const handleAction = (href: string) => {
    closeModal();
    router.push(href);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      style={{ maxWidth: '430px', left: '50%', transform: 'translateX(-50%)' }}
      onClick={closeModal}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Sheet */}
      <div
        className="relative w-full bg-white rounded-t-3xl px-5 pt-4 pb-10 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[#1E3A5F]">Aksi Cepat</h2>
          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
            aria-label="Tutup"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Action list */}
        <div className="flex flex-col gap-3">
          {quickActions.map(({ id, label, description, icon: Icon, href, color, bg }) => (
            <button
              key={id}
              onClick={() => handleAction(href)}
              className="flex items-center gap-4 p-4 rounded-2xl text-left transition-transform hover:scale-[1.01] active:scale-[0.99]"
              style={{ backgroundColor: bg }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: color + '22' }}
              >
                <Icon size={22} style={{ color }} />
              </div>
              <div>
                <p className="font-semibold text-[#1E3A5F] text-sm">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
