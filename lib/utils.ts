import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Strict email format validation regex (e.g. name@domain.com / name@domain.co.id)
export const STRICT_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function isValidEmail(email: string): boolean {
  return STRICT_EMAIL_REGEX.test(email.trim().toLowerCase());
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  });
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatCountdown(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [
    h.toString().padStart(2, '0'),
    m.toString().padStart(2, '0'),
    s.toString().padStart(2, '0'),
  ].join(':');
}

export function formatCountdownWords(seconds: number): string {
  if (seconds <= 0) return 'waktunya dosis';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h} jam ${m} mnt lagi`;
  if (m > 0) return `${m} mnt ${s} dtk lagi`;
  return `${s} dtk lagi`;
}

export function getVASLabel(vas: number): string {
  if (vas === 0) return 'Tidak Nyeri';
  if (vas <= 3) return 'Nyeri Ringan';
  if (vas <= 6) return 'Nyeri Sedang';
  if (vas <= 9) return 'Nyeri Berat';
  return 'Nyeri Tak Tertahankan';
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
