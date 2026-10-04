import type { EducationArticle, Notification, ChartDataPoint } from '@/types';

export const LABELS_HERO = [
  { label: 'Stomatitis Aftosa', color: '#FF6B35', bg: '#FFF0EB' },
  { label: 'Pabbura', color: '#1E3A5F', bg: '#EEF4FF' },
  { label: 'Pelembab Alami', color: '#22C55E', bg: '#F0FDF4' },
  { label: 'Sensor Aktif', color: '#8B5CF6', bg: '#F5F3FF' },
];

export const demoUser = {
  id: '1',
  name: 'Nurul A.',
  status: 'Sehat' as const,
};

export const phChartData: ChartDataPoint[] = [
  { label: '18 Mei', value: 5.8 },
  { label: '19 Mei', value: 6.0 },
  { label: '20 Mei', value: 6.2 },
  { label: '21 Mei', value: 6.1 },
  { label: '22 Mei', value: 6.5 },
  { label: '23 Mei', value: 6.7 },
  { label: '24 Mei', value: 6.6 },
  { label: '28 Mei', value: 6.8 },
];

export const healingProgressData: ChartDataPoint[] = [
  { label: 'Hari 1', value: 10, secondary: 10 },
  { label: 'Hari 3', value: 7, secondary: 7 },
  { label: 'Hari 5', value: 5, secondary: 5 },
  { label: 'Hari 7', value: 8, secondary: 8 },
  { label: 'Hari 10', value: 5, secondary: 5 },
  { label: 'Hari 14', value: 2, secondary: 2 },
];

export const painProgressData: ChartDataPoint[] = [
  { label: '24 Mei', value: 7 },
  { label: '25 Mei', value: 6 },
  { label: '26 Mei', value: 5 },
  { label: '27 Mei', value: 4 },
  { label: '28 Mei', value: 3 },
];

export const ulcerSizeData: ChartDataPoint[] = [
  { label: '24 Mei', value: 1.2 },
  { label: '25 Mei', value: 1.0 },
  { label: '26 Mei', value: 0.8 },
  { label: '27 Mei', value: 0.7 },
  { label: '28 Mei', value: 0.5 },
];

export const notifications: Notification[] = [
  {
    id: '1',
    title: 'Reminder Lozenges Turate',
    description: 'Reminder minum lozenges Turate sesuai jadwal dosis Anda.',
    time: '08:30 AM',
    type: 'dose',
    read: false,
  },
  {
    id: '2',
    title: 'Edukasi Gizi',
    description: 'Rekomendasi nutrisi dan lozenges flavonoid untuk kesehatan mulut.',
    time: '08:30 AM',
    type: 'education',
    read: false,
  },
  {
    id: '3',
    title: 'Notifikasi',
    description: 'Measurement harian terdeteksi. Periksa status mulut Anda.',
    time: '06:30 AM',
    type: 'measurement',
    read: true,
  },
];

export const educationArticles: EducationArticle[] = [
  {
    id: '1',
    title: 'Panduan Kesehatan Mulut',
    description: 'Nutrisi penting untuk menjaga kesehatan mulut setiap hari.',
    icon: 'tooth',
    category: 'Kesehatan',
    href: '/oral-health',
  },
  {
    id: '2',
    title: 'Edukasi Gizi',
    description: 'Nutrisi dan infografis untuk kesehatan mulut dan penyembuhan luka.',
    icon: 'leaf',
    category: 'Gizi',
    href: '/lifestyle',
  },
  {
    id: '3',
    title: 'Flavonoid Alami',
    description: 'Flavonoid alami dari Carthamus tinctorius L. untuk kesehatan mulut.',
    icon: 'flask',
    category: 'Penelitian',
    href: '/oral-health',
  },
  {
    id: '4',
    title: 'Video Edukasi Gizi',
    description: 'Video dan infografis edukasi kesehatan mulut Anda.',
    icon: 'video',
    category: 'Video',
    href: '/lifestyle',
  },
  {
    id: '5',
    title: 'Notifikasi',
    description: 'Rekomendasi untuk Anda.',
    icon: 'bell',
    category: 'Info',
    href: '/notifications',
  },
];

export const oralHealthCards = [
  {
    id: '1',
    title: 'Turate Lozenges',
    description: 'Lozenges dengan ekstrak lokal terstandardisasi membantu menyembuhkan stomatitis.',
    icon: 'pill',
    color: '#FF6B35',
  },
  {
    id: '2',
    title: 'Pencegahan Komplikasi',
    description: 'Cegah komplikasi stomatitis, termasuk infeksi sekunder dan luka kronis.',
    icon: 'shield',
    color: '#1E3A5F',
  },
  {
    id: '3',
    title: 'Diet Ramah Mukosa',
    description: 'Makanan dan minuman yang lembut dan tidak iritan untuk mempercepat penyembuhan.',
    icon: 'salad',
    color: '#22C55E',
  },
  {
    id: '4',
    title: 'Edukasi Mikrobioma',
    description: 'Jaga keseimbangan mikrobioma mulut Anda.',
    icon: 'microscope',
    color: '#8B5CF6',
  },
];

export const lifestyleCards = [
  {
    id: '1',
    title: 'Rekomendasi Makan Sehat',
    description: 'Pola makan sehat untuk mendukung kesehatan mulut yang optimal.',
    icon: 'utensils',
    color: '#FF6B35',
  },
  {
    id: '2',
    title: 'Manajemen Stres',
    description: 'Kelola stres untuk membantu mempercepat penyembuhan luka dan kesehatan mulut.',
    icon: 'brain',
    color: '#6366F1',
  },
  {
    id: '3',
    title: 'Sleep Tracking',
    description: 'Tidur cukup untuk mendukung gaya hidup sehat dan pemulihan jaringan.',
    icon: 'moon',
    color: '#0EA5E9',
  },
];
