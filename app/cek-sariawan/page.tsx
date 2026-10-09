'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Stethoscope,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Home,
  Pill,
  MapPin,
  Calendar,
  Layers,
  Thermometer,
  ShieldCheck,
} from 'lucide-react';
import { savePainRecord, saveHealthData } from '@/lib/storage';
import { useToast } from '@/components/ui/Toast';

export default function CekSariawanPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [step, setStep] = useState<number>(1);
  const [duration, setDuration] = useState<string>('');
  const [locations, setLocations] = useState<string[]>([]);
  const [count, setCount] = useState<string>('');
  const [painLevel, setPainLevel] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Toggle multi-select checkboxes for Location
  const toggleLocation = (loc: string) => {
    setLocations((prev) =>
      prev.includes(loc) ? prev.filter((item) => item !== loc) : [...prev, loc]
    );
  };

  // Toggle multi-select checkboxes for Symptoms
  const toggleSymptom = (sym: string) => {
    if (sym === 'Tidak ada gejala lain (hanya sariawan saja)') {
      setSymptoms(['Tidak ada gejala lain (hanya sariawan saja)']);
      return;
    }

    setSymptoms((prev) => {
      const filtered = prev.filter((item) => item !== 'Tidak ada gejala lain (hanya sariawan saja)');
      if (filtered.includes(sym)) {
        const next = filtered.filter((item) => item !== sym);
        return next.length === 0 ? ['Tidak ada gejala lain (hanya sariawan saja)'] : next;
      }
      return [...filtered, sym];
    });
  };

  // Check validity for current step
  const canProceed = () => {
    if (step === 1) return !!duration;
    if (step === 2) return locations.length > 0;
    if (step === 3) return !!count;
    if (step === 4) return !!painLevel;
    if (step === 5) return symptoms.length > 0;
    return false;
  };

  // Calculate Risk Assessment Result
  const calculateResult = () => {
    const isChronic = duration === '>14_hari';
    const hasSystemicSymptom =
      symptoms.includes('Badan demam atau sumeng') ||
      symptoms.includes('Ada benjolan nyeri di leher');

    const isHighPain = painLevel === '7-10';
    const isHighCount = count === '>3_titik';

    // 1. TINGGI (Perlu Rujukan)
    if (isChronic || hasSystemicSymptom) {
      return {
        riskLevel: 'Tinggi (Perlu Rujukan)',
        riskClass: 'bg-red-50 text-red-700 border-red-200',
        badgeClass: 'bg-red-500 text-white',
        icon: AlertTriangle,
        conditionName: 'Sariawan Kronis / Sistemik (>14 hari ATAU disertai demam/benjolan)',
        recommendation:
          '[PERINGATAN SIS-PABBURA] Sariawan sudah berlangsung lama/disertai gejala sistemik. Dosis mandiri dihentikan. Segera lakukan konsultasi ke dokter gigi/spesialis penyakit mulut.',
        vasNumeric: 8,
      };
    }

    // 2. SEDANG (Perlu Perhatian)
    if (isHighCount || isHighPain) {
      return {
        riskLevel: 'Sedang (Perlu Perhatian)',
        riskClass: 'bg-orange-50 text-orange-800 border-orange-200',
        badgeClass: 'bg-[#F28C38] text-white',
        icon: AlertCircle,
        conditionName: 'Sariawan Banyak / Nyeri Tinggi (>3 titik atau skala nyeri 7-10)',
        recommendation:
          'Gunakan Turate Denti Lozenges untuk meredakan nyeri. Istirahat cukup dan hindari makanan pedas/asam.',
        vasNumeric: isHighPain ? 8 : 5,
      };
    }

    // 3. RENDAH (Aman)
    return {
      riskLevel: 'Rendah (Aman)',
      riskClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      badgeClass: 'bg-emerald-600 text-white',
      icon: CheckCircle2,
      conditionName: 'Sariawan Ringan (1–3 titik, <7 hari, nyeri ringan-sedang)',
      recommendation:
        'Gunakan Turate Denti Lozenges 3-4 kali sehari secara teratur. Jaga kebersihan mulut dan cukupi air putih.',
      vasNumeric: painLevel === '4-6' ? 5 : 2,
    };
  };

  const handleFinish = () => {
    const result = calculateResult();

    // Save record to local storage
    savePainRecord({
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      vas: result.vasNumeric,
      ulcerSize: count === '>3_titik' ? 1.5 : count === '2-3_titik' ? 1.0 : 0.5,
      condition: result.riskLevel.startsWith('Rendah') ? 'Lebih baik' : 'Sama',
      notes: `Anamnesis Berkala: ${result.conditionName}. Lokasi: ${locations.join(', ')}`,
    });

    saveHealthData({
      vas: result.vasNumeric,
      date: new Date().toISOString().split('T')[0],
    });

    setIsCompleted(true);
    showToast('Pemeriksaan Sariawan Berhasil Disimpan', 'success');
  };

  const resetForm = () => {
    setStep(1);
    setDuration('');
    setLocations([]);
    setCount('');
    setPainLevel('');
    setSymptoms([]);
    setIsCompleted(false);
  };

  const result = calculateResult();
  const RiskIcon = result.icon;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#102A43] via-[#1E3A5F] to-[#2F80B7] rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-[#FFF1E6] border border-white/10">
            <Stethoscope size={14} className="text-[#F28C38]" />
            <span>Anamnesis Berkala Smart-Pabbura</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Cek Sariawan Baru</h1>
          <p className="text-slate-200 text-xs md:text-sm max-w-xl font-normal">
            Jawab 5 pertanyaan singkat untuk menentukan tingkat keparahan sariawan dan mendapatkan saran perawatan otomatis.
          </p>
        </div>
      </div>

      {!isCompleted ? (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
              <span>Pertanyaan {step} dari 5</span>
              <span>{Math.round((step / 5) * 100)}% Selesai</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#F28C38] to-[#2F80B7] transition-all duration-300 rounded-full"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* QUESTION 1 */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-[#102A43]">
                <Calendar className="text-[#F28C38]" size={20} />
                <h2 className="text-base md:text-lg font-black">1. Sudah berapa hari sariawannya muncul?</h2>
              </div>
              <div className="space-y-3">
                {[
                  { id: '1-3_hari', title: 'Baru 1–3 hari', sub: 'Tahap awal perkembangan sariawan' },
                  { id: '4-7_hari', title: '4–7 hari', sub: 'Tahap penyembuhan atau puncak nyeri' },
                  { id: '>14_hari', title: 'Lebih dari 14 hari', sub: 'Peringatan khusus (Perlu perhatian medis)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setDuration(item.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      duration === item.id
                        ? 'border-[#F28C38] bg-orange-50/60 shadow-sm ring-2 ring-[#F28C38]/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <p className="font-extrabold text-sm text-[#102A43]">{item.title}</p>
                      <p className="text-xs text-slate-500 font-medium">{item.sub}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        duration === item.id ? 'border-[#F28C38] bg-[#F28C38] text-white' : 'border-slate-300'
                      }`}
                    >
                      {duration === item.id && <CheckCircle2 size={14} />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUESTION 2 */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-[#102A43]">
                <MapPin className="text-[#F28C38]" size={20} />
                <h2 className="text-base md:text-lg font-black">
                  2. Di mana letak sariawannya? <span className="text-xs text-slate-500 font-normal">(Bisa pilih lebih dari satu)</span>
                </h2>
              </div>
              <div className="space-y-3">
                {[
                  'Bibir bagian dalam',
                  'Pipi bagian dalam',
                  'Lidah / bawah lidah',
                  'Gusi',
                  'Langit-langit mulut / dekat tenggorokan',
                ].map((loc) => {
                  const checked = locations.includes(loc);
                  return (
                    <button
                      key={loc}
                      onClick={() => toggleLocation(loc)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        checked
                          ? 'border-[#F28C38] bg-orange-50/60 shadow-sm ring-2 ring-[#F28C38]/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span className="font-extrabold text-sm text-[#102A43]">{loc}</span>
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          checked ? 'border-[#F28C38] bg-[#F28C38] text-white' : 'border-slate-300'
                        }`}
                      >
                        {checked && <CheckCircle2 size={14} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* QUESTION 3 */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-[#102A43]">
                <Layers className="text-[#F28C38]" size={20} />
                <h2 className="text-base md:text-lg font-black">3. Berapa banyak sariawan yang tumbuh saat ini?</h2>
              </div>
              <div className="space-y-3">
                {[
                  { id: '1_titik', title: 'Cuma 1 titik', sub: 'Sariawan tunggal lokal' },
                  { id: '2-3_titik', title: 'Ada 2 sampai 3 titik', sub: 'Beberapa luka sariawan bersamaan' },
                  { id: '>3_titik', title: 'Banyak (lebih dari 3 titik)', sub: 'Sariawan menyebar berkerumun' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCount(item.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      count === item.id
                        ? 'border-[#F28C38] bg-orange-50/60 shadow-sm ring-2 ring-[#F28C38]/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <p className="font-extrabold text-sm text-[#102A43]">{item.title}</p>
                      <p className="text-xs text-slate-500 font-medium">{item.sub}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        count === item.id ? 'border-[#F28C38] bg-[#F28C38] text-white' : 'border-slate-300'
                      }`}
                    >
                      {count === item.id && <CheckCircle2 size={14} />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUESTION 4 */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-[#102A43]">
                <Thermometer className="text-[#F28C38]" size={20} />
                <h2 className="text-base md:text-lg font-black">4. Seberapa perih rasanya? (Pilih angka 1 - 10)</h2>
              </div>
              <div className="space-y-3">
                {[
                  { id: '1-3', title: '1–3: Perih ringan', sub: 'Masih nyaman makan & bicara biasa' },
                  { id: '4-6', title: '4–6: Perih sedang', sub: 'Mulai terganggu saat mengunyah atau minum hangat/pedas' },
                  { id: '7-10', title: '7–10: Sangat perih', sub: 'Sangat perih, sulit makan, minum, atau bicara' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPainLevel(item.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      painLevel === item.id
                        ? 'border-[#F28C38] bg-orange-50/60 shadow-sm ring-2 ring-[#F28C38]/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <p className="font-extrabold text-sm text-[#102A43]">{item.title}</p>
                      <p className="text-xs text-slate-500 font-medium">{item.sub}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        painLevel === item.id ? 'border-[#F28C38] bg-[#F28C38] text-white' : 'border-slate-300'
                      }`}
                    >
                      {painLevel === item.id && <CheckCircle2 size={14} />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUESTION 5 */}
          {step === 5 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-[#102A43]">
                <ShieldCheck className="text-[#F28C38]" size={20} />
                <h2 className="text-base md:text-lg font-black">
                  5. Apakah kamu merasakan gejala lain di tubuh? <span className="text-xs text-slate-500 font-normal">(Pilih jika ada)</span>
                </h2>
              </div>
              <div className="space-y-3">
                {[
                  'Badan demam atau sumeng',
                  'Ada benjolan nyeri di leher',
                  'Mulut terasa sangat kering',
                  'Tidak ada gejala lain (hanya sariawan saja)',
                ].map((sym) => {
                  const checked = symptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      onClick={() => toggleSymptom(sym)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        checked
                          ? 'border-[#F28C38] bg-orange-50/60 shadow-sm ring-2 ring-[#F28C38]/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span className="font-extrabold text-sm text-[#102A43]">{sym}</span>
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          checked ? 'border-[#F28C38] bg-[#F28C38] text-white' : 'border-slate-300'
                        }`}
                      >
                        {checked && <CheckCircle2 size={14} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            {step > 1 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50"
              >
                <ChevronLeft size={16} />
                <span>Sebelumnya</span>
              </button>
            ) : <div />}

            {step < 5 ? (
              <button
                disabled={!canProceed()}
                onClick={() => setStep((s) => s + 1)}
                className="px-6 py-2.5 rounded-xl bg-[#F28C38] hover:bg-[#E57B27] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20"
              >
                <span>Selanjutnya</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                disabled={!canProceed()}
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#102A43] to-[#2F80B7] hover:opacity-95 disabled:opacity-50 text-white text-xs font-black flex items-center gap-1.5 shadow-md"
              >
                <Sparkles size={16} className="text-[#F28C38]" />
                <span>Lihat Hasil &amp; Rekomendasi</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* RESULT VIEW CARD */
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-lg space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Stethoscope size={22} className="text-[#F28C38]" />
              <h2 className="text-lg font-black text-[#102A43]">Hasil Pemeriksaan Sariawan</h2>
            </div>
            <span className={`px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${result.badgeClass}`}>
              Risiko: {result.riskLevel.split(' ')[0]}
            </span>
          </div>

          {/* Status Risk Box */}
          <div className={`p-5 rounded-2xl border ${result.riskClass} space-y-2`}>
            <div className="flex items-center gap-2 font-black text-sm md:text-base">
              <RiskIcon size={20} className="shrink-0" />
              <span>Status Risiko: {result.riskLevel}</span>
            </div>
            <p className="text-xs md:text-sm font-semibold opacity-90">
              Kondisi Terdeteksi: <span className="font-extrabold">{result.conditionName}</span>
            </p>
          </div>

          {/* Summary Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <span className="text-slate-400 font-semibold block">Durasi Sariawan</span>
              <span className="font-bold text-[#102A43]">
                {duration === '1-3_hari' ? '1–3 Hari (Tahap Awal)' : duration === '4-7_hari' ? '4–7 Hari' : '>14 Hari (Kronis)'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Jumlah Titik</span>
              <span className="font-bold text-[#102A43]">
                {count === '1_titik' ? '1 Titik' : count === '2-3_titik' ? '2-3 Titik' : '>3 Titik (Banyak)'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Tingkat Nyeri</span>
              <span className="font-bold text-[#102A43]">Skala {painLevel}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Lokasi Sariawan</span>
              <span className="font-bold text-[#102A43] truncate block">{locations.join(', ')}</span>
            </div>
          </div>

          {/* Recommendation Box */}
          <div className="bg-[#102A43] text-white p-5 md:p-6 rounded-2xl space-y-3 shadow-md">
            <div className="flex items-center gap-2 text-[#F28C38] font-black text-sm">
              <Pill size={18} />
              <span>Rekomendasi Tindakan Smart-Pabbura</span>
            </div>
            <p className="text-xs md:text-sm leading-relaxed text-slate-100 font-medium italic">
              "{result.recommendation}"
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={resetForm}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
            >
              <RotateCcw size={16} />
              <span>Ulangi Pemeriksaan</span>
            </button>
            <Link
              href="/dosis"
              className="w-full sm:w-auto flex-1 px-5 py-3 rounded-2xl bg-[#F28C38] hover:bg-[#E57B27] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Pill size={16} />
              <span>Jadwal Dosis Turate Lozenges</span>
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-[#102A43] text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Home size={16} />
              <span>Beranda</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
