// TypeScript interfaces for SmartPabbura System

export interface User {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  status: 'Sehat' | 'Perlu Perhatian' | 'Kritis';
  avatar?: string;
  email?: string;
  password?: string;
  createdAt?: string;
}

export interface AuthUser extends User {
  email: string;
  password: string;
  createdAt: string;
}

export interface AuthSession {
  userId: string;
  loggedInAt: string;
}

export interface HealthMetrics {
  vas: number; // 0-10 pain scale
  ph: number; // 0-14
  cleanliness: number; // 0-100 percentage
  hydration: number; // 0-100 percentage
  flavonoidIntake: number; // in mg
  oralTemperature: number; // in Celsius
  date: string; // ISO date string
}

export interface PainRecord {
  id: string;
  date: string;
  vas: number;
  ulcerSize: number; // in cm
  condition: 'Lebih baik' | 'Sama' | 'Lebih buruk';
  notes?: string;
}

export interface DoseRecord {
  id: string;
  date: string; // YYYY-MM-DD
  dosesCompleted: number;
  dosesTotal: number;
  times: string[]; // Array of ISO timestamps when dose was taken
}

export interface UlcerRecord {
  id: string;
  date: string;
  imageUrl?: string;
  size?: number; // cm
  durationDays?: number;
  notes?: string;
}

export interface HistoryRecord {
  id: string;
  date: string;
  vas: number;
  ulcerSize: number;
  ph: number;
  doses: string; // e.g. "2/3"
  notes?: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'dose' | 'education' | 'measurement' | 'alert';
  read: boolean;
}

export interface EducationArticle {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  href: string;
}

export interface BaselineData {
  step: number;
  vas: number;
  ulcerSize: number;
  durationDays: number;
  condition: string;
  completed: boolean;
  startDate: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondary?: number;
}

export interface QuickActionItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  color: string;
}
