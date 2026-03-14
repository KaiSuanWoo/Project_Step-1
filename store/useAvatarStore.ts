import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Avatar, AvatarState } from '../types';

interface AvatarStoreState {
  avatar: Avatar | null;
  loading: boolean;
  fetchAvatar: (userId: string) => Promise<void>;
  updateState: (state: AvatarState) => Promise<void>;
  equipOutfit: (outfitId: string) => Promise<void>;
  updateCustomization: (data: Partial<Pick<Avatar, 'skin_tone' | 'hair_style' | 'hair_color'>>) => Promise<void>;
}

export const useAvatarStore = create<AvatarStoreState>((set, get) => ({
  avatar: null,
  loading: false,

  fetchAvatar: async (userId) => {
    set({ loading: true });
    const { data } = await supabase
      .from('avatars')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!data) {
      // Create default avatar on first load
      const { data: created } = await supabase
        .from('avatars')
        .insert({
          user_id: userId,
          base_type: 'default',
          animation_state: 'active',
          skin_tone: null,
          hair_style: null,
          hair_color: null,
          accessories: [],
        })
        .select()
        .single();
      set({ avatar: created as Avatar | null, loading: false });
    } else {
      set({ avatar: data as Avatar, loading: false });
    }
  },

  updateState: async (state) => {
    const { avatar } = get();
    if (!avatar) return;
    await supabase.from('avatars').update({ animation_state: state }).eq('id', avatar.id);
    set({ avatar: { ...avatar, animation_state: state } });
  },

  equipOutfit: async (outfitId) => {
    const { avatar } = get();
    if (!avatar) return;
    await supabase.from('avatars').update({ equipped_outfit: outfitId }).eq('id', avatar.id);
    set({ avatar: { ...avatar, equipped_outfit: outfitId } });
  },

  updateCustomization: async (data) => {
    const { avatar } = get();
    if (!avatar) return;
    await supabase.from('avatars').update(data).eq('id', avatar.id);
    set({ avatar: { ...avatar, ...data } });
  },
}));
