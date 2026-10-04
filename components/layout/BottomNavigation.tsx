'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2, BookOpen, User, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/riwayat', altHref: '/analysis', label: 'Riwayat', icon: BarChart2 },
  { href: '/monitoring', label: 'Monitoring', icon: Plus, isCenter: true },
  { href: '/edukasi', altHref: '/education', label: 'Edukasi', icon: BookOpen },
  { href: '/profil', altHref: '/profile', label: 'Profil', icon: User },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-[0_-4px_20px_rgba(16,42,67,0.06)] md:hidden"
      aria-label="Navigasi utama mobile"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center px-3 py-2">
        {navItems.map(({ href, altHref, label, icon: Icon, isCenter }) => {
          const isActive =
            pathname === href ||
            (altHref && pathname === altHref) ||
            (href !== '/' && pathname.startsWith(href)) ||
            (altHref && pathname.startsWith(altHref));

          if (isCenter) {
            return (
              <div key={href} className="flex justify-center -mt-5">
                <Link
                  href={href}
                  className="w-13 h-13 w-12 h-12 rounded-full bg-[#F28C38] text-white flex flex-col items-center justify-center shadow-lg shadow-orange-500/30 hover:bg-[#E57B27] active:scale-95 transition-all"
                  aria-label={label}
                >
                  <Plus size={24} strokeWidth={2.5} />
                </Link>
              </div>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all',
                isActive ? 'text-[#F28C38] font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'
              )}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

