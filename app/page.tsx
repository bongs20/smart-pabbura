'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock,
  Droplets,
  HeartPulse,
  Leaf,
  QrCode,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Thermometer,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import MouthIllustration from '@/components/ui/MouthIllustration';
import SemiGauge from '@/components/ui/SemiGauge';
import ProgressRing from '@/components/ui/ProgressRing';
import { getHealthData, getTodayDoseRecord, getCurrentUser, incrementTodayDose } from '@/lib/storage';
import { formatCountdown } from '@/lib/utils';
import type { HealthMetrics, DoseRecord } from '@/types';
import { useToast } from '@/components/ui/Toast';

// Mock chart data for pH changes over dates
const phTrendData7d = [
  { label: '22 Mei', ph: 6.0, vas: 4 },
  { label: '23 Mei', ph: 6.8, vas: 3 },
  { label: '24 Mei', ph: 7.0, vas: 3 },
  { label: '25 Mei', ph: 7.2, vas: 2 },
  { label: '26 Mei', ph: 7.4, vas: 2 },
  { label: '27 Mei', ph: 7.6, vas: 1 },
  { label: '28 Mei', ph: 7.8, vas: 1 },
];

const phTrendData14d = [
  { label: '15 Mei', ph: 4.8, vas: 9 },
  { label: '17 Mei', ph: 5.2, vas: 8 },
  { label: '19 Mei', ph: 5.8, vas: 6 },
  { label: '21 Mei', ph: 6.2, vas: 5 },
  { label: '23 Mei', ph: 6.8, vas: 3 },
  { label: '25 Mei', ph: 7.2, vas: 2 },
  { label: '28 Mei', ph: 7.8, vas: 1 },
];

const phTrendData30d = [
  { label: '1 Mei', ph: 4.2, vas: 10 },
  { label: '7 Mei', ph: 4.9, vas: 8 },
  { label: '14 Mei', ph: 5.5, vas: 7 },
  { label: '21 Mei', ph: 6.2, vas: 5 },
  { label: '28 Mei', ph: 7.8, vas: 1 },
];

const healingBarData = [
  { day: 'Hari 1', days: 10, target: 10 },
  { day: 'Hari 3', days: 7, target: 7 },
  { day: 'Hari 5', days: 5, target: 5 },
  { day: 'Hari 7', days: 8, target: 8 },
  { day: 'Hari 10', days: 5, target: 5 },
  { day: 'Hari 14', days: 2, target: 2 },
];

