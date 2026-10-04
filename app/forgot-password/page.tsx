'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Mail, ShieldCheck } from 'lucide-react';
import { forgotPasswordUser } from '@/lib/storage';
import { isValidEmail } from '@/lib/utils';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim()) {
      setErrorMsg('Email wajib diisi.');
      return;
    }

    if (!isValidEmail(email.trim())) {
      setErrorMsg('Format email tidak valid. Masukkan email yang benar (contoh: nama@gmail.com).');
      return;
    }

    setLoading(true);

    try {
      const result = await forgotPasswordUser(email);

      if (!result.success) {
        setErrorMsg(result.message);
        setLoading(false);
        return;
      }

      setSuccessMsg('Link reset password telah dikirim ke email Anda.');
    } catch {
      setErrorMsg('Terjadi kesalahan pada sistem. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-4 md:p-8 text-[#102A43]">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-8 md:p-10">
        
        {/* Back Link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#102A43] transition mb-6"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Halaman Login</span>
        </Link>

        {/* Header */}
        <div className="mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF1E6] text-[#F28C38] flex items-center justify-center mb-4">
            <Mail size={24} />
          </div>
          <h1 className="text-2xl font-black text-[#102A43] tracking-tight mb-2">
            Lupa Password?
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Masukkan email Anda untuk mendapatkan tautan reset password.
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F28C38] focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-[#102A43] hover:bg-[#1A385A] text-white font-bold text-sm shadow-md transition transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <span>Kirim Link Reset</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
          <ShieldCheck size={16} className="text-[#F28C38]" />
          <span>Smart-Pabbura Security Center</span>
        </div>

      </div>
    </div>
  );
}
