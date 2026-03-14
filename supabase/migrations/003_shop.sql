-- Shop items catalog
CREATE TABLE IF NOT EXISTS public.shop_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('outfit', 'decor', 'power_up')),
  price integer NOT NULL CHECK (price > 0),
  rarity text DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  sprite_data jsonb,
  premium_only boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- User inventory (purchased items)
CREATE TABLE IF NOT EXISTS public.user_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  item_id uuid REFERENCES public.shop_items(id) ON DELETE CASCADE NOT NULL,
  equipped boolean DEFAULT false,
  purchased_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_id)
);

-- RLS policies
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;

-- Anyone can read shop items
CREATE POLICY "Shop items are viewable by all authenticated users"
  ON public.shop_items FOR SELECT
  TO authenticated
  USING (true);

-- Users can only see their own inventory
CREATE POLICY "Users can view own inventory"
  ON public.user_inventory FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inventory"
  ON public.user_inventory FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own inventory"
  ON public.user_inventory FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Seed some starter items
INSERT INTO public.shop_items (name, type, price, rarity, premium_only) VALUES
  ('Samurai Headband', 'outfit', 200, 'rare', false),
  ('Hoodie + Beats', 'outfit', 300, 'rare', false),
  ('Suit & Tie', 'outfit', 500, 'epic', false),
  ('Golden Crown', 'outfit', 1000, 'legendary', true),
  ('LED Desk Lamp', 'decor', 150, 'common', false),
  ('Motivational Poster', 'decor', 100, 'common', false),
  ('Trophy Shelf', 'decor', 400, 'rare', false),
  ('Neon Sign', 'decor', 600, 'epic', true),
  ('Streak Shield x1', 'power_up', 80, 'common', false),
  ('Streak Shield x3', 'power_up', 200, 'rare', false),
  ('2x Coins (24h)', 'power_up', 300, 'epic', false);
