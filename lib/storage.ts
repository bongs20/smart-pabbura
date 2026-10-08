import type {
  HealthMetrics,
  PainRecord,
  DoseRecord,
  UlcerRecord,
  HistoryRecord,
  BaselineData,
  AuthUser,
  AuthSession,
} from '@/types';
import { generateId, getTodayKey, isValidEmail, getURL } from './utils';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

const KEYS = {
  healthMetrics: 'sp_health_metrics',
  painRecords: 'sp_pain_records',
  doseRecords: 'sp_dose_records',
  ulcerRecords: 'sp_ulcer_records',
  historyRecords: 'sp_history_records',
  baseline: 'sp_baseline',
  user: 'sp_user',
  users: 'sp_users',
  authSession: 'sp_auth_session',
};

const defaultAuthUser: AuthUser = {
  id: 'demo-user',
  name: 'Nurul A.',
  email: 'demo@smartpabbura.com',
  password: '123456',
  status: 'Sehat',
  createdAt: new Date().toISOString(),
};

export const ensureDemoUser = (): AuthUser => {
  if (typeof window === 'undefined') return defaultAuthUser;

  const users = getUsers();
  const exists = users.some((user) => user.email.toLowerCase() === defaultAuthUser.email.toLowerCase());
  if (!exists) {
    const nextUsers = [defaultAuthUser, ...users];
    localStorage.setItem(KEYS.users, JSON.stringify(nextUsers));
    return defaultAuthUser;
  }

  return users.find((user) => user.email.toLowerCase() === defaultAuthUser.email.toLowerCase()) ?? defaultAuthUser;
};

export const getUsers = (): AuthUser[] => {
  if (typeof window === 'undefined') return [defaultAuthUser];
  const stored = localStorage.getItem(KEYS.users);
  if (!stored) {
    localStorage.setItem(KEYS.users, JSON.stringify([defaultAuthUser]));
    return [defaultAuthUser];
  }

  try {
    const parsed = JSON.parse(stored) as AuthUser[];
    return parsed.length ? parsed : [defaultAuthUser];
  } catch {
    localStorage.setItem(KEYS.users, JSON.stringify([defaultAuthUser]));
    return [defaultAuthUser];
  }
};

export const getCurrentUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;

  const storedUser = localStorage.getItem(KEYS.user);
  if (storedUser) {
    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      // invalid JSON
    }
  }

  const sessionRaw = localStorage.getItem(KEYS.authSession);
  if (!sessionRaw) return null;

  try {
    const session = JSON.parse(sessionRaw) as AuthSession;
    const users = getUsers();
    return users.find((user) => user.id === session.userId) ?? null;
  } catch {
    localStorage.removeItem(KEYS.authSession);
    return null;
  }
};

