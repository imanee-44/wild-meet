
-- Profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'WildMeet member',
  initials TEXT NOT NULL DEFAULT 'WM',
  bio TEXT,
  avatar_color TEXT NOT NULL DEFAULT '#c17c74',
  city TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Outings table
CREATE TABLE public.outings (
  id TEXT NOT NULL PRIMARY KEY,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Camping','Beach','Mountain')),
  date TIMESTAMPTZ NOT NULL,
  image_key TEXT,
  image_url TEXT,
  spots_total INT NOT NULL CHECK (spots_total >= 2 AND spots_total <= 50),
  organizer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  description TEXT NOT NULL DEFAULT '',
  what_to_bring TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX outings_date_idx ON public.outings(date);
CREATE INDEX outings_category_idx ON public.outings(category);
GRANT SELECT ON public.outings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.outings TO authenticated;
GRANT ALL ON public.outings TO service_role;
ALTER TABLE public.outings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Outings are viewable by everyone" ON public.outings FOR SELECT USING (true);
CREATE POLICY "Authenticated can create outings" ON public.outings FOR INSERT TO authenticated WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Organizer can update own outing" ON public.outings FOR UPDATE TO authenticated USING (auth.uid() = organizer_id);
CREATE POLICY "Organizer can delete own outing" ON public.outings FOR DELETE TO authenticated USING (auth.uid() = organizer_id);

-- Participants join table
CREATE TABLE public.outing_participants (
  outing_id TEXT NOT NULL REFERENCES public.outings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (outing_id, user_id)
);
CREATE INDEX outing_participants_user_idx ON public.outing_participants(user_id);
GRANT SELECT ON public.outing_participants TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.outing_participants TO authenticated;
GRANT ALL ON public.outing_participants TO service_role;
ALTER TABLE public.outing_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants visible to everyone" ON public.outing_participants FOR SELECT USING (true);
CREATE POLICY "Users can join outings" ON public.outing_participants FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave outings" ON public.outing_participants FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Auto-create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  full_name TEXT;
  ini TEXT;
BEGIN
  full_name := COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1));
  ini := UPPER(
    CASE
      WHEN position(' ' in full_name) > 0
        THEN substr(full_name,1,1) || substr(split_part(full_name,' ',2),1,1)
      ELSE substr(full_name,1,2)
    END
  );
  INSERT INTO public.profiles (id, name, initials, avatar_color)
  VALUES (NEW.id, full_name, ini, '#c17c74')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
