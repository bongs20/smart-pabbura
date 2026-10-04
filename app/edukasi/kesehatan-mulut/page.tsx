'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Leaf, Microscope, Pill, Salad, ShieldAlert, Sparkles, Stethoscope } from 'lucide-react';

export default function OralHealthGuidePage() {
  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/edukasi" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F28C38] mb-2 hover:underline">
            <ArrowLeft size={14} />
            <span>Kembali ke Edukasi</span>
          </Link>
          <h1 className="text-2xl font-black text-[#102A43]">Panduan Kesehatan Mulut</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Edukasi komprehensif penanganan sariawan (stomatitis aftosa) dan perawatan rongga mulut
          </p>
        </div>
        <span className="px-3.5 py-1.5 rounded-full bg-[#FFF1E6] text-[#F28C38] text-xs font-bold border border-orange-200">
          Modul Standar Klinis
        </span>
      </div>

      {/* 4 Cards Grid with Distinct Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Turate Lozenges */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-16 h-16 rounded-2xl p-0 overflow-hidden shadow-xs border border-orange-100">
                <img
                  src="/turate-lozenges-icon.png"
                  alt="Turate Lozenges Icon"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#FFF1E6] text-[#F28C38]">
                Formulasi Lokal
              </span>
            </div>

            <h2 className="text-lg font-extrabold text-[#102A43]">Turate Lozenges</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tablet hisap terstandardisasi yang melepaskan ekstrak bioaktif <strong>Carthamus tinctorius L. (bunga Kasumba Turate)</strong> secara perlahan di rongga mulut. Senyawa flavonoid aktifnya bekerja membentuk lapisan pelindung mukosa (*protective bio-film*), meredakan peradangan lokal, dan merangsang fase regenerasi sel epitelium lesi sariawan.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#FFF1E6] border border-orange-200/80 text-[#F28C38] text-[11px] font-bold flex items-center gap-2">
            <span>✓ Melepaskan flavonoid aktif pelindung jaringan lesi</span>
          </div>
        </div>

        {/* Card 2: Pencegahan Komplikasi */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-16 h-16 rounded-2xl p-0 overflow-hidden shadow-xs border border-red-100">
                <img
                  src="/komplikasi-icon.png"
                  alt="Pencegahan Komplikasi Icon"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#FDECEC] text-[#EF4444]">
                Peringatan Dini
              </span>
            </div>

            <h2 className="text-lg font-extrabold text-[#102A43]">Pencegahan Komplikasi</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mengenali tanda-tanda erosi jaringan dan infeksi bakteri sekunder (*Streptococcus sp.*) pada luka sariawan yang tidak kunjung sembuh. Apabila ulserasi disertai demam tinggi, kesulitan menelan makanan keras, atau lesi sariawan berlangsung <strong>lebih dari 14 hari berturut-turut</strong>, pengguna dianjurkan melakukan evaluasi ke dokter gigi spesialis penyakit mulut.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#FDECEC] border border-red-200/80 text-[#EF4444] text-[11px] font-bold flex items-center gap-2">
            <span>⚠️ Rujukan medis jika luka tidak membaik &gt;14 hari</span>
          </div>
        </div>

        {/* Card 3: Diet Ramah Mukosa */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-16 h-16 rounded-2xl p-0 overflow-hidden shadow-xs border border-green-100">
                <img
                  src="/diet-mukosa-icon.png"
                  alt="Diet Ramah Mukosa Icon"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#EAF7EE] text-[#22C55E]">
                Nutrisi Mukosa
              </span>
            </div>

            <h2 className="text-lg font-extrabold text-[#102A43]">Diet Ramah Mukosa</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Panduan pengaturan konsumsi makanan untuk meminimalkan iritasi kimiawi dan mekanis pada dinding mukosa yang peka. Pilih sajian bersuhu hangat atau dingin sejuk (seperti sup sayur bening, bubur halus, dan puree markisa manis), serta hindari makanan bersuhu sangat panas, bertekstur tajam/kristalin, atau tinggi rasa asam dan garam.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#EAF7EE] border border-green-200/80 text-[#22C55E] text-[11px] font-bold flex items-center gap-2">
            <span>✓ Sup hangat, bubur halus, &amp; hindari iritan asam/pedas</span>
          </div>
        </div>

        {/* Card 4: Edukasi Mikrobioma */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-16 h-16 rounded-2xl p-0 overflow-hidden shadow-xs border border-purple-100">
                <img
                  src="/mikrobioma-icon.png"
                  alt="Edukasi Mikrobioma Icon"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700">
                Ekosistem Mulut
              </span>
            </div>

            <h2 className="text-lg font-extrabold text-[#102A43]">Edukasi Mikrobioma</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Memelihara keseimbangan flora normal rongga mulut (*commensal microbiota*). Hindari penggunaan obat kumur antiseptik alkoholik dosis tinggi secara sembarangan yang dapat membunuh bakteri baik. Pilih pasta gigi bebas *Sodium Lauryl Sulfate (SLS)* untuk menjaga kelembapan alami saliva dan pertahanan immunoglobulin A (sIgA).
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200/80 text-purple-700 text-[11px] font-bold flex items-center gap-2">
            <span>✓ Pertahankan flora normal &amp; sikat gigi pasta bebas SLS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