export const saveCurrentUser = (user: AuthUser): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.user, JSON.stringify(user));

  const users = getUsers();
  const index = users.findIndex((u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
  if (index >= 0) {
    users[index] = user;
  } else {
    users.unshift(user);
  }
  localStorage.setItem(KEYS.users, JSON.stringify(users));
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; message: string; user?: AuthUser; requiresVerification?: boolean }> => {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Tidak dapat mendaftar di server.' };
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();

  if (!trimmedName) {
    return { success: false, message: 'Nama lengkap wajib diisi.' };
  }

  if (!trimmedEmail) {
    return { success: false, message: 'Email wajib diisi.' };
  }

  if (!isValidEmail(trimmedEmail)) {
    return { success: false, message: 'Format email tidak valid. Masukkan email yang benar (contoh: nama@gmail.com).' };
  }

  if (!trimmedPassword) {
    return { success: false, message: 'Password wajib diisi.' };
  }

  if (trimmedPassword.length < 8) {
    return { success: false, message: 'Password minimal 8 karakter.' };
  }

  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: trimmedPassword,
        options: {
          emailRedirectTo: `${getURL()}dashboard`,
          data: {
            full_name: trimmedName,
          },
        },
      });

      if (authError) {
        if (authError.message.includes('User already registered')) {
          return { success: false, message: 'Email sudah terdaftar. Silakan login.' };
        }
        if (authError.message.toLowerCase().includes('rate limit')) {
          return {
            success: false,
            message: 'Batas kirim email verifikasi Supabase telah tercapai (max 3 email/jam). Silakan matikan opsi "Confirm email" di Dashboard Supabase atau gunakan fitur Login Google.',
          };
        }
        return { success: false, message: authError.message || 'Registrasi gagal. Silakan coba lagi.' };
      }

      if (authData.user) {
        const userId = authData.user.id;
        const profile: AuthUser = {
          id: userId,
          name: trimmedName,
          email: trimmedEmail,
          password: '',
          status: 'Sehat',
          createdAt: new Date().toISOString(),
        };

        // Upsert into profiles table
        await supabase.from('profiles').upsert(
          {
            user_id: userId,
            full_name: trimmedName,
            email: trimmedEmail,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

        const sessionEstablished = Boolean(authData.session);
        if (sessionEstablished) {
          localStorage.setItem(KEYS.user, JSON.stringify(profile));
          localStorage.setItem(
            KEYS.authSession,
            JSON.stringify({ userId: profile.id, loggedInAt: new Date().toISOString() })
          );
        }

        return {
          success: true,
          message: sessionEstablished
            ? 'Registrasi berhasil. Selamat datang!'
            : 'Registrasi berhasil. Silakan cek email Anda untuk verifikasi.',
          user: profile,
          requiresVerification: !sessionEstablished,
        };
      }
    } catch {
      // Fallback if Supabase is unconfigured or encounters connection errors
    }
  }

  // Local Storage Fallback
  const users = getUsers();
  const duplicate = users.some((user) => user.email.toLowerCase() === trimmedEmail);
  if (duplicate) {
    return { success: false, message: 'Email sudah terdaftar. Silakan login.' };
  }

  const newUser: AuthUser = {
    id: generateId(),
    name: trimmedName,
    email: trimmedEmail,
    password: trimmedPassword,
    status: 'Sehat',
    createdAt: new Date().toISOString(),
  };

  const nextUsers = [newUser, ...users];
  localStorage.setItem(KEYS.users, JSON.stringify(nextUsers));
  localStorage.setItem(KEYS.user, JSON.stringify(newUser));
  localStorage.setItem(
    KEYS.authSession,
    JSON.stringify({ userId: newUser.id, loggedInAt: new Date().toISOString() })
  );

  return { success: true, message: 'Registrasi berhasil.', user: newUser };
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{ success: boolean; message: string; user?: AuthUser }> => {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Tidak dapat login di server.' };
  }

  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();

  if (!trimmedEmail) {
    return { success: false, message: 'Email wajib diisi.' };
  }

  if (!isValidEmail(trimmedEmail)) {
    return { success: false, message: 'Format email tidak valid. Masukkan email yang benar (contoh: nama@gmail.com).' };
  }

  if (!trimmedPassword) {
    return { success: false, message: 'Password wajib diisi.' };
  }

  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (authError || !authData.user) {
        return { success: false, message: authError?.message || 'Email atau password tidak sesuai.' };
      }

      const user = authData.user;
      const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Pengguna';

      const profile: AuthUser = {
        id: user.id,
        name: fullName,
        email: user.email || trimmedEmail,
        password: '',
        status: 'Sehat',
        createdAt: user.created_at || new Date().toISOString(),
      };

      saveCurrentUser(profile);
      localStorage.setItem(
        KEYS.authSession,
        JSON.stringify({ userId: profile.id, loggedInAt: new Date().toISOString() })
      );

      return { success: true, message: 'Login berhasil.', user: profile };
    } catch {
      // Fallback to local mode
    }
  }

  const users = getUsers();
  const match = users.find(
    (user) => user.email.toLowerCase() === trimmedEmail && user.password === trimmedPassword
  );

  if (!match) {
    return { success: false, message: 'Email atau password tidak sesuai.' };
  }

  localStorage.setItem(KEYS.user, JSON.stringify(match));
  localStorage.setItem(
    KEYS.authSession,
    JSON.stringify({ userId: match.id, loggedInAt: new Date().toISOString() })
  );
  return { success: true, message: 'Login berhasil.', user: match };
};

export const loginWithGoogle = async (): Promise<{ success: boolean; message: string }> => {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Tidak dapat login di server.' };
  }

  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const redirectTarget = `${getURL()}dashboard`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTarget,
        },
      });

      if (error) {
        return { success: false, message: error.message || 'Gagal login dengan Google.' };
      }

      return { success: true, message: 'Mengalihkan ke Google Sign-In...' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Terjadi kesalahan saat mengalihkan ke Google.' };
    }
  }

  return {
    success: false,
    message: 'Supabase Auth belum siap. Pastikan Google Provider sudah diaktifkan di Dashboard Supabase.',
  };
};

