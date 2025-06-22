'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SunMoon } from 'lucide-react';
import { supabase } from '../../../../lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
    } else {
      if (data.session) {
        localStorage.setItem("supabase.access_token", data.session.access_token);
        localStorage.setItem("supabase.refresh_token", data.session.refresh_token);
      }

      if (data.user) {
        localStorage.setItem("serene.user.email", data.user.email || "");
        localStorage.setItem("serene.user.name", (data.user.user_metadata?.name as string) || "");
        localStorage.setItem("serene.user.id", data.user.id);
      }

      router.push("/dashboard");
    }
  } catch (err) {
    console.error(err);
    setError("Unexpected error occurred");
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <div className="flex items-center justify-center gap-2 mb-4">
            <SunMoon className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-headline font-bold text-foreground">SereneScape</h1>
          </div>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}