'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Loader2, LogOut } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { getSiteUrl } from '@/lib/utils';

interface GoogleAuthProps {
  onAuthSuccess: () => void;
}

export default function GoogleAuth({ onAuthSuccess }: GoogleAuthProps) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) onAuthSuccess();
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) onAuthSuccess();
    });

    return () => subscription.unsubscribe();
  }, [onAuthSuccess]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getSiteUrl(),
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error('Google login error:', err);
      alert(
        'Google login failed: ' +
          err.message +
          '\n\nPlease enable Google OAuth in Supabase Dashboard:\nAuthentication → Providers → Google',
      );
    } finally {
      setLoading(false);
    }
  };

  // Temporary: Email/Password login as fallback
  const handleEmailLogin = async () => {
    const email = prompt('Enter email:');
    const password = prompt('Enter password:');

    if (!email || !password) return;

    setLoading(true);
    try {
      // Try to sign in first
      let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // If user doesn't exist, sign them up
      if (error?.message.includes('Invalid login credentials')) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        alert('Account created! Please check your email to verify.');
      } else if (error) {
        throw error;
      }
    } catch (err: any) {
      alert('Email login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-3 p-4 bg-card rounded-lg shadow-sm">
        <img
          src={user.user_metadata?.avatar_url ?? undefined}
          alt={user.user_metadata?.full_name ?? 'User'}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <p className="font-medium">{user.user_metadata?.full_name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <LogOut size={18} />}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-3xl font-bold text-center">Task Dashboard</h1>
        <Button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
