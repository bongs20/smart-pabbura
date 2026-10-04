'use client';

import React, { useState } from 'react';
import { Bell, BookOpen, Check, CheckCheck, Info, Sparkles, Trash2 } from 'lucide-react';
import { notifications as defaultNotifications } from '@/lib/data';
import type { Notification } from '@/types';

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>(defaultNotifications);

  const toggleRead = (id: string) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const markAllAsRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setItems([]);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1E6] text-[#F28C38] text-xs font-bold mb-2">
            <Bell size={14} />
            <span>Pemberitahuan Sistem</span>
          </div>
          <h1 className="text-2xl font-black text-[#102A43]">Notifikasi</h1>
          <p className="text-xs text-slate-500 mt-0.5">Reminder jadwal dosis, edukasi gizi, dan pemantauan</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllAsRead}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#102A43] text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <CheckCheck size={16} />
            <span>Tandai Semua Dibaca</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        {items.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Bell size={36} className="mx-auto text-slate-300" />
            <p className="text-sm font-semibold">Tidak ada notifikasi saat ini.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((n) => {
              const isDose = n.type === 'dose';
              const isEdu = n.type === 'education';

              return (
                <div
                  key={n.id}
                  onClick={() => toggleRead(n.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                    !n.read
                      ? 'bg-[#FFF1E6]/40 border-orange-200/80 shadow-2xs'
                      : 'bg-slate-50/60 border-slate-100 opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        isDose
                          ? 'bg-[#FFF1E6] text-[#F28C38]'
                          : isEdu
                          ? 'bg-[#EEF7FC] text-[#2F80B7]'
                          : 'bg-[#EAF7EE] text-[#22C55E]'
                      }`}
                    >
                      {isDose ? <Bell size={18} /> : isEdu ? <BookOpen size={18} /> : <Info size={18} />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-extrabold text-[#102A43]">{n.title}</h3>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-[#F28C38]" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{n.description}</p>
                      <span className="text-[10px] font-bold text-slate-400 block pt-1">
                        {n.time}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRead(n.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-colors"
                    aria-label="Tandai status dibaca"
                  >
                    <Check size={16} className={n.read ? 'text-green-500' : 'text-slate-300'} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
