'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser } from '@/lib/storage';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';

const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      const isAuthPage = AUTH_ROUTES.some((route) => pathname.startsWith(route));
      let currentUser = getCurrentUser();

      // Check Supabase session if configured
      const supabase = getSupabaseClient();
      if (supabase && isSupabaseConfigured()) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session && currentUser && currentUser.id !== 'demo-user') {
            // session expired in Supabase
            currentUser = null;
          }
        } catch {
          // ignore session fetch errors
        }
      }

      if (!isMounted) return;

      if (!currentUser) {
        // User not logged in
        if (!isAuthPage) {
          router.replace('/login');
          return;
        }
      } else {
        // User is logged in
        if (isAuthPage) {
          router.replace('/dashboard');
          return;
        }
      }

      setChecking(false);
    };

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  const isAuthPage = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (checking && !isAuthPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F9FC]">
        <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF1E6] flex items-center justify-center text-3xl">
            🦷
          </div>
          <div className="w-7 h-7 border-3 border-[#F28C38] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-[#102A43]">Memeriksa Sesi Sektor Smart-Pabbura...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
