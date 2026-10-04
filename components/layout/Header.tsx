'use client';

import Link from 'next/link';
import { ArrowLeft, Bell, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showMenu?: boolean;
  showNotification?: boolean;
  onMenuClick?: () => void;
}

export default function Header({
  title,
  subtitle,
  showBack = false,
  showMenu = false,
  showNotification = false,
  onMenuClick,
}: HeaderProps) {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between px-5 pt-5 pb-3 bg-white sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl bg-[#EEF4FF] flex items-center justify-center"
            aria-label="Kembali"
          >
            <ArrowLeft size={18} className="text-[#1E3A5F]" />
          </button>
        )}
        {showMenu && (
          <button
            onClick={onMenuClick}
            className="w-9 h-9 rounded-xl bg-[#EEF4FF] flex items-center justify-center"
            aria-label="Menu"
          >
            <Menu size={18} className="text-[#1E3A5F]" />
          </button>
        )}
        <div>
          <h1 className="text-base font-bold text-[#1E3A5F] leading-tight">{title}</h1>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {showNotification && (
        <Link
          href="/notifications"
          className="w-9 h-9 rounded-xl bg-[#EEF4FF] flex items-center justify-center relative"
          aria-label="Notifikasi"
        >
          <Bell size={18} className="text-[#1E3A5F]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6B35] rounded-full" />
        </Link>
      )}
    </header>
  );
}
