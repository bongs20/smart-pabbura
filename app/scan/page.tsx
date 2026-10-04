'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, CheckCircle2, QrCode, Sparkles } from 'lucide-react';

export default function QRScanPage() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      router.push('/monitoring');
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto text-center">
      {/* Header Banner (Matching Beranda Style) */}
      <div className="bg-gradient-to-r from-[#102A43] via-[#1E3A5F] to-[#2F80B7] rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden space-y-2">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-[#FFF1E6] mb-2 border border-white/10">
            <QrCode size={14} className="text-[#F28C38]" />
            <span>Alur Integrasi Kemasan</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">Scan QR Turate</h1>
          <p className="text-slate-200 text-xs md:text-sm font-normal">
            Pindai kode QR pada kemasan Turate Denti Lozenges untuk memulai sesi pemantauan harian.
          </p>
        </div>
      </div>

      {/* Simulated Scanner Viewport */}
      <div className="bg-[#102A43] rounded-3xl p-8 shadow-xl text-white relative overflow-hidden flex flex-col items-center justify-center min-h-[340px] space-y-6">
        {/* Camera Frame Simulation */}
        <div className="relative w-64 h-64 rounded-2xl border-2 border-dashed border-[#F28C38]/80 flex flex-col items-center justify-center p-4 bg-white/5 backdrop-blur-xs">
          {/* Corner Markers */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-[#F28C38] rounded-tl-lg" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-[#F28C38] rounded-tr-lg" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-[#F28C38] rounded-bl-lg" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-[#F28C38] rounded-br-lg" />

          {/* Laser Scanning Animation Line */}
          {scanning && (
            <div className="absolute inset-x-4 top-4 h-1 bg-gradient-to-r from-transparent via-[#F28C38] to-transparent shadow-[0_0_15px_#F28C38] animate-pulse transition-all" />
          )}

          <QrCode size={90} className={`text-white/80 ${scanning ? 'scale-110 opacity-100 transition-all' : 'opacity-60'}`} />
          <p className="text-xs text-slate-300 font-semibold mt-4">
            {scanning ? 'Memproses Kode QR Turate...' : 'Arahkan Kamera ke Kode QR Kemasan'}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSimulateScan}
          disabled={scanning}
          className="w-full max-w-sm py-4 rounded-2xl bg-[#F28C38] hover:bg-[#E57B27] text-white font-extrabold text-sm shadow-lg shadow-orange-500/40 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {scanning ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Memindai...</span>
            </>
          ) : (
            <>
              <Camera size={18} />
              <span>Simulasikan Scan QR</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-slate-400">
          QR Code &rarr; Monitoring &rarr; Input VAS &rarr; Input Kondisi &rarr; Simpan &rarr; Analisis &rarr; Riwayat
        </p>
      </div>
    </div>
  );
}
