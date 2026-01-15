-- Add missing column to Members Table
ALTER TABLE "Members Table" 
ADD COLUMN IF NOT EXISTS is_elected_member BOOLEAN DEFAULT false;

-- Also add the missing columns that might be needed
ALTER TABLE "Members Table" 
ADD COLUMN IF NOT EXISTS position TEXT,
ADD COLUMN IF NOT EXISTS location TEXT;