'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Info,
  Pill,
  Plus,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';
import { getTodayDoseRecord, incrementTodayDose } from '@/lib/storage';
import { formatCountdown } from '@/lib/utils';
import type { DoseRecord } from '@/types';

export default function DoseControlPage() {
  const [doseActive, setDoseActive] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(1 * 3600 + 20 * 60 + 35);
  const [doseInfo, setDoseInfo] = useState<DoseRecord | null>(null);
  const [justRecorded, setJustRecorded] = useState(false);

  useEffect(() => {
    setDoseInfo(getTodayDoseRecord());
  }, []);

  // Countdown interval
  useEffect(() => {
    if (!doseActive) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => (s <= 0 ? 8 * 3600 : s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [doseActive]);

  const handleRecordDose = () => {
    const updated = incrementTodayDose();
    setDoseInfo(updated);
    setJustRecorded(true);
    setSecondsLeft(8 * 3600); // Reset countdown for next dose
    setTimeout(() => setJustRecorded(false), 2500);
  };

  const completed = doseInfo?.dosesCompleted ?? 2;
  const total = doseInfo?.dosesTotal ?? 3;

  const scheduleTimes = [
    { time: '08:00 WIB', label: 'Dosis Pagi', taken: completed >= 1 },
    { time: '14:00 WIB', label: 'Dosis Siang', taken: completed >= 2 },
    { time: '20:00 WIB', label: 'Dosis Malam', taken: completed >= 3 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
      {/* Header Card (Matching Beranda Style) */}
      <div className="bg-gradient-to-r from-[#102A43] via-[#1E3A5F] to-[#2F80B7] rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-[#FFF1E6] mb-2 border border-white/10">
            <Pill size={14} className="text-[#F28C38]" />
            <span>Turate Denti Lozenges</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">Kontrol Aplikasi Lozenges</h1>
          <p className="text-slate-200 text-xs md:text-sm mt-1 font-normal">Atur jadwal konsumsi lozenge secara disiplin</p>
        </div>

        {/* ON / OFF Toggle */}
        <div className="relative z-10 flex items-center gap-3 bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/15">
          <span className="text-xs font-bold text-slate-200">Status</span>
          <button
            onClick={() => setDoseActive(!doseActive)}
            className={`w-13 h-7 rounded-full transition-colors relative p-1 ${
              doseActive ? 'bg-[#F28C38]' : 'bg-slate-500/50'
            }`}
            aria-label="Toggle Kontrol Dosis"
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                doseActive ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-xs font-bold ${doseActive ? 'text-[#F28C38]' : 'text-slate-300'}`}>
            {doseActive ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>

      {justRecorded && (
        <div className="p-4 rounded-2xl bg-[#EAF7EE] border border-green-200 text-[#22C55E] text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={18} />
          <span>Dosis hari ini berhasil dicatat! Timer countdown diperbarui.</span>
        </div>
      )}

      {/* Main Countdown Timer Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Time until next lozenge dose
        </p>

        {/* Circular Big Timer Display */}
        <div className="relative w-52 h-52 rounded-full border-8 border-[#FFF1E6] flex flex-col items-center justify-center shadow-lg bg-gradient-to-b from-white to-[#FFF1E6]/40 p-4">
          <div className="absolute inset-2 rounded-full border-4 border-[#F28C38] border-t-transparent animate-spin-slow opacity-80" />
          <span className="text-xs font-bold text-[#F28C38] uppercase tracking-wider mb-1">
            Time
          </span>
          <span className="text-3xl font-black text-[#102A43] tracking-tight">
            {formatCountdown(secondsLeft)}
          </span>
          <span className="text-xs font-semibold text-slate-500 mt-1">09:30 WIB</span>
        </div>

        {/* Progress & Dose Counts */}
        <div className="w-full max-w-md space-y-3">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-600">Dosis per hari: <strong className="text-[#2F80B7]">3x</strong></span>
            <span className="text-slate-600">Dosis hari ini: <strong className="text-[#F28C38]">{completed} / {total}</strong></span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#F28C38] rounded-full transition-all duration-500"
              style={{ width: `${(completed / total) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Action Button */}
        <button
          onClick={handleRecordDose}
          disabled={completed >= total}
          className={`w-full max-w-md py-4 rounded-2xl font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
            completed >= total
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-[#F28C38] hover:bg-[#E57B27] text-white shadow-orange-500/30 hover:scale-105 active:scale-95'
          }`}
        >
          <Zap size={18} />
          <span>{completed >= total ? 'Dosis Hari Ini Lengkap' : 'Kontrol (Catat Dosis Sekarang)'}</span>
        </button>
      </div>

      {/* Jadwal Konsumsi Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <h2 className="text-base font-extrabold text-[#102A43] flex items-center gap-2">
          <Clock size={18} className="text-[#2F80B7]" />
          <span>Jadwal Konsumsi Harian</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {scheduleTimes.map(({ time, label, taken }, index) => (
            <div
              key={time}
              className={`p-4 rounded-2xl border flex flex-col justify-between space-y-2 transition-all ${
                taken
                  ? 'bg-[#EAF7EE] border-green-200 text-slate-800'
                  : index === completed
                  ? 'bg-[#FFF1E6] border-orange-200 text-[#102A43] ring-2 ring-[#F28C38]'
                  : 'bg-slate-50 border-slate-100 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">{label}</span>
                {taken ? (
                  <CheckCircle2 size={18} className="text-[#22C55E]" />
                ) : (
                  <Clock size={16} className="text-slate-400" />
                )}
              </div>
              <p className="text-lg font-black">{time}</p>
              <span className="text-[10px] font-semibold">
                {taken ? '✓ Sudah diminum' : index === completed ? '⏳ Dosis berikutnya' : 'Belum waktunya'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CATATAN PENTING Banner */}
      <div className="bg-[#EEF7FC] rounded-3xl p-5 border border-blue-100 flex items-start gap-3 text-xs leading-relaxed text-[#102A43]">
        <Info size={20} className="text-[#2F80B7] shrink-0 mt-0.5" />
        <div>
          <h4 className="font-extrabold text-[#102A43] mb-1">CATATAN PENTING MEDICAL DISCLAIMER:</h4>
          <p className="text-slate-600">
            Sistem ini adalah prototype/alat pemantauan mandiri, bukan pengganti dokter atau konsultasi medis profesional. Informasi dan rekomendasi yang diberikan adalah <strong>"Rekomendasi sistem"</strong>, bukan perintah medis.
          </p>
        </div>
      </div>
    </div>
  );
}
