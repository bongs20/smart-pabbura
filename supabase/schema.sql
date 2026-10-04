-- ============================================================
-- SMART-PABBURA SYSTEM DATABASE SCHEMA & RLS POLICIES
-- Executed on Supabase PostgreSQL Query Editor
-- ============================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" 
    ON public.profiles FOR DELETE 
    USING (auth.uid() = user_id);


-- 2. MONITORING_RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.monitoring_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pain_level NUMERIC DEFAULT 0,
    mouth_ph NUMERIC DEFAULT 7.0,
    ulcer_size NUMERIC DEFAULT 0.0,
    hydration NUMERIC DEFAULT 100,
    mouth_temperature NUMERIC DEFAULT 36.5,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on monitoring_records
ALTER TABLE public.monitoring_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for monitoring_records
CREATE POLICY "Users can view their own monitoring records" 
    ON public.monitoring_records FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own monitoring records" 
    ON public.monitoring_records FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own monitoring records" 
    ON public.monitoring_records FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own monitoring records" 
    ON public.monitoring_records FOR DELETE 
    USING (auth.uid() = user_id);


-- 3. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_records_user_id ON public.monitoring_records(user_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_records_created_at ON public.monitoring_records(created_at DESC);


-- 4. AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name, email, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
        NEW.email,
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (user_id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
