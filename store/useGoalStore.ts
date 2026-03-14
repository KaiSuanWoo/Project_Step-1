import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Goal } from '@/types';

interface GoalStoreState {
  goals: Goal[];
  loading: boolean;
  fetchGoals: (userId: string) => Promise<void>;
  createGoal: (userId: string, data: Pick<Goal, 'title' | 'description' | 'target_coins'>) => Promise<Goal>;
  updateGoal: (id: string, data: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  completeGoal: (id: string) => Promise<void>;
}

export const useGoalStore = create<GoalStoreState>((set, get) => ({
  goals: [],
  loading: false,

  fetchGoals: async (userId) => {
    set({ loading: true });
    const { data } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    set({ goals: (data as Goal[]) ?? [], loading: false });
  },

  createGoal: async (userId, data) => {
    const { data: goal, error } = await supabase
      .from('goals')
      .insert({ user_id: userId, ...data })
      .select()
      .single();
    if (error) throw error;
    set((state) => ({ goals: [goal as Goal, ...state.goals] }));
    return goal as Goal;
  },

  updateGoal: async (id, data) => {
    await supabase.from('goals').update(data).eq('id', id);
    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? { ...g, ...data } : g)),
    }));
  },

  deleteGoal: async (id) => {
    await supabase.from('goals').delete().eq('id', id);
    set((state) => ({ goals: state.goals.filter((g) => g.id !== id) }));
  },

  completeGoal: async (id) => {
    const now = new Date().toISOString();
    await supabase
      .from('goals')
      .update({ completed: true, completed_at: now })
      .eq('id', id);
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === id ? { ...g, completed: true, completed_at: now } : g
      ),
    }));
  },
}));
