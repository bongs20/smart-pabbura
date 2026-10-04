'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Heart,
  Search,
  ShieldCheck,
  Stethoscope,
  Utensils,
} from 'lucide-react';

export const educationCategories = [
  {
    id: 'kesehatan-mulut',
    title: 'Panduan Kesehatan Mulut',
    subtitle: 'Pelajari cara menjaga kebersihan, produk Turate Lozenges, dan kesehatan rongga mulut.',
    icon: Stethoscope,
    color: '#F28C38',
    bg: '#FFF1E6',
    href: '/edukasi/kesehatan-mulut',
    keywords: ['mulut', 'sariawan', 'ph', 'turate', 'lozenges', 'kebersihan', 'gigi'],
  },
  {
    id: 'gizi',
    title: 'Edukasi Gizi & Flavonoid',
    subtitle: 'Nutrisi penting & kandungan flavonoid Carthamus tinctorius L. untuk penyembuhan luka.',
    icon: Utensils,
    color: '#22C55E',
    bg: '#EAF7EE',
    href: '/edukasi/gizi',
    keywords: ['gizi', 'nutrisi', 'flavonoid', 'carthamus', 'vitamin', 'makanan', 'buah'],
  },
  {
    id: 'gaya-hidup',
    title: 'Panduan Gaya Hidup Sehat',
    subtitle: 'Pola makan bergambar, manajemen stres, sleep tracking, dan kebugaran.',
    icon: Heart,
    color: '#2F80B7',
    bg: '#EEF7FC',
    href: '/edukasi/gaya-hidup',
    keywords: ['gaya hidup', 'stres', 'tidur', 'olahraga', 'pola makan', 'hidrasi', 'air'],
  },
  {
    id: 'rekomendasi',
    title: 'Rekomendasi & Triase Digital',
    subtitle: 'Panduan klasifikasi kondisi sariawan (ringan, sedang, konsultasi medis).',
    icon: ShieldCheck,
    color: '#8B5CF6',
    bg: '#F3E8FF',
    href: '/rekomendasi',
    keywords: ['rekomendasi', 'triase', 'dokter', 'obat', 'vas', 'tingkat nyeri', 'klinis'],
  },
];

export default function EducationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCategories = educationCategories.filter((cat) => {
    const matchesSearch =
      cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || cat.id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header Banner (Matching Beranda Style) */}
      <div className="bg-gradient-to-r from-[#102A43] via-[#1E3A5F] to-[#2F80B7] rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-[#FFF1E6] mb-2 border border-white/10">
            <BookOpen size={14} className="text-[#F28C38]" />
            <span>Pusat Literasi Digital</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">Edukasi Kesehatan</h1>
          <p className="text-slate-200 text-xs md:text-sm mt-1 font-normal">
            Informasi ilmiah terstandardisasi mengenai kesehatan mulut, nutrisi, dan flavonoid.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative z-10 w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-300">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari topik atau kata kunci..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#F28C38] focus:bg-white/20 transition"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-[#102A43] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'
          }`}
        >
          Semua Topik ({educationCategories.length})
        </button>
        {educationCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#102A43] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Grid Categories */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={cat.href}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 group hover:-translate-y-1"
              >
                <div className="space-y-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: cat.bg, color: cat.color }}
                  >
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#102A43] group-hover:text-[#F28C38] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">{cat.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold" style={{ color: cat.color }}>
                  <span>Buka Panduan</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
          <p className="text-sm font-bold text-slate-600">Tidak ada materi edukasi yang cocok dengan kata kunci "{searchQuery}".</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#FFF1E6] text-[#F28C38] text-xs font-bold hover:bg-[#FFE3D0] transition"
          >
            Reset Pencarian
          </button>
        </div>
      )}
    </div>
  );
}
