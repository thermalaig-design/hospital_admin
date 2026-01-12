-- Create user_profiles table for storing user profile data
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id SERIAL NOT NULL,
  user_id UUID NOT NULL,
  user_identifier VARCHAR(255) NOT NULL, -- Membership number or phone for lookup
  
  -- Basic Information
  name VARCHAR(255),
  role VARCHAR(100),
  member_id VARCHAR(255),
  mobile VARCHAR(20),
  email VARCHAR(255),
  
  -- Address Information
  address_home TEXT,
  address_office TEXT,
  company_name VARCHAR(255),
  
  -- Contact Information
  resident_landline VARCHAR(20),
  office_landline VARCHAR(20),
  
  -- Personal Information
  gender VARCHAR(20),
  marital_status VARCHAR(20),
  nationality VARCHAR(100),
  aadhaar_id VARCHAR(20),
  blood_group VARCHAR(10),
  dob DATE,
  
  -- Emergency Contact
  emergency_contact_name VARCHAR(255),
  emergency_contact_number VARCHAR(20),
  
  -- Profile Picture
  profile_photo_url TEXT,
  
  -- Spouse Information
  spouse_name VARCHAR(255),
  spouse_contact_number VARCHAR(20),
  children_count INTEGER,
  
  -- Social Media
  facebook TEXT,
  twitter TEXT,
  instagram TEXT,
  linkedin TEXT,
  whatsapp TEXT,
  
  -- Family Members (stored as JSON)
  family_members JSONB,
  
  -- Elected Member Fields
  position VARCHAR(255),
  location VARCHAR(255),
  is_elected_member BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT user_profiles_user_identifier_unique UNIQUE (user_identifier)
) TABLESPACE pg_default;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_identifier ON public.user_profiles(user_identifier);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_user_profiles_updated_at();

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON public.user_profiles
FOR SELECT
USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.user_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.user_profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own profile
CREATE POLICY "Users can delete their own profile"
ON public.user_profiles
FOR DELETE
USING (auth.uid() = user_id);

