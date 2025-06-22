// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { CalmingBackground } from '@/components/CalmingBackground';

export const metadata: Metadata = {
  title: 'SereneScape',
  description: 'Find your calm. Your personal guide to mindfulness and relaxation.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <CalmingBackground />
        <div className="relative z-10 min-h-screen flex flex-col">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
