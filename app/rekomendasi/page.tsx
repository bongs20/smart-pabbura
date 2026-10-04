'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Droplets,
  HeartPulse,
  Info,
  Pill,
  Salad,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserCheck,
} from 'lucide-react';

export default function CareRecommendationPage() {
  const [selectedSeverity, setSelectedSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [ulcerDurationDays, setUlcerDurationDays] = useState<number>(5);

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header Banner (Matching Beranda Style) */}
      <div className="bg-gradient-to-r from-[#102A43] via-[#1E3A5F] to-[#2F80B7] rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-[#FFF1E6] mb-2 border border-white/10">
            <ShieldCheck size={14} className="text-[#F28C38]" />
            <span>Sistem Triase Digital &amp; Rekomendasi Mandiri</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">Rekomendasi Perawatan</h1>
          <p className="text-slate-200 text-xs md:text-sm mt-1 font-normal">
            Panduan triase otomatis berdasarkan parameter rasa nyeri (VAS), durasi lesi, dan ukuran sariawan.
          </p>
        </div>

        {/* Duration Simulation Selector */}
        <div className="relative z-10 flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
          <span className="text-[11px] font-bold text-slate-200 pl-1">Durasi Lesi:</span>
          <button
            onClick={() => setUlcerDurationDays(5)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              ulcerDurationDays < 14
                ? 'bg-white text-[#F28C38] shadow-xs'
                : 'text-slate-200 hover:text-white'
            }`}
          >
            5 Hari
          </button>
          <button
            onClick={() => setUlcerDurationDays(14)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              ulcerDurationDays >= 14
                ? 'bg-[#EF4444] text-white shadow-xs'
                : 'text-slate-200 hover:text-white'
            }`}
          >
            14+ Hari (Peringatan)
          </button>
        </div>
      </div>

      {/* 14-Day Alert Warning Banner */}
      {ulcerDurationDays >= 14 && (
        <div className="p-6 rounded-3xl bg-[#FDECEC] border-2 border-red-300 text-[#EF4444] space-y-2 animate-fadeIn shadow-md">
          <div className="flex items-center gap-2.5 font-black text-base">
            <AlertTriangle size={24} className="shrink-0 animate-bounce" />
            <span>Peringatan Evaluasi Medis Profesional (Durasi ≥14 Hari)</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed pl-8">
            Luka sariawan yang menetap atau tidak menunjukkan tanda-tanda perbaikan <strong>lebih dari 14 hari berturut-turut</strong> membutuhkan evaluasi klinis langsung oleh <strong>Dokter Gigi atau Dokter Spesialis Penyakit Mulut</strong> untuk menyingkirkan risiko ulserasi kronis non-spesifik.
          </p>
        </div>
      )}

      {/* Severity Cards Selector */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-[#102A43]">Pilih Indikasi Gejala Mulut Anda Saat Ini:</h2>
          <p className="text-xs text-slate-500 mt-0.5">Pilih salah satu kondisi di bawah untuk melihat rincian rencana perawatan sistem.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 🟢 Kondisi Ringan */}
          <button
            onClick={() => setSelectedSeverity('mild')}
            className={`p-5 rounded-3xl border-2 text-left transition-all duration-300 relative flex flex-col justify-between space-y-4 ${
              selectedSeverity === 'mild'
                ? 'bg-[#EAF7EE] border-[#22C55E] shadow-md ring-2 ring-[#22C55E]/30 scale-[1.02]'
                : 'bg-white border-slate-100 hover:border-green-200 hover:bg-slate-50/80'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#22C55E] text-white flex items-center justify-center font-bold shadow-xs">
                  <CheckCircle2 size={20} />
                </div>
                {selectedSeverity === 'mild' && (
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#22C55E] text-white">
                    Terpilih
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-sm font-black text-[#102A43]">Kondisi Ringan</h3>
                <p className="text-[11px] text-slate-600 font-medium mt-1 leading-snug">
                  Nyeri ringan (VAS 1-3), ulser kecil (&lt;0.8 cm), durasi kurang dari 7 hari.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-green-200/60 flex items-center justify-between text-[11px] font-extrabold text-[#22C55E]">
              <span>Monitoring Mandiri</span>
              <ArrowRight size={14} />
            </div>
          </button>

          {/* 🟡 Perlu Perhatian */}
          <button
            onClick={() => setSelectedSeverity('moderate')}
            className={`p-5 rounded-3xl border-2 text-left transition-all duration-300 relative flex flex-col justify-between space-y-4 ${
              selectedSeverity === 'moderate'
                ? 'bg-[#FEF3C7]/70 border-[#D97706] shadow-md ring-2 ring-[#D97706]/30 scale-[1.02]'
                : 'bg-white border-slate-100 hover:border-amber-200 hover:bg-slate-50/80'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#D97706] text-white flex items-center justify-center font-bold shadow-xs">
                  <AlertCircle size={20} />
                </div>
                {selectedSeverity === 'moderate' && (
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#D97706] text-white">
                    Terpilih
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-sm font-black text-[#102A43]">Perlu Perhatian</h3>
                <p className="text-[11px] text-slate-600 font-medium mt-1 leading-snug">
                  Nyeri sedang (VAS 4-6), ulser sedang (0.8-1.5 cm), atau lesi ganda.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-amber-200 flex items-center justify-between text-[11px] font-extrabold text-[#D97706]">
              <span>Pemantauan Rutin</span>
              <ArrowRight size={14} />
            </div>
          </button>

          {/* 🔴 Perlu Konsultasi */}
          <button
            onClick={() => setSelectedSeverity('severe')}
            className={`p-5 rounded-3xl border-2 text-left transition-all duration-300 relative flex flex-col justify-between space-y-4 ${
              selectedSeverity === 'severe'
                ? 'bg-[#FDECEC] border-[#EF4444] shadow-md ring-2 ring-[#EF4444]/30 scale-[1.02]'
                : 'bg-white border-slate-100 hover:border-red-200 hover:bg-slate-50/80'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#EF4444] text-white flex items-center justify-center font-bold shadow-xs">
                  <Stethoscope size={20} />
                </div>
                {selectedSeverity === 'severe' && (
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#EF4444] text-white">
                    Terpilih
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-sm font-black text-[#102A43]">Perlu Konsultasi Medis</h3>
                <p className="text-[11px] text-slate-600 font-medium mt-1 leading-snug">
                  Nyeri tinggi (VAS &gt;6), ulser luas (&gt;1.5 cm), menetap ≥14 hari, atau demam.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-red-200 flex items-center justify-between text-[11px] font-extrabold text-[#EF4444]">
              <span>Rujukan Dokter Gigi</span>
              <ArrowRight size={14} />
            </div>
          </button>
        </div>

        {/* Dynamic Action Plan Section */}
        <div
          className={`p-6 rounded-3xl border transition-all space-y-5 ${
            selectedSeverity === 'mild'
              ? 'bg-[#EAF7EE]/60 border-green-200'
              : selectedSeverity === 'moderate'
              ? 'bg-[#FEF3C7]/40 border-amber-200'
              : 'bg-[#FDECEC]/60 border-red-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#102A43] flex items-center gap-2">
              <Stethoscope size={20} className={selectedSeverity === 'mild' ? 'text-[#22C55E]' : selectedSeverity === 'moderate' ? 'text-[#D97706]' : 'text-[#EF4444]'} />
              <span>Rencana Perawatan &amp; Indikasi Sistem:</span>
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                selectedSeverity === 'mild'
                  ? 'bg-[#22C55E] text-white'
                  : selectedSeverity === 'moderate'
                  ? 'bg-[#D97706] text-white'
                  : 'bg-[#EF4444] text-white'
              }`}
            >
              {selectedSeverity === 'mild' ? 'Triase 1: Monitoring Mandiri' : selectedSeverity === 'moderate' ? 'Triase 2: Intensifkan Dosis & Pemantauan' : 'Triase 3: Rujukan Medis Profesional'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Step 1: Dosis Lozenges */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-[#102A43]">
                <div className="w-7 h-7 rounded-xl bg-[#FFF1E6] text-[#F28C38] flex items-center justify-center">
                  <Pill size={16} />
                </div>
                <span>1. Terapi Turate Denti Lozenges</span>
              </div>
              <p className="text-slate-600 leading-relaxed pl-9">
                {selectedSeverity === 'mild'
                  ? 'Gunakan tablet hisap Turate Lozenges 3x sehari secara disiplin sesuai jadwal dosis harian.'
                  : selectedSeverity === 'moderate'
                  ? 'Pastikan konsumsi dosis 3x sehari tidak terlewat dan catat timer countdown secara rutin.'
                  : 'Gunakan Turate Lozenges sebagai pereda nyeri sementara sebelum berkonsultasi dengan dokter gigi.'}
              </p>
            </div>

            {/* Step 2: Diet Mukosa & Hidrasi */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-[#102A43]">
                <div className="w-7 h-7 rounded-xl bg-[#EAF7EE] text-[#22C55E] flex items-center justify-center">
                  <Salad size={16} />
                </div>
                <span>2. Diet Ramah Mukosa &amp; Hidrasi</span>
              </div>
              <p className="text-slate-600 leading-relaxed pl-9">
                Konsumsi makanan tekstur lembut (sup hangat, bubur halus) &amp; minum air minimal 2 Liter/hari. Hindari rasa pedas, asam, atau asin.
              </p>
            </div>

            {/* Step 3: Monitoring Mandiri */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-[#102A43]">
                <div className="w-7 h-7 rounded-xl bg-[#EEF7FC] text-[#2F80B7] flex items-center justify-center">
                  <Activity size={16} />
                </div>
                <span>3. Monitoring VAS &amp; Ukuran Ulser</span>
              </div>
              <p className="text-slate-600 leading-relaxed pl-9">
                Catat skala nyeri (VAS 0-10) dan perubahan diameter lesi sariawan setiap hari di menu Monitoring Real-Time.
              </p>
            </div>

            {/* Step 4: Rujukan Medis */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-[#102A43]">
                <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <UserCheck size={16} />
                </div>
                <span>4. Tindakan Lanjutan Medis</span>
              </div>
              <p className="text-slate-600 leading-relaxed pl-9">
                {selectedSeverity === 'severe' || ulcerDurationDays >= 14
                  ? 'Segera buat janji konsultasi dengan Dokter Gigi Spesialis Penyakit Mulut dan tunjukkan riwayat grafik VAS Anda.'
                  : 'Jika lesi memburuk atau nyeri VAS meningkat dalam 3 hari, tingkatkan triase ke rujukan medis.'}
              </p>
            </div>
          </div>
        </div>

        {/* Non-Diagnostic Disclaimer Note */}
        <div className="p-4 rounded-2xl bg-[#EEF7FC] border border-blue-100 flex items-start gap-3 text-xs text-slate-600">
          <Info size={18} className="text-[#2F80B7] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Sistem ini TIDAK memberikan diagnosis medis definitif. Seluruh informasi di atas disajikan sebagai <strong>"Indikasi untuk berkonsultasi"</strong> untuk mendukung pemantauan mandiri pengguna secara terukur.
          </p>
        </div>
      </div>
    </div>
  );
}
