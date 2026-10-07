'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  ChevronRight,
  Edit,
  FileText,
  HelpCircle,
  History,
  LogOut,
  Settings,
  Smile,
  User,
  AlertCircle,
  Volume2,
  VolumeX,
  X,
  CheckCircle2,
  Phone,
  Mail,
  ShieldCheck,
  Save,
} from 'lucide-react';
import { getCurrentUser, logoutUser, saveCurrentUser } from '@/lib/storage';
import type { AuthUser } from '@/types';
import { useSoundContext } from '@/components/providers/SoundProvider';
import { useToast } from '@/components/ui/Toast';

export default function ProfilePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { soundEnabled, toggleSound } = useSoundContext();
  const [user, setUser] = useState<AuthUser | null>(null);
  
  // Modals state
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeModal, setActiveModal] = useState<'info' | 'edit' | 'settings' | 'help' | null>(null);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  useEffect(() => {
    const current = getCurrentUser();
    setUser(current);
    if (current) {
      setEditName(current.name || '');
      setEditEmail(current.email || '');
    }
  }, []);

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    await logoutUser();
    router.replace('/login');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast('Nama tidak boleh kosong', 'error');
      return;
    }
    const updated: AuthUser = {
      id: user?.id || '1',
      name: editName.trim(),
      email: editEmail.trim() || 'user@smartpabbura.com',
      password: user?.password || '',
      status: user?.status || 'Sehat',
      createdAt: user?.createdAt || new Date().toISOString(),
    };
    saveCurrentUser(updated);
    setUser(updated);
    setActiveModal(null);
    showToast('Profil berhasil diperbarui!', 'success');
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto">
      {/* User Header Profile Card */}
      <div className="bg-gradient-to-r from-[#102A43] via-[#1E3A5F] to-[#2F80B7] rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden flex flex-col items-center justify-center text-center space-y-4">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        
        {/* Avatar */}
        <div className="relative z-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white to-[#FFF1E6] border-4 border-[#F28C38] flex items-center justify-center text-3xl font-black text-[#F28C38] shadow-md">
            {user?.name ? user.name[0].toUpperCase() : 'N'}
          </div>
          <span className="absolute bottom-1 right-1 w-5 h-5 bg-[#22C55E] rounded-full ring-4 ring-white" />
        </div>

        <div className="relative z-10 space-y-1">
          <h1 className="text-2xl font-black text-white">{user?.name || 'Nurul A.'}</h1>
          <p className="text-xs text-slate-200 font-medium">{user?.email || 'user@smartpabbura.com'}</p>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#FFF1E6] text-xs font-bold border border-white/10 mt-1">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
            <span>Status: {user?.status || 'Sehat'}</span>
          </span>
        </div>

        {/* Quick Menu Buttons */}
        <div className="grid grid-cols-4 gap-2 w-full pt-2">
          <button
            type="button"
            onClick={() => setActiveModal('edit')}
            className="p-3 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white flex flex-col items-center gap-1 text-[11px] font-bold transition-all border border-white/10"
          >
            <div className="w-8 h-8 rounded-xl bg-white text-[#F28C38] flex items-center justify-center shadow-2xs">
              <Edit size={16} />
            </div>
            <span>Edit</span>
          </button>

          <Link
            href="/riwayat"
            className="p-3 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white flex flex-col items-center gap-1 text-[11px] font-bold transition-all border border-white/10"
          >
            <div className="w-8 h-8 rounded-xl bg-white text-[#2F80B7] flex items-center justify-center shadow-2xs">
              <History size={16} />
            </div>
            <span>Riwayat</span>
          </Link>

          <Link
            href="/riwayat"
            className="p-3 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white flex flex-col items-center gap-1 text-[11px] font-bold transition-all border border-white/10"
          >
            <div className="w-8 h-8 rounded-xl bg-white text-[#22C55E] flex items-center justify-center shadow-2xs">
              <FileText size={16} />
            </div>
            <span>Laporan</span>
          </Link>

          <Link
            href="/notifikasi"
            className="p-3 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white flex flex-col items-center gap-1 text-[11px] font-bold transition-all border border-white/10"
          >
            <div className="w-8 h-8 rounded-xl bg-white text-purple-600 flex items-center justify-center shadow-2xs">
              <Bell size={16} />
            </div>
            <span>Notifikasi</span>
          </Link>
        </div>
      </div>

      {/* Settings & Info Menu List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-2">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Profil &amp; Kesehatan</h2>

        <div className="space-y-1">
          {/* 1. Informasi Pribadi Modal Trigger */}
          <button
            type="button"
            onClick={() => setActiveModal('info')}
            className="w-full p-3.5 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-slate-800 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <User size={18} className="text-[#F28C38]" />
              <span className="text-xs font-bold text-[#102A43]">Informasi Pribadi</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>

          {/* 2. Riwayat Kesehatan Link */}
          <Link
            href="/riwayat"
            className="p-3.5 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-slate-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <History size={18} className="text-[#2F80B7]" />
              <span className="text-xs font-bold text-[#102A43]">Riwayat Kesehatan</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </Link>

          {/* 3. Data Mulut & Parameter Link */}
          <Link
            href="/monitoring"
            className="p-3.5 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-slate-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Smile size={18} className="text-[#22C55E]" />
              <span className="text-xs font-bold text-[#102A43]">Data Mulut &amp; Parameter</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </Link>

          {/* 4. Toggle Suara Interaksi */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-[#F28C38] flex items-center justify-center shadow-2xs">
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#102A43]">Suara Interaksi</h3>
                <p className="text-[11px] text-slate-500">Dengarkan suara saat tombol dan menu ditekan.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleSound()}
              aria-label="Pengaturan suara interaksi"
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                soundEnabled ? 'bg-[#F28C38]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 5. Pengaturan Aplikasi Modal Trigger */}
          <button
            type="button"
            onClick={() => setActiveModal('settings')}
            className="w-full p-3.5 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-slate-800 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Settings size={18} className="text-slate-500" />
              <span className="text-xs font-bold text-[#102A43]">Pengaturan Aplikasi</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>

          {/* 6. Bantuan & Kontak Modal Trigger */}
          <button
            type="button"
            onClick={() => setActiveModal('help')}
            className="w-full p-3.5 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-slate-800 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <HelpCircle size={18} className="text-slate-500" />
              <span className="text-xs font-bold text-[#102A43]">Bantuan &amp; Kontak</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={() => setShowLogoutModal(true)}
        className="w-full py-4 rounded-2xl bg-[#F28C38] hover:bg-[#E57B27] text-white font-extrabold text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
      >
        <LogOut size={18} />
        <span>Keluar</span>
      </button>

      {/* MODAL 1: INFORMASI PRIBADI */}
      {activeModal === 'info' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <User className="text-[#F28C38]" size={20} />
                <h3 className="text-base font-black text-[#102A43]">Informasi Pribadi</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Nama Lengkap</span>
                <p className="font-extrabold text-[#102A43] text-sm">{user?.name || 'Nurul A.'}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Alamat Email</span>
                <p className="font-semibold text-slate-700">{user?.email || 'user@smartpabbura.com'}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Status Klinis</span>
                  <span className="font-bold text-[#22C55E] block">{user?.status || 'Sehat'}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Terapi Aktif</span>
                  <span className="font-bold text-[#F28C38] block">Turate Lozenges</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveModal('edit')}
              className="w-full py-3 rounded-xl bg-[#102A43] hover:bg-[#1A385A] text-white font-bold text-xs transition"
            >
              Edit Informasi
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT PROFIL */}
      {activeModal === 'edit' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <form onSubmit={handleSaveProfile} className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit className="text-[#F28C38]" size={20} />
                <h3 className="text-base font-black text-[#102A43]">Edit Profil</h3>
              </div>
              <button type="button" onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#102A43] mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#102A43] focus:outline-none focus:border-[#F28C38]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#102A43] mb-1">Alamat Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#102A43] focus:outline-none focus:border-[#F28C38]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="py-2.5 rounded-xl bg-[#F28C38] hover:bg-[#E57B27] text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-1.5"
              >
                <Save size={16} />
                <span>Simpan</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: PENGATURAN APLIKASI */}
      {activeModal === 'settings' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="text-[#F28C38]" size={20} />
                <h3 className="text-base font-black text-[#102A43]">Pengaturan Aplikasi</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#102A43]">Suara Interaksi Klik</h4>
                  <p className="text-[11px] text-slate-500">Efek audio saat menekan menu</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSound()}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    soundEnabled ? 'bg-[#F28C38]' : 'bg-slate-300'
                  }`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${soundEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#102A43]">Pengingat Dosis Harian</h4>
                  <p className="text-[11px] text-slate-500">Notifikasi jadwal minum lozenges</p>
                </div>
                <span className="font-bold text-[#22C55E]">Aktif</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#102A43]">Mode Penyimpanan Data</h4>
                  <p className="text-[11px] text-slate-500">Enkripsi Penyimpanan Lokal</p>
                </div>
                <span className="font-bold text-[#2F80B7]">LocalStorage</span>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 rounded-xl bg-[#102A43] text-white font-bold text-xs"
            >
              Tutup Pengaturan
            </button>
          </div>
        </div>
      )}

      {/* MODAL 4: BANTUAN & KONTAK */}
      {activeModal === 'help' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="text-[#F28C38]" size={20} />
                <h3 className="text-base font-black text-[#102A43]">Bantuan &amp; Layanan Kontak</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#EEF7FC] border border-blue-100 flex items-center gap-3">
                <Mail className="text-[#2F80B7]" size={20} />
                <div>
                  <h4 className="font-bold text-[#102A43]">Email Dukungan Medis</h4>
                  <p className="text-slate-600">support@smartpabbura.com</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFF1E6] border border-orange-100 flex items-center gap-3">
                <Phone className="text-[#F28C38]" size={20} />
                <div>
                  <h4 className="font-bold text-[#102A43]">Layanan Konsultasi Turate</h4>
                  <p className="text-slate-600">+62 812-3456-7890 (WhatsApp)</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#EAF7EE] border border-green-100 flex items-center gap-3">
                <ShieldCheck className="text-[#22C55E]" size={20} />
                <div>
                  <h4 className="font-bold text-[#102A43]">Panduan Penggunaan Lozenges</h4>
                  <p className="text-slate-600">Terapi Turate Denti 3x Sehari</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 rounded-xl bg-[#102A43] text-white font-bold text-xs"
            >
              Tutup Bantuan
            </button>
          </div>
        </div>
      )}

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

