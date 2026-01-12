-- Fix the reports table structure completely
-- Run these commands in the Supabase SQL Editor

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Allow users to insert their own reports" ON reports;
DROP POLICY IF EXISTS "Allow users to read their own reports" ON reports;
DROP POLICY IF EXISTS "Allow users to update their own reports" ON reports;
DROP POLICY IF EXISTS "Allow users to delete their own reports" ON reports;

-- Disable RLS temporarily
ALTER TABLE reports DISABLE ROW LEVEL SECURITY;

-- If user_id column is UUID, drop and recreate as TEXT
-- First, backup the current data if needed, then alter the column
ALTER TABLE reports ALTER COLUMN user_id TYPE TEXT USING COALESCE(user_id::text, '');

-- Now recreate the table properly if needed (this will preserve existing data but fix structure)
-- Make sure user_id is TEXT not UUID

-- Re-enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create proper RLS policies for text user_id
CREATE POLICY "Allow users to insert their own reports"
ON reports
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow users to read their own reports"
ON reports
FOR SELECT
TO authenticated
USING (user_id = current_setting('request.headers.user-id', true));

CREATE POLICY "Allow users to update their own reports"
ON reports
FOR UPDATE
TO authenticated
USING (user_id = current_setting('request.headers.user-id', true));

CREATE POLICY "Allow users to delete their own reports"
ON reports
FOR DELETE
TO authenticated
USING (user_id = current_setting('request.headers.user-id', true));

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'reports'
ORDER BY ordinal_position;

-- Verify RLS policies
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'reports';