import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Session } from '@supabase/supabase-js';

import { supabase, hasSupabaseConfig } from './supabase';
import { Dealer, getOrCreateDealer } from './db';

type AuthState = {
  ready: boolean;
  session: Session | null;
  userId: string | null;
  dealer: Dealer | null;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUpWithPassword: (args: { email: string; password: string; name?: string; phone?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  ensureDealer: (name: string) => Promise<Dealer>;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [dealer, setDealer] = useState<Dealer | null>(null);

  useEffect(() => {
    if (!hasSupabaseConfig) {
      setReady(true);
      return;
    }
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value: AuthState = useMemo(
    () => ({
      ready,
      session,
      userId: session?.user.id ?? null,
      dealer,
      async signInWithPassword(email, password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      },
      async signUpWithPassword({ email, password, name, phone }) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name, phone } },
        });
        if (error) throw error;
      },
      async signOut() {
        await supabase.auth.signOut();
        setDealer(null);
      },
      async ensureDealer(name) {
        if (!session?.user.id) throw new Error('not signed in');
        const d = await getOrCreateDealer(session.user.id, name);
        setDealer(d);
        return d;
      },
    }),
    [ready, session, dealer],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used inside <AuthProvider>');
  return v;
}
