'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveBaseline, saveHealthData } from '@/lib/storage';
import PainScale from '@/components/ui/PainScale';
import { CheckCircle2, ChevronRight } from 'lucide-react';

const TOTAL_STEPS = 5;

export default function BaselinePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);

  // Form values
  const [vas, setVas] = useState(5);
  const [ulcerSize, setUlcerSize] = useState(0.5);
  const [durationDays, setDurationDays] = useState(3);
  const [condition, setCondition] = useState('Biasa');

  const progress = (step / TOTAL_STEPS) * 100;

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    saveBaseline({
      step: TOTAL_STEPS,
      vas,
      ulcerSize,
      durationDays,
      condition,
      completed: true,
      startDate: new Date().toISOString(),
    });

    saveHealthData({
      vas,
      date: new Date().toISOString(),
    });

    setCompleted(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-5 gap-6">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#1E3A5F]">Monitoring Berhasil Dimulai</h2>
          <p className="text-sm text-gray-500 mt-2">
            Data awal Anda telah tersimpan. Mengalihkan ke dashboard...
          </p>
        </div>
        <div className="w-full max-w-xs bg-gray-100 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-[#22C55E] transition-all duration-2000"
            style={{ width: '100%' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Header */}
      <div className="px-5 pt-8 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold text-[#1E3A5F]">Asesmen Awal</h1>
            <p className="text-xs text-gray-400 mt-0.5">SmartPabbura Baseline Assessment</p>
          </div>
          <span
            className="text-sm font-bold px-3 py-1.5 rounded-xl"
            style={{ backgroundColor: '#FFF0EB', color: '#FF6B35' }}
          >
            {step} / {TOTAL_STEPS}
          </span>
        </div>

        {/* Progress bar */}
        <div className="bg-gray-100 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: '#FF6B35' }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex justify-between mt-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{
                backgroundColor: i + 1 <= step ? '#FF6B35' : '#F1F5F9',
                color: i + 1 <= step ? 'white' : '#94A3B8',
              }}
            >
              {i + 1 < step ? '✓' : i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 px-5 flex flex-col gap-5">
        {step === 1 && (
          <StepCard title="Langkah 1: Tingkat Nyeri" subtitle="Seberapa nyeri sariawan Anda saat ini?">
            <PainScale value={vas} onChange={setVas} />
          </StepCard>
        )}

        {step === 2 && (
          <StepCard title="Langkah 2: Ukuran Ulser" subtitle="Perkiraan ukuran diameter terbesar sariawan">
            <div className="flex flex-col gap-3">
              <div className="flex items-center bg-[#F8FAFF] rounded-2xl px-5 py-4 border border-[#E2E8F0]">
                <input
                  type="number"
                  value={ulcerSize}
                  onChange={(e) => setUlcerSize(parseFloat(e.target.value) || 0)}
                  step={0.1}
                  min={0}
                  max={5}
                  className="flex-1 bg-transparent text-3xl font-bold text-[#1E3A5F] outline-none"
                />
                <span className="text-lg text-gray-400 font-medium">cm</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[0.3, 0.5, 0.8, 1.0, 1.5, 2.0].map((v) => (
                  <button
                    key={v}
                    onClick={() => setUlcerSize(v)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold"
                    style={{
                      backgroundColor: ulcerSize === v ? '#FF6B35' : '#F1F5F9',
                      color: ulcerSize === v ? 'white' : '#64748B',
                    }}
                  >
                    {v} cm
                  </button>
                ))}
              </div>
            </div>
          </StepCard>
        )}

        {step === 3 && (
          <StepCard title="Langkah 3: Durasi Sariawan" subtitle="Sudah berapa hari sariawan ini ada?">
            <div className="flex flex-col gap-4">
              <div className="flex items-center bg-[#F8FAFF] rounded-2xl px-5 py-4 border border-[#E2E8F0]">
                <input
                  type="number"
                  value={durationDays}
                  onChange={(e) => setDurationDays(parseInt(e.target.value) || 0)}
                  min={1}
                  max={30}
                  className="flex-1 bg-transparent text-3xl font-bold text-[#1E3A5F] outline-none"
                />
                <span className="text-lg text-gray-400 font-medium">hari</span>
              </div>
              {durationDays >= 14 && (
                <div className="bg-[#FFFBEB] rounded-2xl p-4 border border-yellow-200">
                  <p className="text-xs text-amber-700">
                    ⚠️ Sariawan yang berlangsung ≥14 hari perlu perhatian lebih. Disarankan berkonsultasi dengan tenaga kesehatan.
                  </p>
                </div>
              )}
            </div>
          </StepCard>
        )}

        {step === 4 && (
          <StepCard title="Langkah 4: Kondisi Mulut" subtitle="Bagaimana kondisi umum mulut Anda?">
            <div className="flex flex-col gap-3">
              {['Sangat Baik', 'Baik', 'Biasa', 'Kurang Baik', 'Buruk'].map((c) => (
                <button
                  key={c}
                  onClick={() => setCondition(c)}
                  className="flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                  style={{
                    backgroundColor: condition === c ? '#FFF0EB' : '#F8FAFF',
                    border: `2px solid ${condition === c ? '#FF6B35' : 'transparent'}`,
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: condition === c ? '#FF6B35' : '#CBD5E1' }}
                  >
                    {condition === c && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]" />
                    )}
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: condition === c ? '#FF6B35' : '#1E3A5F' }}
                  >
                    {c}
                  </span>
                </button>
              ))}
            </div>
          </StepCard>
        )}

        {step === 5 && (
          <StepCard title="Langkah 5: Konfirmasi" subtitle="Periksa data asesmen awal Anda">
            <div className="flex flex-col gap-3">
              <ConfirmRow label="Tingkat Nyeri (VAS)" value={`${vas}/10`} />
              <ConfirmRow label="Ukuran Ulser" value={`${ulcerSize} cm`} />
              <ConfirmRow label="Durasi Sariawan" value={`${durationDays} hari`} />
              <ConfirmRow label="Kondisi Mulut" value={condition} />

              <div className="bg-[#F0FDF4] rounded-2xl p-4 mt-2">
                <p className="text-xs text-green-700 leading-relaxed">
                  ✅ Data ini akan digunakan sebagai baseline monitoring Anda. Klik &quot;Mulai Monitoring&quot; untuk memulai.
                </p>
              </div>
            </div>
          </StepCard>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="px-5 pb-6 pt-3 flex gap-3">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="flex-1 py-4 rounded-2xl font-semibold text-sm bg-[#F1F5F9] text-[#1E3A5F]"
          >
            Kembali
          </button>
        )}
        <button
          onClick={step < TOTAL_STEPS ? handleNext : handleSubmit}
          className="flex-1 py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2"
          style={{ backgroundColor: '#FF6B35' }}
        >
          {step < TOTAL_STEPS ? (
            <>Lanjut <ChevronRight size={18} /></>
          ) : (
            <>Mulai Monitoring ✓</>
          )}
        </button>
      </div>
    </div>
  );
}

function StepCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-base font-bold text-[#1E3A5F]">{title}</h2>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>
      <div className="card p-5">{children}</div>
    </div>
  );
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-bold text-[#1E3A5F]">{value}</span>
    </div>
  );
}
