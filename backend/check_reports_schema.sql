-- Check the actual structure of the reports table in the database
-- Run this in the Supabase SQL Editor to see the current table structure

-- Check table columns and their data types
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'reports'
ORDER BY ordinal_position;

-- Check existing RLS policies on the reports table
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'reports';

-- Check if RLS is enabled on the reports table
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'reports';