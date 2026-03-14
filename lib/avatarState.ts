import { AvatarState, Streak } from '../types';

/**
 * Derives avatar state from a user's streak data.
 *
 * Priority (highest to lowest):
 *   celebrating > sleeping > peak_form > degraded > active > slacking > idle
 *
 * Note: 'celebrating' is transient (triggered by checkIn, lasts 3s).
 *       It's never returned by this function — handled in the UI layer.
 */
export function deriveAvatarState(streaks: Record<string, Streak>): AvatarState {
  const values = Object.values(streaks);
  if (values.length === 0) return 'idle';

  const todayStr = new Date().toISOString().split('T')[0];
  const now = Date.now();

  // Check if ANY habit was completed today
  const completedToday = values.some((s) => s.last_completed === todayStr);

  // Check if ALL habits have 7+ day streaks (peak form)
  const allStreaksStrong = values.length > 0 && values.every((s) => s.current_streak >= 7);
  if (allStreaksStrong && completedToday) return 'peak_form';

  // Check for degraded: 3+ consecutive days with no completions
  const daysSinceAnyCompletion = values.reduce((min, s) => {
    if (!s.last_completed) return min;
    const days = Math.floor((now - new Date(s.last_completed).getTime()) / 86_400_000);
    return Math.min(min, days);
  }, Infinity);

  if (daysSinceAnyCompletion >= 3) return 'degraded';

  // Active: completed something today
  if (completedToday) return 'active';

  // Slacking: overdue habits (1+ day since last completion, streak > 0)
  const hasOverdue = values.some((s) => {
    if (!s.last_completed || s.current_streak === 0) return false;
    const daysSince = Math.floor((now - new Date(s.last_completed).getTime()) / 86_400_000);
    return daysSince >= 1;
  });

  if (hasOverdue) return 'slacking';

  // Default: idle (app open, no activity yet today)
  return 'idle';
}

/**
 * Check if current time is in sleeping hours (11pm - 7am).
 * If so, override state to 'sleeping'.
 */
export function applySleepOverride(state: AvatarState): AvatarState {
  const hour = new Date().getHours();
  if (hour >= 23 || hour < 7) return 'sleeping';
  return state;
}
