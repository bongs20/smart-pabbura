'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, QrCode, User, LogOut, Settings, ChevronDown, AlertCircle } from 'lucide-react';
import BottomNavigation from './BottomNavigation';
import QuickActionSheet from './QuickActionSheet';
import { getCurrentUser, logoutUser } from '@/lib/storage';
import type { AuthUser } from '@/types';

const NO_SHELL_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password', '/baseline'];

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const showShell = !NO_SHELL_ROUTES.some((route) => pathname.startsWith(route));

  useEffect(() => {
    setUser(getCurrentUser());
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    setDropdownOpen(false);
    await logoutUser();
    router.replace('/login');
  };

  if (!showShell) {
    return <div className="min-h-screen bg-[#F7F9FC]">{children}</div>;
  }

  const navLinks = [
    { href: '/', altHref: '/dashboard', label: 'Beranda' },
    { href: '/monitoring', label: 'Monitoring' },
    { href: '/dosis', altHref: '/lozenges', label: 'Dosis' },
    { href: '/riwayat', altHref: '/analysis', label: 'Riwayat' },
    { href: '/edukasi', altHref: '/education', label: 'Edukasi' },
    { href: '/rekomendasi', altHref: '/treatment', label: 'Rekomendasi' },
    { href: '/profil', altHref: '/profile', label: 'Profil' },
  ];

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'N';
  const userName = user?.name || 'Pengguna';
  const userStatus = user?.status || 'Sehat';

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col text-[#102A43] font-sans">
      {/* Desktop Top Header */}
      <header className="hidden md:block sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 min-h-[72px] py-2.5 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Title (Fixed no-wrap) */}
          <Link href="/" className="flex items-center gap-3 group shrink-0 select-none">
            <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-2xl bg-white p-0 border border-slate-200 shadow-xs flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
              <img
                src="/logo-full.png"
                alt="Smart-Pabbura System Logo"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="shrink-0">
              <h1 className="text-base lg:text-lg font-black text-[#102A43] tracking-tight whitespace-nowrap group-hover:text-[#F28C38] transition-colors leading-tight">
                Smart-Pabbura System
              </h1>
              <p className="text-[11px] lg:text-xs font-semibold text-slate-500 whitespace-nowrap leading-snug">
                Solusi Stomatitis Pintar &amp; Terukur
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-[#E6ECF2] shadow-2xs shrink-0" aria-label="Navigasi Desktop">
            {navLinks.map(({ href, altHref, label }) => {
              const isActive =
                pathname === href ||
                (altHref && pathname === altHref) ||
                (href !== '/' && pathname.startsWith(href)) ||
                (altHref && pathname.startsWith(altHref));

              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-xl text-xs lg:text-sm font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#FFF1E6] text-[#F28C38] border border-[#F28C38]/20 shadow-2xs'
                      : 'text-[#66788A] hover:text-[#F28C38] hover:bg-[#FFF1E6]/70'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/scan"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFF1E6] hover:bg-[#FFE3D0] text-[#F28C38] text-xs font-bold transition-colors"
            >
              <QrCode size={16} />
              <span>Scan QR</span>
            </Link>

            <Link
              href="/notifikasi"
              className="relative w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#102A43] flex items-center justify-center transition-colors"
              aria-label="Notifikasi"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#F28C38] rounded-full ring-2 ring-white" />
            </Link>

            {/* Profile Avatar Dropdown Container */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 transition-colors focus:outline-none"
              >
                <div className="w-8 h-8 rounded-xl bg-[#F28C38] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {userInitial}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-bold text-[#102A43] leading-tight truncate max-w-[120px]">
                    {userName}
                  </p>
                  <span className="inline-flex items-center text-[10px] font-semibold text-[#2F80B7]">
                    ● {userStatus}
                  </span>
                </div>
                <ChevronDown size={14} className={`text-slate-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-[#102A43]">{userName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email || 'user@smartpabbura.com'}</p>
                  </div>

                  <Link
                    href="/profil"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#F28C38] transition"
                  >
                    <User size={16} />
                    <span>Profil Saya</span>
                  </Link>

                  <Link
                    href="/profil"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#F28C38] transition"
                  >
                    <Settings size={16} />
                    <span>Pengaturan</span>
                  </Link>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      setShowLogoutModal(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition text-left"
                  >
                    <LogOut size={16} />
                    <span>Keluar</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-6 py-4 md:py-8 pb-24 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
      <QuickActionSheet />

      {/* Confirmation Modal for Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-lg font-black text-[#102A43] mb-2">Konfirmasi Keluar</h3>
            <p className="text-xs text-slate-500 font-medium mb-6">
              Apakah Anda yakin ingin keluar dari akun Smart-Pabbura?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition shadow-md"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
