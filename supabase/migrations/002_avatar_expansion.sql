-- Expand avatar states from 3 to 7 and add customization columns

-- Drop the old CHECK constraint on animation_state and add expanded one
ALTER TABLE public.avatars
  DROP CONSTRAINT IF EXISTS avatars_animation_state_check;

ALTER TABLE public.avatars
  ADD CONSTRAINT avatars_animation_state_check
  CHECK (animation_state IN ('active', 'idle', 'sleeping', 'slacking', 'celebrating', 'degraded', 'peak_form'));

-- Add avatar customization columns
ALTER TABLE public.avatars
  ADD COLUMN IF NOT EXISTS skin_tone text,
  ADD COLUMN IF NOT EXISTS hair_style text,
  ADD COLUMN IF NOT EXISTS hair_color text,
  ADD COLUMN IF NOT EXISTS accessories jsonb DEFAULT '[]'::jsonb;
