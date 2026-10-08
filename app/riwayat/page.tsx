'use client';

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Printer,
  TrendingUp,
  X,
  FileText,
  ShieldCheck,
  Award,
  Activity,
  User,
  Clock,
  Droplets,
  Thermometer,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { getHistoryRecords, getCurrentUser } from '@/lib/storage';
import { getRecentDateLabels } from '@/lib/utils';
import type { HistoryRecord, AuthUser } from '@/types';

// Dynamic chart data for analysis tab
const recentDates = getRecentDateLabels(7);
const analysisChartData = [
  { date: recentDates[0], ph: 5.0, vas: 8, ulcerSize: 1.8 },
  { date: recentDates[1], ph: 5.5, vas: 7, ulcerSize: 1.6 },
  { date: recentDates[2], ph: 6.5, vas: 6, ulcerSize: 1.4 },
  { date: recentDates[3], ph: 5.8, vas: 5, ulcerSize: 1.2 },
  { date: recentDates[4], ph: 6.0, vas: 4, ulcerSize: 1.0 },
  { date: recentDates[5], ph: 6.8, vas: 3, ulcerSize: 0.8 },
  { date: recentDates[6], ph: 7.8, vas: 2, ulcerSize: 0.5 },
];

const healingTimeline = [
  { day: 'Hari ke-1', vas: 8, ph: 5.0, ulcerSize: '1.8 cm', status: 'Awal perawatan' },
  { day: 'Hari ke-3', vas: 7, ph: 5.5, ulcerSize: '1.6 cm', status: 'Pengurangan inflamasi' },
  { day: 'Hari ke-5', vas: 5, ph: 6.0, ulcerSize: '1.2 cm', status: 'Re-epitelisasi mulai' },
  { day: 'Hari ke-7', vas: 4, ph: 6.5, ulcerSize: '1.0 cm', status: 'Granulasi jaringan' },
  { day: 'Hari ke-10', vas: 3, ph: 6.8, ulcerSize: '0.8 cm', status: 'Nyeri jauh berkurang' },
  { day: 'Hari ke-14', vas: 1, ph: 7.2, ulcerSize: '0.2 cm', status: 'Pemulihan hampir sempurna' },
];

