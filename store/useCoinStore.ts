import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface CoinStoreState {
  coins: number;
  fetchCoins: (userId: string) => Promise<void>;
  earnCoins: (userId: string, amount: number) => Promise<void>;
  spendCoins: (userId: string, amount: number) => Promise<boolean>;
}

export const useCoinStore = create<CoinStoreState>((set, get) => ({
  coins: 0,

  fetchCoins: async (userId) => {
    const { data } = await supabase
      .from('users')
      .select('tokens')
      .eq('id', userId)
      .single();
    if (data) set({ coins: data.tokens });
  },

  earnCoins: async (userId, amount) => {
    const current = get().coins;
    const newTotal = current + amount;
    const { error } = await supabase
      .from('users')
      .update({ tokens: newTotal })
      .eq('id', userId);
    if (!error) set({ coins: newTotal });
  },

  spendCoins: async (userId, amount) => {
    const current = get().coins;
    if (current < amount) return false;
    const newTotal = current - amount;
    const { error } = await supabase
      .from('users')
      .update({ tokens: newTotal })
      .eq('id', userId);
    if (!error) {
      set({ coins: newTotal });
      return true;
    }
    return false;
  },
}));
