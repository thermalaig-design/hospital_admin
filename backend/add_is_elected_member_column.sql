-- Add is_elected_member column to Members Table
ALTER TABLE "Members Table" 
ADD COLUMN IF NOT EXISTS is_elected_member BOOLEAN DEFAULT NULL;