export default function HomePage() {
  const { showToast } = useToast();
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [doseInfo, setDoseInfo] = useState<DoseRecord | null>(null);
  const [doseActive, setDoseActive] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(1 * 3600 + 20 * 60 + 35);
  const [chartMode, setChartMode] = useState<'ph' | 'healing'>('ph');
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d'>('7d');
  const [userName, setUserName] = useState<string>('Nurul');

  useEffect(() => {
    setMetrics(getHealthData());
    setDoseInfo(getTodayDoseRecord());
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUserName(currentUser.name || currentUser.email.split('@')[0] || 'Pengguna');
    }
  }, []);

  // Countdown timer for lozenge dose
  useEffect(() => {
    if (!doseActive) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => (s <= 0 ? 8 * 3600 : s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [doseActive]);

  const vas = metrics?.vas ?? 3;
  const ph = metrics?.ph ?? 6.8;
  const hydration = metrics?.hydration ?? 82;
  const cleanliness = metrics?.cleanliness ?? 68;
  const flavonoid = metrics?.flavonoidIntake ?? 15;
  const temp = metrics?.oralTemperature ?? 36.9;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#102A43] via-[#1E3A5F] to-[#2F80B7] rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-[#FFF1E6] mb-3 border border-white/10">
              <Sparkles size={14} className="text-[#F28C38]" />
              <span>Smart-Pabbura Digital Healthcare</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Selamat Datang, {userName} 👋
            </h1>
            <p className="text-slate-200 text-sm md:text-base mt-1 max-w-xl font-normal">
              Pantau kesehatan mulut Anda secara lebih teratur dan terukur dengan terapi Turate Denti Lozenges.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/scan"
              className="px-5 py-3 rounded-2xl bg-[#F28C38] hover:bg-[#E57B27] text-white font-bold text-sm shadow-md shadow-orange-500/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <QrCode size={18} />
              <span>Scan QR Turate</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT / MAIN COLUMN (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Status Mulut Real-Time Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5 overflow-hidden">
            {/* Header Bar */}
            <div className="bg-gradient-to-r from-[#102A43] via-[#1E3A5F] to-[#1F4E79] text-white p-5 -mx-6 -mt-6 mb-5 flex items-center justify-between border-b border-white/10">
              <div>
                <h2 className="text-base font-extrabold text-white">Status Mulut Real-Time</h2>
                <p className="text-xs text-slate-200">Hasil pemantauan parameter sensorik rongga mulut</p>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-[#22B573] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs border border-white/20">
                <CheckCircle2 size={14} className="text-white" />
                <span>Kondisi: Sehat</span>
              </span>
            </div>

            {/* Gauges & Radial Progress Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <SemiGauge
                value={vas}
                max={10}
                label="Nyeri (VAS)"
                subValue="/10"
                color="#F28C38"
              />
              <SemiGauge
                value={ph}
                max={14}
                label="Keasaman (pH)"
                subValue="/14"
                color="#2F80B7"
              />
              <div className="flex flex-col items-center justify-center p-3.5 bg-white rounded-2xl border border-[#E6ECF2] shadow-xs">
                <p className="text-xs font-bold text-[#66788A] mb-2">Kebersihan (pH)</p>
                <ProgressRing value={cleanliness} max={100} unit="%" color="#22B573" size={74} />
              </div>
              <div className="flex flex-col items-center justify-center p-3.5 bg-white rounded-2xl border border-[#E6ECF2] shadow-xs">
                <p className="text-xs font-bold text-[#66788A] mb-2">Hidrasi Mukosa</p>
                <ProgressRing value={hydration} max={100} unit="%" color="#29A9C9" size={74} />
              </div>
            </div>

            {/* Mouth Illustration Card */}
            <div className="bg-[#EEF7FC] rounded-2xl p-5 border border-[#E6ECF2] relative space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[#102A43] flex items-center gap-2">
                  <Stethoscope size={18} className="text-[#F28C38]" />
                  <span>Anatomi Mulut &amp; Sensor Smart-Pabbura</span>
                </h3>
                <span className="text-[11px] font-bold text-[#2F80B7] bg-white px-3 py-1 rounded-full border border-[#2F80B7]/20 shadow-2xs">
                  Model Presisi Digital
                </span>
              </div>

              {/* Uploaded Graphic Image Display */}
              <div className="w-full flex justify-center bg-white rounded-2xl p-3 border border-[#E6ECF2] shadow-xs">
                <MouthIllustration useImage={true} className="w-full max-w-2xl" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-semibold pt-1">
                <div className="p-2.5 rounded-xl bg-white border border-[#E6ECF2] flex items-center gap-2 shadow-2xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                  <span className="text-[#172B4D]">Stomatitis Aftosa</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#E6ECF2] flex items-center gap-2 shadow-2xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F28C38]" />
                  <span className="text-[#172B4D]">Pabbura</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#E6ECF2] flex items-center gap-2 shadow-2xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2F80B7]" />
                  <span className="text-[#172B4D]">Sensor Aktif</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#E6ECF2] flex items-center gap-2 shadow-2xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22B573]" />
                  <span className="text-[#172B4D]">Pelembab Alami</span>
                </div>
              </div>
            </div>

          </div>

          {/* Perkembangan Pemulihan Section */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 overflow-hidden">
            <div className="bg-gradient-to-r from-[#102A43] via-[#1E3A5F] to-[#2F80B7] text-white p-5 -mx-6 -mt-6 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/20">
              <div>
                <h2 className="text-base font-extrabold text-white">Perkembangan Pemulihan</h2>
                <p className="text-xs text-slate-200">Tren perubahan pH mulut dan tingkat nyeri harian</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Time range selector */}
                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/20">
                  {(['7d', '14d', '30d'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        timeRange === range
                          ? 'bg-white text-[#102A43] shadow-xs'
                          : 'text-slate-200 hover:text-white'
                      }`}
                    >
                      {range === '7d' ? '7 Hari' : range === '14d' ? '14 Hari' : '30 Hari'}
                    </button>
                  ))}
                </div>

                {/* Chart mode toggle */}
                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/20">
                  <button
                    onClick={() => setChartMode('ph')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      chartMode === 'ph'
                        ? 'bg-[#F28C38] text-white shadow-xs'
                        : 'text-slate-200 hover:text-white'
                    }`}
                  >
                    Perubahan pH
                  </button>
                  <button
                    onClick={() => setChartMode('healing')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      chartMode === 'healing'
                        ? 'bg-[#F28C38] text-white shadow-xs'
                        : 'text-slate-200 hover:text-white'
                    }`}
                  >
                    Waktu &amp; Nyeri
                  </button>
                </div>
              </div>
            </div>

            {/* Recharts Container */}
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                {chartMode === 'ph' ? (
                  <AreaChart
                    data={
                      timeRange === '7d'
                        ? phTrendData7d
                        : timeRange === '14d'
                        ? phTrendData14d
                        : phTrendData30d
                    }
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="phColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F28C38" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#F28C38" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[4, 9]} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#102A43', color: '#fff', borderRadius: 12, border: 'none', fontSize: 12 }}
                      formatter={(val: any) => [`${val} pH`, 'Keasaman']}
                    />
                    <Area type="monotone" dataKey="ph" stroke="#F28C38" strokeWidth={3} fillOpacity={1} fill="url(#phColor)" />
                  </AreaChart>
                ) : (
                  <BarChart data={healingBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#102A43', color: '#fff', borderRadius: 12, border: 'none', fontSize: 12 }}
                    />
                    <Bar dataKey="days" name="Tingkat Nyeri/Hari" fill="#F28C38" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="target" name="Target Turate" fill="#2F80B7" radius={[6, 6, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Data Bio-Medis & Lingkungan Mulut Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 overflow-hidden">
            <div className="bg-gradient-to-r from-[#102A43] via-[#1E3A5F] to-[#2F80B7] text-white p-4 -mx-6 -mt-6 mb-3 border-b border-slate-200/20">
              <h2 className="text-base font-extrabold text-white">Data Bio-Medis &amp; Lingkungan Mulut</h2>
              <p className="text-xs text-slate-200">Parameter fisik-kimia rongga mulut</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#EEF7FC] border border-blue-100 flex flex-col justify-between space-y-2">
                <div className="w-9 h-9 rounded-xl bg-white text-[#2F80B7] flex items-center justify-center shadow-xs">
                  <Droplets size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500">pH Mulut</p>
                  <p className="text-xl font-extrabold text-[#102A43] mt-0.5">{ph}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF1E6] border border-orange-100 flex flex-col justify-between space-y-2">
                <div className="w-9 h-9 rounded-xl bg-white text-[#F28C38] flex items-center justify-center shadow-xs">
                  <Activity size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500">Tingkat Nyeri (VAS)</p>
                  <p className="text-xl font-extrabold text-[#102A43] mt-0.5">{vas}/10</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#EAF7EE] border border-green-100 flex flex-col justify-between space-y-2">
                <div className="w-9 h-9 rounded-xl bg-white text-[#22C55E] flex items-center justify-center shadow-xs">
                  <Leaf size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500">Asupan Flavonoid</p>
                  <p className="text-xl font-extrabold text-[#102A43] mt-0.5">
                    {flavonoid} <span className="text-xs font-normal text-slate-500">mg</span>
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FEF3C7]/60 border border-amber-200 flex flex-col justify-between space-y-2">
                <div className="w-9 h-9 rounded-xl bg-white text-[#D97706] flex items-center justify-center shadow-xs">
                  <Thermometer size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500">Suhu Mulut</p>
                  <p className="text-xl font-extrabold text-[#102A43] mt-0.5">
                    {temp} <span className="text-xs font-normal text-slate-500">°C</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Kontrol Dosis Lozenges Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5 overflow-hidden">
            <div className="bg-gradient-to-r from-[#102A43] via-[#1E3A5F] to-[#2F80B7] text-white p-4 -mx-6 -mt-6 mb-4 flex items-center justify-between border-b border-slate-200/20">
              <div>
                <h2 className="text-base font-extrabold text-white">Kontrol Aplikasi Lozenges</h2>
                <p className="text-xs text-slate-200">Terapi Turate Denti</p>
              </div>
              <button
                onClick={() => setDoseActive(!doseActive)}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                  doseActive ? 'bg-[#F28C38]' : 'bg-slate-500/50'
                }`}
                aria-label="Toggle Kontrol Dosis"
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    doseActive ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Countdown Widget */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-[#FFF1E6] to-[#FFFFFF] border border-orange-100 text-center space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Time until next lozenge dose
              </p>
              <div className="w-32 h-32 rounded-full border-4 border-[#F28C38] flex flex-col items-center justify-center shadow-inner bg-white">
                <span className="text-2xl font-black text-[#102A43] tracking-tight">
                  {formatCountdown(secondsLeft)}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">09:30 WIB</span>
              </div>
            </div>

            {/* Dose Count & Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Dosis per hari: <strong className="text-[#2F80B7]">3x</strong></span>
                <span>Dosis hari ini: <strong className="text-[#F28C38]">2 / 3</strong></span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#F28C38] rounded-full w-2/3 transition-all duration-500" />
              </div>
            </div>

            <Link
              href="/dosis"
              className="w-full py-3.5 rounded-2xl bg-[#F28C38] hover:bg-[#E57B27] text-white font-bold text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>Kontrol Dosis Now</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-[#102A43]">Aksi Cepat &amp; Rekomendasi</h2>
            <div className="space-y-3">
              <Link
                href="/monitoring"
                className="p-3.5 rounded-2xl bg-[#EEF7FC] hover:bg-[#E0F2FE] border border-blue-100 flex items-center justify-between text-slate-800 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#2F80B7] flex items-center justify-center font-bold">
                    <Activity size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#102A43]">Catat VAS Nyeri Baru</p>
                    <p className="text-[11px] text-slate-500">Input tingkat nyeri &amp; ukuran ulser</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-[#2F80B7] group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/rekomendasi"
                className="p-3.5 rounded-2xl bg-[#EAF7EE] hover:bg-[#DCFCE7] border border-green-100 flex items-center justify-between text-slate-800 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#22C55E] flex items-center justify-center font-bold">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#102A43]">Rekomendasi Perawatan</p>
                    <p className="text-[11px] text-slate-500">Triase digital &amp; panduan</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-[#22C55E] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Latest Notifications Preview */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-[#102A43]">Notifikasi Terbaru</h2>
              <Link href="/notifikasi" className="text-xs font-bold text-[#F28C38] hover:underline">
                Lihat Semua
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#FFF1E6] text-[#F28C38] flex items-center justify-center shrink-0 mt-0.5">
                  <Bell size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#102A43]">Reminder Lozenges Turate</p>
                  <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                    Reminder minum lozenge Turate sesuai jadwal dosis Anda.
                  </p>
                  <span className="text-[10px] text-slate-400 font-semibold mt-1 inline-block">
                    08:30 AM
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#EEF7FC] text-[#2F80B7] flex items-center justify-center shrink-0 mt-0.5">
                  <Leaf size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#102A43]">Edukasi Gizi</p>
                  <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                    Rekomendasi nutrisi dan lozenge flavonoid untuk kesehatan mulut.
                  </p>
                  <span className="text-[10px] text-slate-400 font-semibold mt-1 inline-block">
                    08:30 AM
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