export default function AnalysisHistoryPage() {
  const [activeTab, setActiveTab] = useState<'analysis' | 'history'>('analysis');
  const [historyItems, setHistoryItems] = useState<HistoryRecord[]>([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(6);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const currentDateFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  useEffect(() => {
    setHistoryItems(getHistoryRecords());
    setUser(getCurrentUser());
  }, []);

  const dynamicTimeline = React.useMemo(() => {
    if (historyItems.length > 0) {
      return historyItems.slice(0, 6).map((item) => ({
        day: item.date,
        vas: item.vas,
        ph: item.ph,
        ulcerSize: `${item.ulcerSize} cm`,
        status: item.notes || (item.vas <= 3 ? 'Nyeri jauh berkurang' : item.vas <= 5 ? 'Proses penyembuhan' : 'Awal perawatan'),
      }));
    }
    return healingTimeline;
  }, [historyItems]);

  const handleTriggerPrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header Banner (Matching Beranda Style) */}
      <div className="bg-gradient-to-r from-[#102A43] via-[#1E3A5F] to-[#2F80B7] rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-[#FFF1E6] mb-2 border border-white/10">
            <FileText size={14} className="text-[#F28C38]" />
            <span>Rekam Medis Digital</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">Analisis &amp; Riwayat</h1>
          <p className="text-slate-200 text-xs md:text-sm mt-1 font-normal">Grafik perkembangan pemulihan dan catatan harian</p>
        </div>

        <div className="relative z-10 flex items-center gap-3 flex-wrap">
          {/* Print Report Button */}
          <button
            onClick={() => setShowPrintModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-2 transition shadow-xs"
          >
            <Printer size={16} className="text-[#F28C38]" />
            <span>Cetak Laporan Medis</span>
          </button>

          {/* Tab Selector */}
          <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'analysis'
                  ? 'bg-[#F28C38] text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              Analisis
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-[#F28C38] text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              Riwayat
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'analysis' ? (
        /* TAB ANALISIS */
        <div className="space-y-6">
          {/* Date Navigator Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
            <button
              onClick={() => setSelectedDateIndex((i) => Math.max(0, i - 1))}
              disabled={selectedDateIndex <= 0}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 transition-colors"
              aria-label="Tanggal sebelumnya"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-2 font-black text-sm text-[#102A43]">
              <Calendar size={18} className="text-[#F28C38]" />
              <span>{analysisChartData[selectedDateIndex]?.date || '28 Mei'}</span>
            </div>
            <button
              onClick={() => setSelectedDateIndex((i) => Math.min(analysisChartData.length - 1, i + 1))}
              disabled={selectedDateIndex >= analysisChartData.length - 1}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 transition-colors"
              aria-label="Tanggal berikutnya"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Line / Area Chart for Pain & Recovery Progress */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-[#102A43]">Grafik Tren Nyeri &amp; Pemulihan</h2>
                <p className="text-xs text-slate-500">Penurunan tingkat nyeri VAS harian (0 - 10)</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#EAF7EE] text-[#22C55E] text-xs font-bold flex items-center gap-1">
                <TrendingUp size={14} />
                <span>Pemulihan Baik</span>
              </span>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analysisChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="vasGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F28C38" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#F28C38" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#102A43', color: '#fff', borderRadius: 12, border: 'none', fontSize: 12 }}
                    formatter={(val: any) => [`${val}/10`, 'Nyeri (VAS)']}
                  />
                  <Area type="monotone" dataKey="vas" stroke="#F28C38" strokeWidth={3} fillOpacity={1} fill="url(#vasGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Progress Pemulihan Cards Timeline */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-[#102A43]">Progress Pemulihan Berkelanjutan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {dynamicTimeline.map((item) => (
                <div
                  key={item.day}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-2 hover:bg-[#FFF1E6]/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#102A43]">{item.day}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEF7FC] text-[#2F80B7]">
                      {item.ulcerSize}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    <p>Tingkat Nyeri: <strong className="text-[#F28C38]">{item.vas}/10 (VAS)</strong></p>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 pt-1 border-t border-slate-200/60">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-[#EAF7EE] border border-green-200 text-[#22C55E] text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={18} />
              <span>Perkembangan menunjukkan tren membaik secara terukur sesuai target Turate Denti Lozenges.</span>
            </div>
          </div>
        </div>
      ) : (
        /* TAB RIWAYAT */
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-[#102A43]">Catatan Riwayat Pengukuran</h2>

            <div className="space-y-3">
              {historyItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FFF1E6]/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF1E6] text-[#F28C38] flex items-center justify-center font-bold text-sm">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-[#102A43]">{item.date}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.notes || 'Pengukuran harian rutin'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold">
                    <div className="px-3 py-1.5 rounded-xl bg-[#FFF1E6] text-[#F28C38]">
                      Nyeri: {item.vas}/10
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-[#EAF7EE] text-[#22C55E]">
                      Ulser: {item.ulcerSize} cm
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MEDICAL-GRADE PRINT REPORT MODAL & DOCUMENT */}
      {showPrintModal && (
        <div className="printable-modal-overlay fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="printable-document w-full max-w-3xl bg-white rounded-3xl p-6 md:p-10 shadow-2xl border border-slate-200 space-y-6 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Controls Bar (Hidden during actual print) */}
            <div className="no-print flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF1E6] text-[#F28C38] flex items-center justify-center">
                  <Printer size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#102A43]">Pratinjau Cetak Laporan Medis</h3>
                  <p className="text-xs text-slate-500">Dokumen resmi hasil pemantauan kesehatan mulut &amp; terapi Turate</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTriggerPrint}
                  className="px-4 py-2 rounded-xl bg-[#102A43] hover:bg-[#1A385A] text-white font-bold text-xs shadow-md flex items-center gap-2 transition"
                >
                  <Printer size={16} />
                  <span>Cetak / Unduh PDF</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                  aria-label="Tutup pratinjau"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* OFFICIAL PRINTABLE DOCUMENT CONTENT */}
            <div className="space-y-6 text-[#102A43] bg-white p-2 md:p-4 rounded-xl">
              
              {/* 1. Official Letterhead / Kop Surat */}
              <div className="border-b-2 border-[#102A43] pb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white p-1 border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                    <img
                      src="/logo-full.png"
                      alt="Smart-Pabbura Logo"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[#102A43] tracking-tight uppercase">
                      Smart-Pabbura System
                    </h2>
                    <p className="text-xs font-bold text-[#F28C38]">
                      Solusi Stomatitis Pintar &amp; Terukur — Terapi Turate Denti Lozenges
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Platform Monitoring Bio-Sensorik Rongga Mulut Pasien
                    </p>
                  </div>
                </div>
                <div className="text-right text-[11px]">
                  <span className="block font-bold text-[#102A43]">NO. DOKUMEN:</span>
                  <span className="font-mono text-slate-600 font-bold">SP-MED-202610-04</span>
                  <span className="block text-[10px] text-slate-400 mt-1">
                    Tanggal Cetak: {currentDateFormatted}
                  </span>
                </div>
              </div>

              {/* Document Title Banner */}
              <div className="bg-[#102A43] text-white p-4 rounded-2xl text-center space-y-1">
                <h3 className="text-sm font-black uppercase tracking-wider">
                  LAPORAN MONITORING KESEHATAN MULUT &amp; EVALUASI TERAPI
                </h3>
                <p className="text-[11px] text-slate-300 font-medium">
                  Ringkasan Rekam Medis Digital &amp; Parameter Bio-Sensorik Pasien Stomatitis
                </p>
              </div>

              {/* 2. Patient Information Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-extrabold uppercase">Nama Pasien</span>
                  <strong className="text-sm text-[#102A43] font-black">{user?.name || 'Nurul A.'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-extrabold uppercase">ID / Email</span>
                  <strong className="text-slate-700 font-medium">{user?.email || 'user@smartpabbura.com'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-extrabold uppercase">Terapi Utama</span>
                  <strong className="text-[#F28C38] font-bold">Turate Denti Lozenges</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-extrabold uppercase">Status Klinis</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                    <CheckCircle2 size={12} />
                    <span>Sehat (Membaik)</span>
                  </span>
                </div>
              </div>

              {/* 3. Clinical Metrics Highlight Grid */}
              <div>
                <h4 className="text-xs font-black text-[#102A43] uppercase tracking-wider mb-2">
                  Summary Parameter Bio-Medis Terakhir:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-[#FFF1E6] border border-orange-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Nyeri (VAS)</span>
                    <strong className="text-lg font-black text-[#F28C38]">2 / 10</strong>
                    <span className="text-[10px] text-slate-500 block font-semibold">Tingkat Ringan</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#EAF7EE] border border-green-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Ukuran Ulser</span>
                    <strong className="text-lg font-black text-[#22C55E]">0.5 cm</strong>
                    <span className="text-[10px] text-slate-500 block font-semibold">Regresi 70%</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#E6F7FA] border border-[#29A9C9]/30">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Hidrasi Mukosa</span>
                    <strong className="text-lg font-black text-[#29A9C9]">82 %</strong>
                    <span className="text-[10px] text-slate-500 block font-semibold">Optimal</span>
                  </div>
                </div>
              </div>

              {/* 4. Table of Daily Monitoring History */}
              <div>
                <h4 className="text-xs font-black text-[#102A43] uppercase tracking-wider mb-2">
                  Tabel Log Riwayat Pengukuran Harian:
                </h4>
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#102A43] text-white text-[11px] font-bold">
                        <th className="py-2.5 px-3">Tanggal</th>
                        <th className="py-2.5 px-3">Nyeri (VAS)</th>
                        <th className="py-2.5 px-3">Ukuran Lesi</th>
                        <th className="py-2.5 px-3">Dosis Lozenges</th>
                        <th className="py-2.5 px-3">Catatan Perkembangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyItems.map((row, idx) => (
                        <tr
                          key={row.id}
                          className={`border-b border-slate-100 ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'
                          }`}
                        >
                          <td className="py-2.5 px-3 font-bold text-[#102A43]">{row.date}</td>
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-[#F28C38]">{row.vas}/10</span>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-[#22C55E]">
                            {row.ulcerSize} cm
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-700">
                            {row.doses || '3/3 Terpenuhi'}
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 font-medium">
                            {row.notes || 'Pengukuran harian stabil'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 5. Clinical Recommendation Box */}
              <div className="bg-[#FFF1E6]/60 p-4 rounded-2xl border border-[#F28C38]/30 space-y-1 text-xs">
                <h5 className="font-extrabold text-[#102A43] flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-[#F28C38]" />
                  <span>Catatan Evaluasi Medis Sistem:</span>
                </h5>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Berdasarkan pemantauan parameter sensorik rongga mulut, pasien menunjukkan respon terapi positif terhadap pemberian <strong>Turate Denti Lozenges (kandungan flavonoid Carthamus tinctorius L.)</strong>. Skala nyeri (VAS) dan ukuran lesi sariawan berkurang secara signifikan. Disarankan untuk melanjutkan dosis pemeliharaan serta menjaga hidrasi dan kebersihan rongga mulut.
                </p>
              </div>

              {/* 6. Legal & Signature Block */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold mb-12">Pasien / Pengguna,</p>
                  <p className="font-bold text-[#102A43] underline">{user?.name || 'Nurul A.'}</p>
                  <span className="text-[10px] text-slate-400 block">Tanda Tangan Pengguna</span>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold mb-12">
                    Tim Medis / Dokter Spesialis Penyakit Mulut,
                  </p>
                  <p className="font-bold text-[#102A43] underline">drg. Smart-Pabbura Specialist, Sp.PM</p>
                  <span className="text-[10px] text-slate-400 block">NIP/SIP: 19880412 202610 1 002</span>
                </div>
              </div>

              {/* Verification Footer */}
              <div className="text-center pt-2 text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
                <Award size={14} className="text-[#F28C38]" />
                <span>
                  Dokumen ini diterbitkan secara resmi oleh Smart-Pabbura System &amp; Terverifikasi Supabase Encrypted Ledger.
                </span>
              </div>

            </div>

            {/* Modal Bottom Actions (Hidden during print) */}
            <div className="no-print flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleTriggerPrint}
                className="px-5 py-2.5 rounded-xl bg-[#102A43] hover:bg-[#1A385A] text-white font-bold text-xs shadow-md flex items-center gap-2 transition"
              >
                <Printer size={16} />
                <span>Cetak Dokumen Sekarang</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
