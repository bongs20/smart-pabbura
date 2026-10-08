'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail, User as UserIcon, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { registerUser, loginWithGoogle } from '@/lib/storage';
import { isValidEmail } from '@/lib/utils';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleGoogleRegister = async () => {
    setErrorMsg('');
    setGoogleLoading(true);
    const result = await loginWithGoogle();
    if (!result.success) {
      setErrorMsg(result.message);
      setGoogleLoading(false);
    }
  };

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: 'bg-slate-200' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) || /[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password) && password.length >= 10) score += 1;

    if (score <= 1) return { score: 1, label: 'Lemah', color: 'bg-red-500', textColor: 'text-red-500' };
    if (score === 2) return { score: 2, label: 'Sedang', color: 'bg-amber-500', textColor: 'text-amber-500' };
    return { score: 3, label: 'Kuat', color: 'bg-emerald-500', textColor: 'text-emerald-500' };
  }, [password]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Nama lengkap wajib diisi.');
      return;
    }

    if (!email.trim()) {
      setErrorMsg('Email wajib diisi.');
      return;
    }

    if (!isValidEmail(email.trim())) {
      setErrorMsg('Format email tidak valid. Masukkan email yang benar (contoh: nama@gmail.com).');
      return;
    }

    if (!password) {
      setErrorMsg('Password wajib diisi.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password minimal 8 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Password dan konfirmasi password tidak sama.');
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser(fullName, email, password);

      if (!result.success) {
        setErrorMsg(result.message || 'Registrasi gagal. Silakan coba lagi.');
        setLoading(false);
        return;
      }

      if (result.requiresVerification) {
        setSuccessMsg('Registrasi berhasil. Silakan cek email Anda untuk verifikasi.');
        setLoading(false);
      } else {
        setSuccessMsg('Registrasi berhasil! Mengalihkan ke dashboard...');
        setTimeout(() => {
          router.replace('/dashboard');
        }, 1200);
      }
    } catch {
      setErrorMsg('Terjadi kesalahan pada sistem. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-4 md:p-8 text-[#102A43]">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 grid grid-cols-1 md:grid-cols-2">
        
        {/* LEFT SIDE: Brand Illustration */}
        <div className="bg-gradient-to-br from-[#102A43] via-[#1A385A] to-[#0F2238] p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F28C38]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#2F80B7]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Logo & Header */}
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-white p-1 border border-white/20 shadow-md flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                <img
                  src="/logo-full.png"
                  alt="Smart-Pabbura Logo"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-white">Smart-Pabbura</h2>
                <span className="text-xs font-medium text-[#F28C38]">System</span>
              </div>
            </Link>
          </div>

          {/* Center Graphic */}
          <div className="relative z-10 my-8 flex flex-col items-center text-center">
            <div className="w-full max-w-xs md:max-w-sm aspect-[3/2] rounded-3xl bg-white/10 p-2 backdrop-blur-md border border-white/20 shadow-2xl mb-6 overflow-hidden group">
              <img
                src="/mouth-illustration.png"
                alt="Ilustrasi Kesehatan Mulut"
                className="w-full h-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/mouth-illustration.jpg';
                }}
              />
            </div>
            
            <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight mb-3">
              Bergabung Bersama Kami
            </h1>
            <p className="text-sm text-slate-300 max-w-sm font-normal leading-relaxed">
              Mulai pantau kesehatan mulut Anda secara lebih teratur dan terukur.
            </p>
          </div>

          {/* Footer Badge */}
          <div className="relative z-10 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
            <ShieldCheck size={16} className="text-[#F28C38]" />
            <span>Terintegrasi Supabase Auth &amp; Data Terenkripsi</span>
          </div>
        </div>

        {/* RIGHT SIDE: Register Card */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-black text-[#102A43] tracking-tight mb-2">
                Buat Akun Smart-Pabbura
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Mulai pantau kesehatan mulut Anda secara lebih teratur.
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
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon size={18} />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Nurul Aulia"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F28C38] focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
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
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F28C38] focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    required
                    className="w-full pl-11 pr-11 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F28C38] focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className="text-slate-500">Kekuatan password:</span>
                      <span className={passwordStrength.textColor}>{passwordStrength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 transition-all duration-300 ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-transparent'}`} />
                      <div className={`h-full flex-1 transition-all duration-300 ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-transparent'}`} />
                      <div className={`h-full flex-1 transition-all duration-300 ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-transparent'}`} />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password Anda"
                    required
                    className="w-full pl-11 pr-11 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F28C38] focus:bg-white transition"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 rounded-2xl bg-[#102A43] hover:bg-[#1A385A] text-white font-bold text-sm shadow-md transition transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>Daftar</span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 font-semibold text-slate-400">Atau daftar dengan</span>
              </div>
            </div>

            {/* Google / Gmail Sign Up Button */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={googleLoading || loading}
              className="w-full py-3.5 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-[#102A43] font-bold text-sm shadow-sm transition flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{googleLoading ? 'Mengalihkan ke Google...' : 'Daftar dengan Google / Gmail'}</span>
            </button>

            {/* Login Link */}
            <div className="mt-6 text-center text-xs font-medium text-slate-500">
              <span>Sudah memiliki akun? </span>
              <Link
                href="/login"
                className="font-bold text-[#F28C38] hover:text-[#d87625] transition"
              >
                Masuk sekarang
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
