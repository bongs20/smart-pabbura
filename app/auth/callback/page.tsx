'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { syncSupabaseSession } from '@/lib/storage';
import { getSupabaseClient } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = getSupabaseClient();
      if (supabase) {
        // Listen to auth state changes from hash token / PKCE exchange
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' || session?.user) {
            await syncSupabaseSession();
            router.replace('/dashboard');
          }
        });

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await syncSupabaseSession();
          router.replace('/dashboard');
          return () => subscription.unsubscribe();
        }
      }

      const user = await syncSupabaseSession();
      if (user) {
        router.replace('/dashboard');
      } else {
        setTimeout(async () => {
          const retryUser = await syncSupabaseSession();
          if (retryUser) {
            router.replace('/dashboard');
          } else {
            router.replace('/login');
          }
        }, 1200);
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col items-center justify-center p-4 text-[#102A43]">
      <div className="w-16 h-16 border-4 border-[#F28C38] border-t-[#102A43] rounded-full animate-spin mb-4 shadow-md" />
      <h2 className="text-xl font-black text-[#102A43] mb-2 tracking-tight">Memproses Login Google...</h2>
      <p className="text-sm text-slate-500 font-medium">Mohon tunggu sebentar, mengalihkan ke dashboard Anda.</p>
    </div>
  );
}
