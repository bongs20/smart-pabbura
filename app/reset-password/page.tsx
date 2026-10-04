'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { resetPasswordUser } from '@/lib/storage';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!newPassword) {
      setErrorMsg('Password baru wajib diisi.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg('Password minimal 8 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Password dan konfirmasi password tidak sama.');
      return;
    }

    setLoading(true);

    try {
      const result = await resetPasswordUser(newPassword, confirmPassword);

      if (!result.success) {
        setErrorMsg(result.message);
        setLoading(false);
        return;
      }

      setSuccessMsg('Password berhasil diperbarui. Mengalihkan ke halaman login...');
      setTimeout(() => {
        router.replace('/login');
      }, 1500);
    } catch {
      setErrorMsg('Terjadi kesalahan pada sistem. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-4 md:p-8 text-[#102A43]">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-8 md:p-10">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF1E6] text-[#F28C38] flex items-center justify-center mx-auto mb-4">
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-black text-[#102A43] tracking-tight mb-2">
            Reset Password
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Masukkan password baru untuk akun Smart-Pabbura Anda.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-3 animate-fadeIn">
            <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium flex items-center gap-3 animate-fadeIn">
            <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Password Baru
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                required
                className="w-full pl-11 pr-11 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F28C38] focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Konfirmasi Password Baru
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
                required
                className="w-full pl-11 pr-11 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F28C38] focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 rounded-2xl bg-[#102A43] hover:bg-[#1A385A] text-white font-bold text-sm shadow-md transition transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <span>Ubah Password</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <Link
            href="/login"
            className="text-xs font-bold text-[#F28C38] hover:text-[#d87625] transition"
          >
            Kembali ke Halaman Login
          </Link>
        </div>

      </div>
    </div>
  );
}
