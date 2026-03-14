import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { ShopItem, UserInventory } from '@/types';
import { useCoinStore } from './useCoinStore';

interface ShopStoreState {
  items: ShopItem[];
  inventory: UserInventory[];
  loading: boolean;
  fetchShopItems: () => Promise<void>;
  fetchInventory: (userId: string) => Promise<void>;
  purchaseItem: (userId: string, item: ShopItem) => Promise<boolean>;
  equipItem: (inventoryId: string) => Promise<void>;
  unequipItem: (inventoryId: string) => Promise<void>;
  ownsItem: (itemId: string) => boolean;
}

export const useShopStore = create<ShopStoreState>((set, get) => ({
  items: [],
  inventory: [],
  loading: false,

  fetchShopItems: async () => {
    set({ loading: true });
    const { data } = await supabase
      .from('shop_items')
      .select('*')
      .order('price', { ascending: true });
    set({ items: (data as ShopItem[]) ?? [], loading: false });
  },

  fetchInventory: async (userId) => {
    const { data } = await supabase
      .from('user_inventory')
      .select('*')
      .eq('user_id', userId);
    set({ inventory: (data as UserInventory[]) ?? [] });
  },

  purchaseItem: async (userId, item) => {
    const success = await useCoinStore.getState().spendCoins(userId, item.price);
    if (!success) return false;

    const { data, error } = await supabase
      .from('user_inventory')
      .insert({ user_id: userId, item_id: item.id, equipped: false })
      .select()
      .single();

    if (!error && data) {
      set({ inventory: [...get().inventory, data as UserInventory] });
      return true;
    }
    return false;
  },

  equipItem: async (inventoryId) => {
    await supabase
      .from('user_inventory')
      .update({ equipped: true })
      .eq('id', inventoryId);
    set({
      inventory: get().inventory.map((i) =>
        i.id === inventoryId ? { ...i, equipped: true } : i
      ),
    });
  },

  unequipItem: async (inventoryId) => {
    await supabase
      .from('user_inventory')
      .update({ equipped: false })
      .eq('id', inventoryId);
    set({
      inventory: get().inventory.map((i) =>
        i.id === inventoryId ? { ...i, equipped: false } : i
      ),
    });
  },

  ownsItem: (itemId) => {
    return get().inventory.some((i) => i.item_id === itemId);
  },
}));
