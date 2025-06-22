'use client'

// app/page.tsx (Server Component)
import { redirect, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase/client';

import LandingClient from './LandingClient'; // import the client component
import { useEffect } from 'react';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        router.push('/dashboard');
      }
    });

    // Cleanup listener on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  return <LandingClient />;
}