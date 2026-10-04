'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import PainScale from '@/components/ui/PainScale';
import { savePainRecord, saveHistoryRecord, saveHealthData } from '@/lib/storage';
import { formatDateShort, generateId } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

type Condition = 'Lebih baik' | 'Sama' | 'Lebih buruk';

export default function PainLogPage() {
  const router = useRouter();
  const [vas, setVas] = useState(3);
  const [condition, setCondition] = useState<Condition>('Sama');
  const [ulcerSize, setUlcerSize] = useState(0.5);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const conditions: Condition[] = ['Lebih baik', 'Sama', 'Lebih buruk'];

  const conditionColors: Record<Condition, { bg: string; active: string; text: string }> = {
    'Lebih baik': { bg: '#F0FDF4', active: '#22C55E', text: '#15803D' },
    'Sama': { bg: '#FFFBEB', active: '#F59E0B', text: '#92400E' },
    'Lebih buruk': { bg: '#FEF2F2', active: '#EF4444', text: '#991B1B' },
  };

  const handleSave = async () => {
    setSaving(true);
    const today = new Date().toISOString().split('T')[0];
    const dateFormatted = formatDateShort(new Date());

    // Save pain record
    savePainRecord({
      date: today,
      vas,
      ulcerSize,
      condition,
      notes,
    });

    // Save to history
    saveHistoryRecord({
      date: dateFormatted,
      vas,
      ulcerSize,
      ph: 6.8,
      doses: '2/3',
      notes,
    });

    // Update health metrics
    saveHealthData({ vas });

    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      router.push('/analysis');
    }, 1500);
  };

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-5 gap-4">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>
        <h2 className="text-lg font-bold text-[#1E3A5F]">Data Tersimpan!</h2>
        <p className="text-sm text-gray-500 text-center">Data nyeri berhasil dicatat. Mengalihkan ke riwayat...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <Header title="Catat Tingkat Nyeri" showBack />

      <div className="flex flex-col gap-5 px-5 pt-3">
        {/* VAS Scale */}
        <div className="card p-5">
          <h3 className="text-sm font-bold text-[#1E3A5F] mb-4">
            Skala Nyeri VAS (0–10)
          </h3>
          <PainScale value={vas} onChange={setVas} />
        </div>

        {/* Kondisi sariawan */}
        <div className="card p-5">
          <h3 className="text-sm font-bold text-[#1E3A5F] mb-4">Kondisi Sariawan</h3>
          <div className="flex gap-2">
            {conditions.map((c) => {
              const style = conditionColors[c];
              const isActive = condition === c;
              return (
                <button
                  key={c}
                  onClick={() => setCondition(c)}
                  className="flex-1 py-3 rounded-2xl text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: isActive ? style.active : style.bg,
                    color: isActive ? 'white' : style.text,
                    border: `2px solid ${isActive ? style.active : 'transparent'}`,
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ulcer size */}
        <div className="card p-5">
          <h3 className="text-sm font-bold text-[#1E3A5F] mb-3">Ukuran Ulser</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center bg-[#F8FAFF] rounded-2xl px-4 py-3 border border-[#E2E8F0]">
              <input
                type="number"
                value={ulcerSize}
                onChange={(e) => setUlcerSize(parseFloat(e.target.value) || 0)}
                step={0.1}
                min={0}
                max={5}
                className="flex-1 bg-transparent text-lg font-bold text-[#1E3A5F] outline-none w-full"
                aria-label="Ukuran ulser dalam sentimeter"
              />
              <span className="text-sm text-gray-400 font-medium">cm</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Masukkan ukuran diameter terbesar ulser</p>
        </div>

        {/* Notes */}
        <div className="card p-5">
          <h3 className="text-sm font-bold text-[#1E3A5F] mb-3">Catatan (opsional)</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tambahkan catatan tentang kondisi hari ini..."
            rows={3}
            className="w-full bg-[#F8FAFF] rounded-2xl px-4 py-3 text-sm text-[#1E3A5F] outline-none border border-[#E2E8F0] resize-none placeholder:text-gray-400"
            aria-label="Catatan tambahan"
          />
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 rounded-2xl font-bold text-white text-sm transition-all"
          style={{
            backgroundColor: saving ? '#CBD5E1' : '#FF6B35',
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Menyimpan...' : 'Simpan Data'}
        </button>

        {/* Disclaimer */}
        <p className="text-[10px] text-gray-400 text-center pb-2 leading-relaxed">
          Data ini dicatat sebagai bagian dari monitoring protokol penelitian. Jangan menggunakan untuk diagnosis mandiri.
        </p>
      </div>
    </div>
  );
}
