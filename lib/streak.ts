import { supabase } from './supabase';
import { Streak } from '../types';

const today = () => new Date().toISOString().split('T')[0];
const yesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

export async function getStreak(habitId: string): Promise<Streak | null> {
  const { data } = await supabase
    .from('streaks')
    .select('*')
    .eq('habit_id', habitId)
    .single();
  return data;
}

export async function markHabitComplete(habitId: string): Promise<Streak> {
  const todayStr = today();
  const streak = await getStreak(habitId);

  if (!streak) {
    const { data, error } = await supabase
      .from('streaks')
      .insert({ habit_id: habitId, current_streak: 1, longest_streak: 1, last_completed: todayStr })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // Already completed today
  if (streak.last_completed === todayStr) return streak;

  const isConsecutive = streak.last_completed === yesterday();
  const newCurrent = isConsecutive ? streak.current_streak + 1 : 1;
  const newLongest = Math.max(newCurrent, streak.longest_streak);

  const { data, error } = await supabase
    .from('streaks')
    .update({ current_streak: newCurrent, longest_streak: newLongest, last_completed: todayStr })
    .eq('id', streak.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function checkAndBreakStreak(habitId: string): Promise<void> {
  const streak = await getStreak(habitId);
  if (!streak || streak.current_streak === 0) return;

  const daysSinceLastComplete = streak.last_completed
    ? Math.floor((Date.now() - new Date(streak.last_completed).getTime()) / 86400000)
    : Infinity;

  if (daysSinceLastComplete > 1) {
    await supabase
      .from('streaks')
      .update({ current_streak: 0 })
      .eq('id', streak.id);
  }
}
