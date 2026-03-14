-- Enable RLS on all tables

-- Users (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  niche text check (niche in ('education', 'fitness', 'custom')),
  avatar_id uuid,
  tokens integer not null default 0,
  subscription_status text not null default 'free' check (subscription_status in ('free', 'active', 'expired', 'cancelled')),
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'monthly', 'annual', 'lifetime')),
  stripe_customer_id text unique,
  subscription_expires_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.users enable row level security;
create policy "Users can read own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.users for insert with check (auth.uid() = id);

-- Habits
create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  frequency text not null check (frequency in ('daily', 'weekly')),
  niche text not null check (niche in ('education', 'fitness', 'custom')),
  reward text,
  penalty text,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.habits enable row level security;
create policy "Users manage own habits" on public.habits for all using (auth.uid() = user_id);

-- Habit logs
create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid references public.habits(id) on delete cascade not null,
  date date not null,
  completed boolean not null default false,
  photo_url text,
  note text,
  mood smallint check (mood between 1 and 5),
  created_at timestamptz not null default now(),
  unique (habit_id, date)
);
alter table public.habit_logs enable row level security;
create policy "Users manage own logs" on public.habit_logs
  for all using (
    auth.uid() = (select user_id from public.habits where id = habit_id)
  );

-- Streaks
create table public.streaks (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid references public.habits(id) on delete cascade not null unique,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_completed date
);
alter table public.streaks enable row level security;
create policy "Users manage own streaks" on public.streaks
  for all using (
    auth.uid() = (select user_id from public.habits where id = habit_id)
  );

-- Avatars
create table public.avatars (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null unique,
  base_type text not null default 'default',
  equipped_outfit text,
  theme text,
  animation_state text not null default 'active' check (animation_state in ('active', 'sleeping', 'slacking'))
);
alter table public.avatars enable row level security;
create policy "Users manage own avatar" on public.avatars for all using (auth.uid() = user_id);

-- Reflections
create table public.reflections (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid references public.habits(id) on delete cascade not null,
  date date not null,
  prompt text not null,
  response text,
  created_at timestamptz not null default now()
);
alter table public.reflections enable row level security;
create policy "Users manage own reflections" on public.reflections
  for all using (
    auth.uid() = (select user_id from public.habits where id = habit_id)
  );
