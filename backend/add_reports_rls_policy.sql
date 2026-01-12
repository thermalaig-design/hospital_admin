-- Add RLS policy for reports table to allow users to manage their own reports

-- Enable RLS on reports table (if not already enabled)
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to insert their own reports
CREATE POLICY "Allow users to insert their own reports"
ON reports
FOR INSERT
TO authenticated
WITH CHECK (true);  -- Allow authenticated users to insert, we'll handle validation in the application

-- Policy to allow users to select their own reports
CREATE POLICY "Allow users to read their own reports"
ON reports
FOR SELECT
TO authenticated
USING (
  user_id::text = current_setting('request.headers.user-id', true)::text
);

-- Policy to allow users to update their own reports
CREATE POLICY "Allow users to update their own reports"
ON reports
FOR UPDATE
TO authenticated
USING (
  user_id::text = current_setting('request.headers.user-id', true)::text
);

-- Policy to allow users to delete their own reports
CREATE POLICY "Allow users to delete their own reports"
ON reports
FOR DELETE
TO authenticated
USING (
  user_id::text = current_setting('request.headers.user-id', true)::text
);