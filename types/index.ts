export type Niche = 'education' | 'fitness' | 'work' | 'custom';
export type HabitFrequency = 'daily' | 'weekly';
export type AvatarState = 'active' | 'idle' | 'sleeping' | 'slacking' | 'celebrating' | 'degraded' | 'peak_form';
export type SubscriptionStatus = 'free' | 'active' | 'expired' | 'cancelled';
export type SubscriptionTier = 'free' | 'monthly' | 'annual' | 'lifetime';

export interface User {
  id: string;
  email: string;
  niche: Niche | null;
  avatar_id: string | null;
  tokens: number;
  subscription_status: SubscriptionStatus;
  subscription_tier: SubscriptionTier;
  stripe_customer_id: string | null;
  subscription_expires_at: string | null;
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  frequency: HabitFrequency;
  niche: Niche;
  reward: string | null;
  penalty: string | null;
  archived: boolean;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  date: string; // ISO date string YYYY-MM-DD
  completed: boolean;
  photo_url: string | null;
  note: string | null;
  mood: number | null; // 1-5
  created_at: string;
}

export interface Streak {
  id: string;
  habit_id: string;
  current_streak: number;
  longest_streak: number;
  last_completed: string | null; // ISO date string
}

export interface AvatarCustomization {
  skin_tone: string;
  hair_style: string;
  hair_color: string;
  accessories: string[];
}

export interface Avatar {
  id: string;
  user_id: string;
  base_type: string;
  equipped_outfit: string | null;
  theme: string | null;
  animation_state: AvatarState;
  skin_tone: string | null;
  hair_style: string | null;
  hair_color: string | null;
  accessories: string[];
}

export interface Reflection {
  id: string;
  habit_id: string;
  date: string;
  prompt: string;
  response: string | null;
}

export interface ShopItem {
  id: string;
  name: string;
  type: 'outfit' | 'decor' | 'power_up';
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  sprite_data: Record<string, unknown> | null;
  premium_only: boolean;
}

export interface UserInventory {
  id: string;
  user_id: string;
  item_id: string;
  equipped: boolean;
  purchased_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  target_coins: number;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}
