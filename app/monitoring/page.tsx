'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  CheckCircle2,
  Droplets,
  Gauge,
  HeartPulse,
  Save,
  SmilePlus,
  Sparkles,
  Thermometer,
} from 'lucide-react';
import SemiGauge from '@/components/ui/SemiGauge';
import ProgressRing from '@/components/ui/ProgressRing';
import MouthIllustration from '@/components/ui/MouthIllustration';
import { getHealthData, saveHealthData, saveHistoryRecord, savePainRecord, saveUlcerRecord } from '@/lib/storage';
import { formatDateShort } from '@/lib/utils';
import type { HealthMetrics } from '@/types';

export default function MonitoringPage() {
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [vas, setVas] = useState(3);
  const [ph, setPh] = useState(6.8);
  const [ulcerSize, setUlcerSize] = useState(0.8);
  const [hydration, setHydration] = useState(82);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const current = getHealthData();
    setMetrics(current);
    setVas(current.vas ?? 3);
    setPh(current.ph ?? 6.8);
    setHydration(current.hydration ?? 82);
  }, []);

  const conditionStatus = useMemo(() => {
    if (vas <= 3 && ulcerSize <= 0.8) return { label: 'Sehat', color: 'green', bg: '#EAF7EE', text: '#22C55E' };
    if (vas <= 6 && ulcerSize <= 1.5) return { label: 'Perlu Perhatian', color: 'yellow', bg: '#FEF3C7', text: '#D97706' };
    return { label: 'Perlu Konsultasi', color: 'red', bg: '#FDECEC', text: '#EF4444' };
  }, [vas, ulcerSize]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date();
    const note = `Monitoring VAS: ${vas}/10 | pH: ${ph} | Ukuran ulser: ${ulcerSize} cm`;

    saveHealthData({
      vas,
      ph,
      hydration,
      cleanliness: metrics?.cleanliness ?? 68,
      flavonoidIntake: metrics?.flavonoidIntake ?? 15,
      oralTemperature: metrics?.oralTemperature ?? 36.9,
      date: today.toISOString(),
    });

    savePainRecord({
      date: today.toISOString(),
      vas,
      ulcerSize,
      condition: vas <= 3 ? 'Lebih baik' : vas <= 6 ? 'Sama' : 'Lebih buruk',
      notes: note,
    });

    saveUlcerRecord({
      date: today.toISOString(),
      size: ulcerSize,
      notes: 'Mukosa pipi kiri',
    });


    saveHistoryRecord({
      date: formatDateShort(today),
      vas,
      ulcerSize,
      ph,
      doses: '2/3',
      notes: note,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header Banner (Matching Beranda Style) */}
      <div className="bg-gradient-to-r from-[#102A43] via-[#1E3A5F] to-[#2F80B7] rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-[#FFF1E6] mb-2 border border-white/10">
            <Sparkles size={14} className="text-[#F28C38]" />
            <span>Pengukuran Harian</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">Monitoring Real-Time</h1>
          <p className="text-slate-200 text-xs md:text-sm mt-1 font-normal">Solusi Stomatitis Pintar &amp; Terukur</p>
        </div>
        <div className="relative z-10 flex items-center gap-2">
          <span className="px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-sm border border-white/20" style={{ backgroundColor: conditionStatus.bg, color: conditionStatus.text }}>
            <CheckCircle2 size={16} />
            <span>Kondisi: {conditionStatus.label}</span>
          </span>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-[#EAF7EE] border border-green-200 text-[#22C55E] text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={18} />
          <span>Pengukuran berhasil disimpan ke dalam state aplikasi dan riwayat!</span>
        </div>
      )}

      {/* Main Monitoring Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* A. Tingkat Nyeri VAS Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#FFF1E6] text-[#F28C38] flex items-center justify-center font-bold">
                <Activity size={18} />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[#102A43]">A. Tingkat Nyeri (VAS)</h2>
                <p className="text-xs text-slate-400">Visual Analog Scale 0 - 10</p>
              </div>
            </div>
            <span className="text-lg font-black text-[#F28C38] bg-[#FFF1E6] px-3 py-1 rounded-xl">
              {vas} / 10
            </span>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Tidak Nyeri (0)</span>
                <span>Nyeri Sedang (5)</span>
                <span>Sangat Nyeri (10)</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={vas}
                onChange={(e) => setVas(Number(e.target.value))}
                className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#F28C38]"
              />
            </div>

            {/* Visual Pain Scale Feedback */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600">Kategori Nyeri:</span>
              <span className={`font-bold ${vas <= 3 ? 'text-green-600' : vas <= 6 ? 'text-amber-600' : 'text-red-600'}`}>
                {vas === 0 ? 'Tidak Ada Nyeri' : vas <= 3 ? 'Nyeri Ringan' : vas <= 6 ? 'Nyeri Sedang' : 'Nyeri Berat'}
              </span>
            </div>
          </div>
        </div>

        {/* B. Kondisi Mulut & Ulcer Size Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#EEF7FC] text-[#2F80B7] flex items-center justify-center font-bold">
                <Gauge size={18} />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[#102A43]">B. Kondisi Mulut &amp; Ulser</h2>
                <p className="text-xs text-slate-400">Estimasi ukuran luka sariawan</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-xl bg-slate-100 text-[#102A43] font-bold text-xs">
              {ulcerSize.toFixed(1)} cm
            </span>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>0.0 cm</span>
                <span>1.5 cm</span>
                <span>3.0 cm</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={ulcerSize}
                onChange={(e) => setUlcerSize(Number(e.target.value))}
                className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#2F80B7]"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-[#EAF7EE] border border-green-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Perubahan dibanding kemarin:</span>
              <span className="font-bold text-[#22C55E] flex items-center gap-1">
                <ArrowDownRight size={16} />
                <span>↓ 20% dari kemarin</span>
              </span>
            </div>
          </div>
        </div>

        {/* C. Keasaman (pH) Mulut Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#EEF7FC] text-[#2F80B7] flex items-center justify-center font-bold">
                <Droplets size={18} />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[#102A43]">C. Keasaman (pH) Mulut</h2>
                <p className="text-xs text-slate-400">Keseimbangan asam-basa rongga mulut</p>
              </div>
            </div>
            <span className="text-lg font-black text-[#2F80B7] bg-[#EEF7FC] px-3 py-1 rounded-xl">
              {ph} / 14
            </span>
          </div>

          <div className="flex items-center justify-center py-2">
            <SemiGauge value={ph} max={14} label="Tingkat pH Saat Ini" color="#2F80B7" size={130} />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Asam (&lt; 6.5)</span>
              <span>Optimal (6.5 - 7.2)</span>
              <span>Basa (&gt; 7.5)</span>
            </div>
            <input
              type="range"
              min="4.0"
              max="9.0"
              step="0.1"
              value={ph}
              onChange={(e) => setPh(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#2F80B7]"
            />
          </div>
        </div>

        {/* D. Hidrasi Mukosa Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#E6ECF2] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#E6F7FA] text-[#29A9C9] flex items-center justify-center font-bold">
                <SmilePlus size={18} />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[#102A43]">D. Hidrasi Mukosa</h2>
                <p className="text-xs text-[#66788A]">Kelembapan jaringan mulut</p>
              </div>
            </div>
            <span className="text-lg font-black text-[#29A9C9] bg-[#E6F7FA] px-3 py-1 rounded-xl">
              {hydration}%
            </span>
          </div>

          <div className="flex items-center justify-center py-2">
            <ProgressRing value={hydration} max={100} unit="%" color="#29A9C9" size={90} />
          </div>

          <div className="p-3 rounded-2xl bg-[#E6F7FA]/50 border border-[#29A9C9]/20 text-center text-xs text-[#102A43] font-semibold">
            Hidrasi mukosa terjaga baik (Optimal 80% - 90%)
          </div>
        </div>
      </div>

      {/* Mouth Diagram Visual Preview */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="w-full md:w-1/3 flex justify-center">
          <MouthIllustration size={160} showLabels={false} />
        </div>
        <div className="w-full md:w-2/3 space-y-2 text-center md:text-left">
          <h3 className="text-base font-extrabold text-[#102A43]">Simpan Pengukuran Harian</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Menyimpan data pengukuran harian akan memperbarui kurva tren perkembangan pH dan grafik penyembuhan sariawan Anda di menu Riwayat &amp; Analisis.
          </p>
          <button
            onClick={handleSave}
            className="w-full md:w-auto px-8 py-3.5 rounded-2xl bg-[#F28C38] hover:bg-[#E57B27] text-white font-extrabold text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 mt-3"
          >
            <Save size={18} />
            <span>Simpan Pengukuran</span>
          </button>
        </div>
      </div>
    </div>
  );
}
