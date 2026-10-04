'use client';

import React from 'react';
import Link from 'next/link';
import { Apple, ArrowLeft, Droplets, FlaskConical, Leaf, Sparkles, Utensils, Zap } from 'lucide-react';

export default function NutritionEducationPage() {
  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/edukasi" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#22C55E] mb-2 hover:underline">
            <ArrowLeft size={14} />
            <span>Kembali ke Edukasi</span>
          </Link>
          <h1 className="text-2xl font-black text-[#102A43]">Edukasi Gizi &amp; Flavonoid</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dukungan nutrisi makro, mikronutrisi, dan aktivitas flavonoid tanaman obat lokal
          </p>
        </div>
        <span className="px-3.5 py-1.5 rounded-full bg-[#EAF7EE] text-[#22C55E] text-xs font-bold border border-green-200">
          Biokimia &amp; Nutrisi
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Aktivitas Flavonoid */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF7EE] text-[#22C55E] flex items-center justify-center font-bold">
              <Leaf size={24} />
            </div>
            <h2 className="text-lg font-extrabold text-[#102A43]">Mekanisme Flavonoid Kasumba Turate</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kandungan senyawa flavonoid (seperti *carthamin* dan *safflor yellow*) dalam ekstrak <strong>Carthamus tinctorius L.</strong> memiliki aktivitas antioksidan dan penekan mediator peradangan (*COX-2* dan sitokin pro-inflamasi). Ekstrak ini bekerja mengunci kerusakan radikal bebas dan mempercepat pembentukan pembuluh darah baru (*angiogenesis*) pada jaringan mukosa mulut yang terluka.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#EAF7EE] border border-green-200 text-[#22C55E] text-[11px] font-bold">
            ✓ Antioksidan &amp; penekan sitokin inflamasi COX-2
          </div>
        </div>

        {/* Section 2: Defisiensi Mikronutrisi */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF1E6] text-[#F28C38] flex items-center justify-center font-bold">
              <Utensils size={24} />
            </div>
            <h2 className="text-lg font-extrabold text-[#102A43]">Defisiensi Vitamin B12, Folat &amp; Zat Besi</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kekurangan mikronutrisi esensial seperti Vitamin B12 (*cobalamin*), Asam Folat (B9), dan Zat Besi merusak maturitas sel-sel epitelium mulut, sehingga mukosa menjadi tipis dan lebih rapuh terhadap mikro-trauma. Pemenuhan gizi seimbang mencegah munculnya sariawan berulang (*recurrent aphthous stomatitis*).
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#FFF1E6] border border-orange-200 text-[#F28C38] text-[11px] font-bold">
            ✓ Konsumsi telur, daging tanpa lemak, &amp; kacang-kacangan
          </div>
        </div>

        {/* Section 3: Antioksidan Vitamin C & Zinc */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF7FC] text-[#2F80B7] flex items-center justify-center font-bold">
              <FlaskConical size={24} />
            </div>
            <h2 className="text-lg font-extrabold text-[#102A43]">Peran Vitamin C &amp; Seng (Zinc)</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vitamin C menstimulasi hidroksilasi prolin dalam sintesis jaringan kolagen baru untuk menutup dasar lesi sariawan. Sementara mineral Seng (Zinc) bertindak sebagai kofaktor penting bagi enzim DNA polimerase dalam mempercepat mitosis dan proliferasi sel epitelial mulut.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#EEF7FC] border border-blue-200 text-[#2F80B7] text-[11px] font-bold">
            ✓ Sintesis kolagen &amp; akselerasi proliferasi sel
          </div>
        </div>

        {/* Section 4: Hidrasi & Saliva Protective Factors */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Droplets size={24} />
            </div>
            <h2 className="text-lg font-extrabold text-[#102A43]">Hidrasi &amp; Sekret Protektif Saliva</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Saliva (air liur) mengandung enzim alami lisozim, laktoferin, serta imunoglobulin sIgA yang berfungsi sebagai antibodi alami rongga mulut. Asupan air minum seimbang (2–2.5 Liter/hari) mencegah kondisi *xerostomia* (mulut kering) yang memicu peradangan mukosa semakin parah.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-700 text-[11px] font-bold">
            ✓ Minimum 2 Liter air/hari untuk sekresi saliva alami
          </div>
        </div>
      </div>
    </div>
  );
}
