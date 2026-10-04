'use client';

import React from 'react';
import Link from 'next/link';
import { Apple, ArrowLeft, Brain, Moon, Sparkles, Utensils } from 'lucide-react';

export default function LifestyleGuidePage() {
  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/edukasi" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F28C38] mb-2 hover:underline">
            <ArrowLeft size={14} />
            <span>Kembali ke Edukasi</span>
          </Link>
          <h1 className="text-2xl font-black text-[#102A43]">Panduan Gaya Hidup Sehat</h1>
          <p className="text-xs text-slate-500 mt-0.5">Dukungan holistik nutrisi, manajemen stres, dan kualitas tidur</p>
        </div>
      </div>

      {/* Hero Graphic Card featuring the uploaded lifestyle illustration */}
      <div className="bg-gradient-to-br from-[#FFF1E6] via-[#FFFFFF] to-[#EEF7FC] rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#F28C38] text-white flex items-center justify-center font-bold">
              <Sparkles size={16} />
            </div>
            <h2 className="text-base font-extrabold text-[#102A43]">Rekomendasi Pola Makan &amp; Diet Mukosa</h2>
          </div>
          <span className="text-[11px] font-bold text-[#F28C38] bg-white px-3 py-1 rounded-full border border-orange-200">
            Panduan Bergambar
          </span>
        </div>

        <div className="w-full flex justify-center bg-white/80 backdrop-blur-xs rounded-2xl p-3 border border-slate-100 shadow-2xs">
          <img
            src="/lifestyle-illustration.png"
            alt="Panduan Gaya Hidup Sehat & Rekomendasi Makan Sehat"
            className="w-full h-auto object-contain max-h-[380px] rounded-xl hover:scale-[1.01] transition-transform duration-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rekomendasi Makan Sehat */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF1E6] text-[#F28C38] flex items-center justify-center">
              <Utensils size={24} />
            </div>
            <h2 className="text-base font-extrabold text-[#102A43]">Rekomendasi Makan Sehat</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pola makan seimbang dengan cukup konsumsi air hangat, sup lembut, buah-buahan segar (seperti markisa/passion fruit), dan sayuran hijau ramah mukosa untuk imunitas optimal.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#FFF1E6] border border-orange-200/80 text-[#F28C38] text-[11px] font-bold flex items-center gap-2">
            <span>✓ Konsumsi Buah, Sup Warm &amp; Sayuran Segar</span>
          </div>
        </div>

        {/* Manajemen Stres */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Brain size={24} />
            </div>
            <h2 className="text-base font-extrabold text-[#102A43]">Manajemen Stres</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kelola tekanan stres emosional secara efektif dengan latihan pernapasan, relaksasi, serta aktivitas fisik ringan untuk mencegah lonjakan hormon kortisol.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200/80 text-purple-600 text-[11px] font-bold flex items-center gap-2">
            <span>✓ Relaksasi 15 menit setiap hari</span>
          </div>
        </div>

        {/* Sleep Tracking */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF7FC] text-[#2F80B7] flex items-center justify-center">
              <Moon size={24} />
            </div>
            <h2 className="text-base font-extrabold text-[#102A43]">Sleep Tracking</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tidur yang cukup (7-8 jam per hari) sangat esensial bagi proses pembelahan sel dan regenerasi epitelium jaringan mulut yang mengalami sariawan.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#EEF7FC] border border-blue-200/80 text-[#2F80B7] text-[11px] font-bold flex items-center gap-2">
            <span>✓ Durasi Tidur Rata-rata: 7.5 Jam</span>
          </div>
        </div>
      </div>
    </div>
  );
}
