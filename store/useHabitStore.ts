import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Habit, HabitLog, Streak, HabitFrequency, Niche } from '../types';
import { markHabitComplete, checkAndBreakStreak } from '../lib/streak';
import { deriveAvatarState } from '../lib/avatarState';
import { useAvatarStore } from './useAvatarStore';
import { useCoinStore } from './useCoinStore';
import { COIN_REWARDS } from '../lib/coinRewards';

interface HabitState {
  habits: Habit[];
  logs: Record<string, HabitLog[]>; // keyed by habitId
  streaks: Record<string, Streak>; // keyed by habitId
  loading: boolean;
  fetchHabits: (userId: string) => Promise<void>;
  createHabit: (userId: string, data: Pick<Habit, 'title' | 'frequency' | 'niche' | 'reward' | 'penalty'>) => Promise<Habit>;
  updateHabit: (id: string, data: Partial<Habit>) => Promise<void>;
  archiveHabit: (id: string) => Promise<void>;
  checkIn: (habitId: string, logData: Partial<HabitLog>) => Promise<Streak>;
  fetchLogsForHabit: (habitId: string) => Promise<void>;
  fetchStreaks: (userId: string) => Promise<void>;
  getStreakForHabit: (habitId: string) => Streak | undefined;
  todayLog: (habitId: string) => HabitLog | undefined;
}

const todayStr = () => new Date().toISOString().split('T')[0];

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  logs: {},
  streaks: {},
  loading: false,

  fetchHabits: async (userId) => {
    set({ loading: true });
    const { data } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .eq('archived', false)
      .order('created_at', { ascending: true });
    set({ habits: data ?? [], loading: false });
  },

  createHabit: async (userId, data) => {
    const { data: habit, error } = await supabase
      .from('habits')
      .insert({ user_id: userId, ...data, archived: false })
      .select()
      .single();
    if (error) throw error;
    set((state) => ({ habits: [...state.habits, habit] }));
    return habit;
  },

  updateHabit: async (id, data) => {
    await supabase.from('habits').update(data).eq('id', id);
    set((state) => ({
      habits: state.habits.map((h) => (h.id === id ? { ...h, ...data } : h)),
    }));
  },

  archiveHabit: async (id) => {
    await supabase.from('habits').update({ archived: true }).eq('id', id);
    set((state) => ({ habits: state.habits.filter((h) => h.id !== id) }));
  },

  checkIn: async (habitId, logData) => {
    const { data: log, error } = await supabase
      .from('habit_logs')
      .upsert(
        { habit_id: habitId, date: todayStr(), completed: true, ...logData },
        { onConflict: 'habit_id,date' }
      )
      .select()
      .single();
    if (error) throw error;

    set((state) => ({
      logs: {
        ...state.logs,
        [habitId]: [...(state.logs[habitId] ?? []).filter((l) => l.date !== todayStr()), log],
      },
    }));

    const streak = await markHabitComplete(habitId);
    const newStreaks = { ...get().streaks, [habitId]: streak };
    set({ streaks: newStreaks });

    // Sync avatar state based on updated streaks
    const newAvatarState = deriveAvatarState(newStreaks);
    useAvatarStore.getState().updateState(newAvatarState);

    // Award coins for habit completion
    const habit = get().habits.find((h) => h.id === habitId);
    if (habit) {
      const userId = habit.user_id;
      await useCoinStore.getState().earnCoins(userId, COIN_REWARDS.habitComplete);

      // Bonus if all habits completed today
      const allDone = get().habits.every((h) => {
        if (h.id === habitId) return true; // just completed
        return get().logs[h.id]?.some((l) => l.date === todayStr() && l.completed);
      });
      if (allDone && get().habits.length > 1) {
        await useCoinStore.getState().earnCoins(userId, COIN_REWARDS.allHabitsBonus);
      }

      // Streak milestone bonuses
      if (streak.current_streak === 7) {
        await useCoinStore.getState().earnCoins(userId, COIN_REWARDS.streakWeek);
      } else if (streak.current_streak === 30) {
        await useCoinStore.getState().earnCoins(userId, COIN_REWARDS.streakMonth);
      }
    }

    return streak;
  },

  fetchLogsForHabit: async (habitId) => {
    const { data } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('habit_id', habitId)
      .order('date', { ascending: false })
      .limit(90);
    set((state) => ({ logs: { ...state.logs, [habitId]: data ?? [] } }));
  },

  fetchStreaks: async (userId) => {
    const { habits } = get();
    const ids = habits.map((h) => h.id);
    if (!ids.length) return;
    const { data } = await supabase.from('streaks').select('*').in('habit_id', ids);
    const map: Record<string, Streak> = {};
    (data ?? []).forEach((s) => (map[s.habit_id] = s));
    set({ streaks: map });

    // Sync avatar state on load
    const newAvatarState = deriveAvatarState(map);
    useAvatarStore.getState().updateState(newAvatarState);
  },

  getStreakForHabit: (habitId) => get().streaks[habitId],

  todayLog: (habitId) =>
    get().logs[habitId]?.find((l) => l.date === todayStr()),
}));
