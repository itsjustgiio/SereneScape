// app/LandingClient.tsx (Client Component)
'use client';

import { ArrowRight, SunMoon } from 'lucide-react';

export default function LandingClient() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 ">
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <SunMoon className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-headline font-bold text-foreground">SereneScape</h1>
        </div>
      </header>

      <main className="flex flex-col items-center">
        <SunMoon className="w-24 h-24 text-primary mb-8 animate-pulse" />
        <h2 className="text-5xl md:text-6xl font-headline font-bold text-foreground mb-6">
          Find Your Inner Peace
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10 font-body">
          Discover a world of calm with guided meditations, soothing soundscapes, and personalized affirmations. Your journey to mindfulness starts here.
        </p>
        <button
          onClick={() => {
            window.location.href = '/login';
          }}
          className="font-headline text-lg shadow-lg hover:shadow-xl transition-shadow duration-300 px-6 py-3 rounded bg-primary text-white flex items-center justify-center gap-2"
        >
          Enter SereneScape <ArrowRight className="h-5 w-5" />
        </button>
      </main>

      <footer className="absolute bottom-0 left-0 right-0 p-6 text-center text-sm text-muted-foreground font-body">
        &copy; {new Date().getFullYear()} SereneScape. All rights reserved.
      </footer>
    </div>
  );
}