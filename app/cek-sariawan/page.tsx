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
  Clock,
  Activity,
  Flame,
  Check,
  HeartPulse,
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
        riskClass: 'bg-red-50/90 text-red-900 border-red-200/80 shadow-xs',
        badgeClass: 'bg-red-600 text-white shadow-sm shadow-red-500/20',
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
        riskClass: 'bg-amber-50/90 text-amber-900 border-amber-200/80 shadow-xs',
        badgeClass: 'bg-[#F28C38] text-white shadow-sm shadow-orange-500/20',
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
      riskClass: 'bg-emerald-50/90 text-emerald-900 border-emerald-200/80 shadow-xs',
      badgeClass: 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20',
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

  const stepTitles = [
    'Durasi Sariawan',
    'Lokasi Sariawan',
    'Jumlah Luka',
    'Tingkat Perih (VAS)',
    'Gejala Tubuh',
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16 animate-fadeIn font-sans">
      {/* Header Banner - Premium Medical Theme */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#102A43] to-[#1E3A5F] rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-white/10">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-72 h-72 bg-gradient-to-br from-[#F28C38]/20 to-[#2F80B7]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-[#FFF1E6] border border-white/15 shadow-xs">
            <Stethoscope size={15} className="text-[#F28C38]" />
            <span>Pemeriksaan Anamnesis Berkala</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight text-white">
            Cek Sariawan Baru 🩺
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl leading-relaxed font-normal">
            Jawab 5 pertanyaan singkat berikut untuk mendeteksi tingkat risiko sariawan dan mendapatkan panduan dosis &amp; tindakan mandiri.
          </p>
        </div>
      </div>

      {!isCompleted ? (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-md space-y-8 relative">
          {/* Enhanced Progress Header */}
          <div className="space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center text-xs font-black tracking-wide text-[#102A43]">
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#102A43] text-white flex items-center justify-center text-[11px] font-bold">
                  {step}
                </span>
                <span>PERTANYAAN {step} DARI 5</span>
              </span>
              <span className="text-[#F28C38] font-extrabold">{stepTitles[step - 1]} ({Math.round((step / 5) * 100)}%)</span>
            </div>
            
            {/* Progress Bar Container */}
            <div className="w-full h-3 bg-slate-200/70 rounded-full overflow-hidden p-0.5 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-[#F28C38] via-[#FF9F43] to-[#2F80B7] transition-all duration-400 ease-out rounded-full shadow-sm"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* QUESTION 1 */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#F28C38] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <Calendar size={20} />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-black text-[#102A43] tracking-tight leading-snug">
                    1. Sudah berapa hari sariawannya muncul?
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">Pilih durasi waktu sejak pertama kali dirasakan.</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  {
                    id: '1-3_hari',
                    title: 'Baru 1–3 hari',
                    badge: 'Tahap Awal',
                    badgeColor: 'bg-emerald-100 text-emerald-800',
                    icon: Clock,
                    sub: 'Sariawan baru muncul dan biasanya masih dalam reaksi awal peradangan.',
                  },
                  {
                    id: '4-7_hari',
                    title: '4–7 hari',
                    badge: 'Tahap Penyembuhan',
                    badgeColor: 'bg-amber-100 text-amber-800',
                    icon: Activity,
                    sub: 'Sariawan memasuki masa puncak nyeri atau mulai membaik secara alami.',
                  },
                  {
                    id: '>14_hari',
                    title: 'Lebih dari 14 hari',
                    badge: 'Peringatan Khusus',
                    badgeColor: 'bg-red-100 text-red-800',
                    icon: AlertTriangle,
                    sub: 'Sariawan menahun yang memerlukan evaluasi medis lebih lanjut.',
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = duration === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setDuration(item.id)}
                      className={`w-full p-4 md:p-5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between group ${
                        isSelected
                          ? 'border-[#F28C38] bg-orange-50/70 shadow-md ring-2 ring-[#F28C38]/30 transform scale-[1.01]'
                          : 'border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="flex items-start gap-3.5 pr-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isSelected ? 'bg-[#F28C38] text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-normal text-sm md:text-base text-[#102A43]">{item.title}</span>
                            <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${item.badgeColor}`}>
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed font-normal">{item.sub}</p>
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? 'border-[#F28C38] bg-[#F28C38] text-white shadow-xs' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* QUESTION 2 */}
          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-[#2F80B7] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <MapPin size={20} />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-black text-[#102A43] tracking-tight leading-snug">
                    2. Di mana letak sariawannya?
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Bisa memilih lebih dari satu lokasi jika terdapat beberapa titik sariawan.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
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
                      className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between group ${
                        checked
                          ? 'border-[#F28C38] bg-orange-50/70 shadow-md ring-2 ring-[#F28C38]/30 transform scale-[1.01]'
                          : 'border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs ${
                            checked ? 'bg-[#F28C38] text-white' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          📍
                        </div>
                        <span className="font-normal text-sm md:text-base text-[#102A43]">{loc}</span>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                          checked ? 'border-[#F28C38] bg-[#F28C38] text-white shadow-xs' : 'border-slate-300'
                        }`}
                      >
                        {checked && <Check size={14} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* QUESTION 3 */}
          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <Layers size={20} />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-black text-[#102A43] tracking-tight leading-snug">
                    3. Berapa banyak sariawan yang tumbuh saat ini?
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">Hitung jumlah titik luka sariawan aktif di rongga mulut.</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { id: '1_titik', title: 'Cuma 1 titik', countLabel: '1 Luka Soliter', sub: 'Sariawan tunggal lokal di satu area.' },
                  { id: '2-3_titik', title: 'Ada 2 sampai 3 titik', countLabel: '2-3 Luka', sub: 'Beberapa luka kecil bersamaan.' },
                  { id: '>3_titik', title: 'Banyak (lebih dari 3 titik)', countLabel: '>3 Luka Multiple', sub: 'Sariawan tersebar berkerumun di beberapa lokasi.' },
                ].map((item) => {
                  const isSelected = count === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCount(item.id)}
                      className={`w-full p-4 md:p-5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between group ${
                        isSelected
                          ? 'border-[#F28C38] bg-orange-50/70 shadow-md ring-2 ring-[#F28C38]/30 transform scale-[1.01]'
                          : 'border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-normal text-sm md:text-base text-[#102A43]">{item.title}</span>
                          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {item.countLabel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-normal">{item.sub}</p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? 'border-[#F28C38] bg-[#F28C38] text-white shadow-xs' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* QUESTION 4 */}
          {step === 4 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <Flame size={20} />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-black text-[#102A43] tracking-tight leading-snug">
                    4. Seberapa perih rasanya? (Pilih angka 1 - 10)
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Evaluasi intensitas rasa perih / nyeri berdasarkan tingkat kenyamanan saat makan atau bicara.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  {
                    id: '1-3',
                    title: '1–3: Perih ringan',
                    badge: 'Nyeri Minimal (VAS 1-3)',
                    color: 'bg-emerald-500 text-white',
                    sub: 'Masih sangat nyaman untuk makan, minum, dan berbicara seperti biasa.',
                  },
                  {
                    id: '4-6',
                    title: '4–6: Perih sedang',
                    badge: 'Nyeri Sedang (VAS 4-6)',
                    color: 'bg-[#F28C38] text-white',
                    sub: 'Mulai terasa terganggu dan agak perih saat mengunyah atau meminum air pedas/hangat.',
                  },
                  {
                    id: '7-10',
                    title: '7–10: Sangat perih',
                    badge: 'Nyeri Berat (VAS 7-10)',
                    color: 'bg-red-600 text-white',
                    sub: 'Sangat perih & hebat, hingga membuat sulit makan, minum, atau mengunyah.',
                  },
                ].map((item) => {
                  const isSelected = painLevel === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setPainLevel(item.id)}
                      className={`w-full p-4 md:p-5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between group ${
                        isSelected
                          ? 'border-[#F28C38] bg-orange-50/70 shadow-md ring-2 ring-[#F28C38]/30 transform scale-[1.01]'
                          : 'border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="space-y-1.5 pr-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-normal text-sm md:text-base text-[#102A43]">{item.title}</span>
                          <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs ${item.color}`}>
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-normal leading-relaxed">{item.sub}</p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? 'border-[#F28C38] bg-[#F28C38] text-white shadow-xs' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* QUESTION 5 */}
          {step === 5 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-black text-[#102A43] tracking-tight leading-snug">
                    5. Apakah kamu merasakan gejala lain di tubuh?
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Pilih gejala penyerta jika ada (mendeteksi indikasi sistemik/infeksi lain).
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { text: 'Badan demam atau sumeng', tag: 'Gejala Sistemik' },
                  { text: 'Ada benjolan nyeri di leher', tag: 'Kelenjar Getah Bening' },
                  { text: 'Mulut terasa sangat kering', tag: 'Dehidrasi / Xerostomia' },
                  { text: 'Tidak ada gejala lain (hanya sariawan saja)', tag: 'Sariawan Lokal Aman' },
                ].map((item) => {
                  const checked = symptoms.includes(item.text);
                  return (
                    <button
                      key={item.text}
                      onClick={() => toggleSymptom(item.text)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between group ${
                        checked
                          ? 'border-[#F28C38] bg-orange-50/70 shadow-md ring-2 ring-[#F28C38]/30 transform scale-[1.01]'
                          : 'border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="font-normal text-sm md:text-base text-[#102A43] block">{item.text}</span>
                        <span className="text-[10px] font-semibold text-slate-400">{item.tag}</span>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                          checked ? 'border-[#F28C38] bg-[#F28C38] text-white shadow-xs' : 'border-slate-300'
                        }`}
                      >
                        {checked && <Check size={14} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Navigation Bar */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-100">
            {step > 1 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-700 text-xs font-black flex items-center gap-2 hover:bg-slate-50 active:scale-95 transition-all"
              >
                <ChevronLeft size={18} />
                <span>Sebelumnya</span>
              </button>
            ) : <div />}

            {step < 5 ? (
              <button
                disabled={!canProceed()}
                onClick={() => setStep((s) => s + 1)}
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-[#F28C38] to-[#FF9F43] hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-black flex items-center gap-2 shadow-md shadow-orange-500/25 active:scale-95 transition-all"
              >
                <span>Selanjutnya</span>
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                disabled={!canProceed()}
                onClick={handleFinish}
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-[#102A43] via-[#1E3A5F] to-[#2F80B7] hover:opacity-95 disabled:opacity-40 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-blue-950/20 active:scale-95 transition-all"
              >
                <Sparkles size={18} className="text-[#F28C38]" />
                <span>Lihat Hasil &amp; Rekomendasi</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* RESULT VIEW CARD - ELEGANT MEDICAL REPORT DESIGN */
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-xl space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#F28C38] flex items-center justify-center font-bold">
                <Stethoscope size={20} />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-black text-[#102A43]">Ringkasan Anamnesis Sariawan</h2>
                <p className="text-xs text-slate-400">Hasil kalkulasi risiko berdasarkan respon pengguna</p>
              </div>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${result.badgeClass}`}>
              {result.riskLevel.split(' ')[0]}
            </span>
          </div>

          {/* Status Risk Alert Container */}
          <div className={`p-6 rounded-2xl border ${result.riskClass} space-y-2 relative overflow-hidden`}>
            <div className="flex items-center gap-2.5 font-black text-base md:text-lg">
              <RiskIcon size={24} className="shrink-0" />
              <span>Status Risiko: {result.riskLevel}</span>
            </div>
            <p className="text-xs md:text-sm font-bold opacity-90 leading-relaxed">
              Kondisi Terdeteksi: <span className="underline decoration-2">{result.conditionName}</span>
            </p>
          </div>

          {/* Summary Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50/90 p-5 rounded-2xl border border-slate-100">
            <div className="space-y-0.5">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Durasi Sariawan</span>
              <p className="font-black text-[#102A43] text-sm">
                {duration === '1-3_hari' ? '1–3 Hari (Tahap Awal)' : duration === '4-7_hari' ? '4–7 Hari' : '>14 Hari (Kronis)'}
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Jumlah Titik</span>
              <p className="font-black text-[#102A43] text-sm">
                {count === '1_titik' ? '1 Titik Soliter' : count === '2-3_titik' ? '2-3 Titik' : '>3 Titik (Banyak)'}
              </p>
            </div>
            <div className="space-y-0.5 pt-2">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Tingkat Perih</span>
              <p className="font-black text-[#102A43] text-sm">Skala {painLevel}</p>
            </div>
            <div className="space-y-0.5 pt-2">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Lokasi Sariawan</span>
              <p className="font-black text-[#102A43] text-sm truncate">{locations.join(', ')}</p>
            </div>
          </div>

          {/* Recommendation Action Box */}
          <div className="bg-[#102A43] text-white p-6 rounded-2xl space-y-3 shadow-lg border border-white/10 relative overflow-hidden">
            <div className="flex items-center gap-2 text-[#F28C38] font-black text-sm uppercase tracking-wide">
              <Pill size={20} />
              <span>Rekomendasi Terapi &amp; Tindakan Application</span>
            </div>
            <p className="text-xs md:text-sm leading-relaxed text-slate-100 font-medium italic">
              "{result.recommendation}"
            </p>
          </div>

          {/* Action Footer Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
            <button
              onClick={resetForm}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-200 text-slate-700 text-xs font-black flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
            >
              <RotateCcw size={16} />
              <span>Ulangi Cek</span>
            </button>
            <Link
              href="/dosis"
              className="w-full sm:w-auto flex-1 px-5 py-3 rounded-2xl bg-[#F28C38] hover:bg-[#E57B27] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-orange-500/25 transition-all"
            >
              <Pill size={16} />
              <span>Jadwal Dosis Turate Lozenges</span>
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-[#102A43] text-xs font-black flex items-center justify-center gap-2 transition-all"
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
