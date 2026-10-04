'use client';

import { useState, useRef } from 'react';
import Header from '@/components/layout/Header';
import { Camera, Upload, Trash2, Save, Info } from 'lucide-react';
import { saveUlcerRecord } from '@/lib/storage';

export default function UlcerDocumentationPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = () => {
    setImagePreview(null);
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = () => {
    saveUlcerRecord({
      date: new Date().toISOString(),
      imageUrl: imagePreview || undefined,
      notes,
      durationDays: 7,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <Header title="Dokumentasi Ulser" showBack />

      <div className="flex flex-col gap-5 px-5 pt-3">
        {/* Info banner */}
        <div className="flex items-start gap-3 bg-[#EEF4FF] rounded-2xl p-4">
          <Info size={18} className="text-[#1E3A5F] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#1E3A5F] leading-relaxed">
            Gunakan foto dengan <strong>pencahayaan cukup</strong> dan <strong>sudut yang konsisten</strong> untuk memudahkan perbandingan antar sesi.
          </p>
        </div>

        {/* Upload area */}
        <div className="card p-5">
          <h3 className="text-sm font-bold text-[#1E3A5F] mb-4">Foto Ulser</h3>

          {!imagePreview ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-48 rounded-2xl border-2 border-dashed border-[#E2E8F0] flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-[#FF6B35] hover:bg-[#FFF0EB] transition-colors"
              aria-label="Upload foto ulser"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] flex items-center justify-center">
                <Camera size={24} className="text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-500">Tap untuk upload foto</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, HEIC (maks. 10MB)</p>
              </div>
              <div className="flex items-center gap-2 bg-[#FFF0EB] px-4 py-2 rounded-xl">
                <Upload size={14} className="text-[#FF6B35]" />
                <span className="text-xs font-semibold text-[#FF6B35]">Pilih Foto</span>
              </div>
            </button>
          ) : (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Preview foto ulser"
                className="w-full h-48 object-cover rounded-2xl"
              />
              <button
                onClick={handleDelete}
                className="absolute top-3 right-3 w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center shadow-lg"
                aria-label="Hapus foto"
              >
                <Trash2 size={14} className="text-white" />
              </button>
              <div className="mt-3 bg-[#F8FAFF] rounded-xl px-4 py-2">
                <p className="text-xs text-gray-500 truncate">{fileName}</p>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
            aria-label="Input file foto"
          />
        </div>

        {/* AI Analysis disclaimer */}
        <div className="card p-5" style={{ background: 'linear-gradient(135deg, #F5F3FF, #EEF4FF)' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🤖</span>
            <h3 className="text-sm font-bold text-[#8B5CF6]">Analisis Visual AI — Prototype</h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Fitur analisis visual AI sedang dalam tahap pengembangan. Sistem ini <strong>tidak melakukan diagnosis medis</strong>. Foto yang diupload hanya digunakan untuk keperluan dokumentasi penelitian.
          </p>
          {imagePreview && (
            <div className="mt-3 bg-white rounded-xl p-3">
              <p className="text-xs text-[#8B5CF6] font-semibold">Analisis Tersedia Setelah Simpan</p>
              <p className="text-[10px] text-gray-400 mt-1">Data foto akan diproses oleh tim penelitian.</p>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="card p-5">
          <h3 className="text-sm font-bold text-[#1E3A5F] mb-3">Catatan</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Deskripsikan kondisi ulser (ukuran, warna, rasa, dll.)..."
            rows={3}
            className="w-full bg-[#F8FAFF] rounded-2xl px-4 py-3 text-sm text-[#1E3A5F] outline-none border border-[#E2E8F0] resize-none placeholder:text-gray-400"
          />
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!imagePreview && !notes}
          className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all"
          style={{
            backgroundColor: (!imagePreview && !notes) ? '#CBD5E1' : saved ? '#22C55E' : '#FF6B35',
            cursor: (!imagePreview && !notes) ? 'not-allowed' : 'pointer',
          }}
        >
          <Save size={18} />
          {saved ? 'Tersimpan!' : 'Simpan Dokumentasi'}
        </button>
      </div>
    </div>
  );
}
