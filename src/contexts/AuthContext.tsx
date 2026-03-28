import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, DEFAULT_AVATAR_URL } from '../lib/supabase';

export interface UserProfile {
  id: string;
  fullName: string;
  avatarUrl: string;
  membershipStatus: string | null;
  role: string | null;
  isBlocked: boolean;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, avatar_url, membership_status, role, is_blocked')
      .eq('id', userId)
      .single();

    if (!data) return null;

    const fullName = data.full_name || 'User';
    return {
      id: userId,
      fullName,
      avatarUrl: data.avatar_url || `${DEFAULT_AVATAR_URL}${encodeURIComponent(fullName)}`,
      membershipStatus: data.membership_status,
      role: data.role,
      isBlocked: data.is_blocked ?? false,
    };
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        const p = await fetchProfile(s.user.id);
        setProfile(p);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s);
      if (s?.user) {
        const p = await fetchProfile(s.user.id);
        setProfile(p);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthState => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
