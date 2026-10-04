import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import BottomNavigation from '@/components/layout/BottomNavigation';
import QuickActionSheet from '@/components/layout/QuickActionSheet';
import AuthGuard from '@/components/layout/AuthGuard';
import ConditionalShell from '@/components/layout/ConditionalShell';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Smart-Pabbura System',
  description: 'Solusi Stomatitis Pintar & Terukur — Turate Denti Lozenges',
  keywords: ['Smart-Pabbura System', 'Turate Denti Lozenges', 'Stomatitis', 'PWA'],
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    title: 'Smart-Pabbura System',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

import { ToastProvider } from '@/components/ui/Toast';
import { SoundProvider } from '@/components/providers/SoundProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="antialiased">
        <SoundProvider>
          <ToastProvider>
            <AuthGuard>
              <ConditionalShell>
                {children}
              </ConditionalShell>
            </AuthGuard>
          </ToastProvider>
        </SoundProvider>
      </body>
    </html>
  );
}
