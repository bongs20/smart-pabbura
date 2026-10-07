'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { loginUser, loginWithGoogle } from '@/lib/storage';
import { isValidEmail } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setGoogleLoading(true);
    const result = await loginWithGoogle();
    if (!result.success) {
      setErrorMsg(result.message);
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg('');

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

    setLoading(true);

    try {
      const result = await loginUser(email, password);

      if (!result.success) {
        setErrorMsg(result.message || 'Email atau password tidak sesuai.');
        setLoading(false);
        return;
      }

      router.replace('/dashboard');
    } catch {
      setErrorMsg('Terjadi kesalahan pada sistem. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-4 md:p-8 text-[#102A43]">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 grid grid-cols-1 md:grid-cols-2">
        
        {/* LEFT SIDE: Brand Illustration & Tagline */}
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

          {/* Center Graphic & Tagline */}
          <div className="relative z-10 my-8 flex flex-col items-center text-center">
            <div className="w-48 h-48 md:w-60 md:h-60 rounded-3xl bg-white/10 p-4 backdrop-blur-md border border-white/15 flex items-center justify-center shadow-2xl mb-6">
              <img
                src="/mouth-illustration.png"
                alt="Ilustrasi Kesehatan Mulut"
                className="w-full h-full object-contain filter drop-shadow-lg"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).src = '/logo-icon.png';
                }}
              />
            </div>
            
            <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight mb-3">
              Solusi Stomatitis Pintar &amp; Terukur
            </h1>
            <p className="text-sm text-slate-300 max-w-sm font-normal leading-relaxed">
              Pantau kesehatan mulut Anda secara lebih teratur dengan Smart-Pabbura System.
            </p>
          </div>

          {/* Footer Badge */}
          <div className="relative z-10 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
            <ShieldCheck size={16} className="text-[#F28C38]" />
            <span>Terintegrasi Supabase Auth &amp; Data Terenkripsi</span>
          </div>
        </div>

        {/* RIGHT SIDE: Login Card */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-[#102A43] tracking-tight mb-2">
                Selamat Datang Kembali 👋
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Masuk untuk melanjutkan monitoring kesehatan mulut Anda.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-3 animate-fadeIn">
                <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
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

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
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
                    placeholder="Masukkan password Anda"
                    required
                    className="w-full pl-11 pr-11 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F28C38] focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Options Row: Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs font-semibold pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-[#102A43] transition">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#F28C38] focus:ring-[#F28C38] cursor-pointer"
                  />
                  <span>Ingat saya</span>
                </label>

                <Link
                  href="/forgot-password"
                  className="text-[#F28C38] hover:text-[#d87625] transition"
                >
                  Lupa password?
                </Link>
              </div>

              {/* Submit Button */}
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
                  <span>Masuk</span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 font-semibold text-slate-400">Atau masuk dengan</span>
              </div>
            </div>

            {/* Google / Gmail Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
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
              <span>{googleLoading ? 'Mengalihkan ke Google...' : 'Lanjutkan dengan Google / Gmail'}</span>
            </button>

            {/* Register Link */}
            <div className="mt-8 text-center text-xs font-medium text-slate-500">
              <span>Belum memiliki akun? </span>
              <Link
                href="/register"
                className="font-bold text-[#F28C38] hover:text-[#d87625] transition"
              >
                Daftar sekarang
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
