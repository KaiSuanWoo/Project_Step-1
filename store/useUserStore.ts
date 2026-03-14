import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User, Niche } from '../types';

interface UserState {
  user: User | null;
  session: any | null;
  loading: boolean;
  setSession: (session: any) => void;
  fetchUser: () => Promise<void>;
  updateNiche: (niche: Niche) => Promise<void>;
  isPremium: () => boolean;
  signOut: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  session: null,
  loading: true,

  setSession: (session) => {
    set({ session });
    if (session) get().fetchUser();
    else set({ user: null, loading: false });
  },

  fetchUser: async () => {
    set({ loading: true });
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      set({ user: null, loading: false });
      return;
    }
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.session.user.id)
      .single();
    set({ user: data, loading: false });
  },

  updateNiche: async (niche) => {
    const { user } = get();
    if (!user) return;
    await supabase.from('users').update({ niche }).eq('id', user.id);
    set({ user: { ...user, niche } });
  },

  isPremium: () => {
    const { user } = get();
    if (!user) return false;
    if (user.subscription_tier === 'lifetime') return true;
    if (user.subscription_status !== 'active') return false;
    if (user.subscription_expires_at) {
      return new Date(user.subscription_expires_at) > new Date();
    }
    return true;
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));