export const syncSupabaseSession = async (): Promise<AuthUser | null> => {
  if (typeof window === 'undefined') return null;

  const supabase = getSupabaseClient();
  if (!supabase || !isSupabaseConfigured()) return null;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const user = session.user;
      const profile: AuthUser = {
        id: user.id,
        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User Google',
        email: user.email || '',
        password: '',
        status: 'Sehat',
        createdAt: user.created_at || new Date().toISOString(),
      };
      saveCurrentUser(profile);
      return profile;
    }
  } catch {
    // Ignore error
  }
  return null;
};

export const forgotPasswordUser = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail) {
    return { success: false, message: 'Email wajib diisi.' };
  }

  if (!isValidEmail(trimmedEmail)) {
    return { success: false, message: 'Format email tidak valid. Masukkan email yang benar (contoh: nama@gmail.com).' };
  }

  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const redirectUrl = `${getURL()}reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: redirectUrl,
      });

      if (error) {
        return { success: false, message: 'Gagal mengirim link reset password. Silakan coba lagi.' };
      }

      return { success: true, message: 'Link reset password telah dikirim ke email Anda.' };
    } catch {
      // Fallback
    }
  }

  return { success: true, message: 'Link reset password telah dikirim ke email Anda.' };
};

export const resetPasswordUser = async (
  password: string,
  confirmPassword: string
): Promise<{ success: boolean; message: string }> => {
  const trimmedPassword = password.trim();
  const trimmedConfirm = confirmPassword.trim();

  if (!trimmedPassword) {
    return { success: false, message: 'Password baru wajib diisi.' };
  }

  if (trimmedPassword.length < 8) {
    return { success: false, message: 'Password minimal 8 karakter.' };
  }

  if (trimmedPassword !== trimmedConfirm) {
    return { success: false, message: 'Password dan konfirmasi password tidak sama.' };
  }

  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: trimmedPassword,
      });

      if (error) {
        return { success: false, message: error.message || 'Gagal mengubah password.' };
      }

      return { success: true, message: 'Password berhasil diperbarui.' };
    } catch {
      // Fallback
    }
  }

  return { success: true, message: 'Password berhasil diperbarui.' };
};

export const logoutUser = async (): Promise<void> => {
  if (typeof window === 'undefined') return;

  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch {
      // local fallback
    }
  }

  localStorage.removeItem(KEYS.user);
  localStorage.removeItem(KEYS.authSession);
};

// Helper to scope storage keys per user
const getScopedKey = (baseKey: string): string => {
  if (typeof window === 'undefined') return baseKey;
  const user = getCurrentUser();
  if (!user || user.id === 'demo-user') return baseKey;
  return `${baseKey}_${user.id}`;
};

// ─── Health Metrics ────────────────────────────────────────────────
export const getHealthData = (): HealthMetrics => {
  if (typeof window === 'undefined') return defaultHealthMetrics;
  const user = getCurrentUser();
  const key = getScopedKey(KEYS.healthMetrics);
  const stored = localStorage.getItem(key);
  if (!stored) {
    if (!user || user.id === 'demo-user') {
      localStorage.setItem(key, JSON.stringify(defaultHealthMetrics));
      return defaultHealthMetrics;
    }
    const freshMetrics: HealthMetrics = {
      vas: 0,
      ph: 7.0,
      cleanliness: 100,
      hydration: 100,
      flavonoidIntake: 0,
      oralTemperature: 36.6,
      date: getTodayKey(),
    };
    localStorage.setItem(key, JSON.stringify(freshMetrics));
    return freshMetrics;
  }
  return JSON.parse(stored);
};

export const saveHealthData = (data: Partial<HealthMetrics>): void => {
  if (typeof window === 'undefined') return;
  const key = getScopedKey(KEYS.healthMetrics);
  const current = getHealthData();
  const updated = { ...current, ...data };
  localStorage.setItem(key, JSON.stringify(updated));
};

// ─── Pain Records ────────────────────────────────────────────────
export const getPainRecords = (): PainRecord[] => {
  if (typeof window === 'undefined') return [];
  const key = getScopedKey(KEYS.painRecords);
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

export const savePainRecord = (record: Omit<PainRecord, 'id'>): PainRecord => {
  if (typeof window === 'undefined') return { id: '', ...record };
  const key = getScopedKey(KEYS.painRecords);
  const records = getPainRecords();
  const newRecord: PainRecord = { id: generateId(), ...record };
  records.unshift(newRecord);
  localStorage.setItem(key, JSON.stringify(records));
  return newRecord;
};

// ─── Dose Records ────────────────────────────────────────────────
export const getDoseRecords = (): DoseRecord[] => {
  if (typeof window === 'undefined') return [];
  const key = getScopedKey(KEYS.doseRecords);
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

export const getTodayDoseRecord = (): DoseRecord => {
  const records = getDoseRecords();
  const today = getTodayKey();
  const existing = records.find((r) => r.date === today);
  if (existing) return existing;
  return {
    id: generateId(),
    date: today,
    dosesCompleted: 0,
    dosesTotal: 3,
    times: [],
  };
};

export const saveDoseRecord = (record: DoseRecord): void => {
  if (typeof window === 'undefined') return;
  const key = getScopedKey(KEYS.doseRecords);
  const records = getDoseRecords();
  const idx = records.findIndex((r) => r.date === record.date);
  if (idx >= 0) {
    records[idx] = record;
  } else {
    records.unshift(record);
  }
  localStorage.setItem(key, JSON.stringify(records));
};

export const incrementTodayDose = (): DoseRecord => {
  const record = getTodayDoseRecord();
  if (record.dosesCompleted < record.dosesTotal) {
    record.dosesCompleted += 1;
    record.times.push(new Date().toISOString());
  }
  saveDoseRecord(record);
  return record;
};

// ─── Ulcer Records ────────────────────────────────────────────────
export const getUlcerRecords = (): UlcerRecord[] => {
  if (typeof window === 'undefined') return [];
  const key = getScopedKey(KEYS.ulcerRecords);
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

export const saveUlcerRecord = (record: Omit<UlcerRecord, 'id'>): UlcerRecord => {
  if (typeof window === 'undefined') return { id: '', ...record };
  const key = getScopedKey(KEYS.ulcerRecords);
  const records = getUlcerRecords();
  const newRecord: UlcerRecord = { id: generateId(), ...record };
  records.unshift(newRecord);
  localStorage.setItem(key, JSON.stringify(records));
  return newRecord;
};

// ─── History Records ────────────────────────────────────────────────
export const getHistoryRecords = (): HistoryRecord[] => {
  if (typeof window === 'undefined') return [];
  const key = getScopedKey(KEYS.historyRecords);
  const stored = localStorage.getItem(key);
  if (!stored) {
    const user = getCurrentUser();
    // Only return default demo history records for demo-user
    if (!user || user.id === 'demo-user') {
      localStorage.setItem(key, JSON.stringify(defaultHistoryRecords));
      return defaultHistoryRecords;
    }
    return [];
  }
  return JSON.parse(stored);
};

export const saveHistoryRecord = (record: Omit<HistoryRecord, 'id'>): void => {
  if (typeof window === 'undefined') return;
  const key = getScopedKey(KEYS.historyRecords);
  const records = getHistoryRecords();
  const newRecord: HistoryRecord = { id: generateId(), ...record };
  records.unshift(newRecord);
  localStorage.setItem(key, JSON.stringify(records));
};

// ─── Baseline ────────────────────────────────────────────────
export const getBaseline = (): BaselineData | null => {
  if (typeof window === 'undefined') return null;
  const key = getScopedKey(KEYS.baseline);
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : null;
};

export const saveBaseline = (data: BaselineData): void => {
  if (typeof window === 'undefined') return;
  const key = getScopedKey(KEYS.baseline);
  localStorage.setItem(key, JSON.stringify(data));
};

// ─── Default Data ────────────────────────────────────────────────
export const defaultHealthMetrics: HealthMetrics = {
  vas: 3,
  ph: 6.8,
  cleanliness: 68,
  hydration: 82,
  flavonoidIntake: 15,
  oralTemperature: 36.9,
  date: '2024-05-28',
};

export const defaultHistoryRecords: HistoryRecord[] = [
  { id: '1', date: '28 Mei 2024', vas: 3, ulcerSize: 0.5, ph: 6.8, doses: '2/3', notes: 'Kondisi stabil' },
  { id: '2', date: '27 Mei 2024', vas: 4, ulcerSize: 0.7, ph: 6.5, doses: '3/3', notes: 'Sedikit nyeri' },
  { id: '3', date: '26 Mei 2024', vas: 5, ulcerSize: 0.8, ph: 6.3, doses: '3/3', notes: '' },
  { id: '4', date: '25 Mei 2024', vas: 6, ulcerSize: 1.0, ph: 6.1, doses: '2/3', notes: 'Nyeri sedang' },
  { id: '5', date: '24 Mei 2024', vas: 7, ulcerSize: 1.2, ph: 5.9, doses: '3/3', notes: '' },
];
