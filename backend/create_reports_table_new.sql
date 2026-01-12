-- Create reports table with UUID user_id referencing auth.users
-- IMPORTANT: Make sure users exist in auth.users before inserting reports
-- The backend will generate deterministic UUIDs from membership numbers/phone numbers
CREATE TABLE IF NOT EXISTS public.reports (
  id SERIAL NOT NULL,
  user_id UUID NOT NULL,
  report_name CHARACTER VARYING(255) NOT NULL,
  report_type CHARACTER VARYING(100) NULL,
  test_date DATE NULL,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITHOUT TIME ZONE NULL DEFAULT NOW(),
  CONSTRAINT reports_pkey PRIMARY KEY (id),
  CONSTRAINT reports_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON public.reports(user_id);

-- Create index on uploaded_at for sorting
CREATE INDEX IF NOT EXISTS idx_reports_uploaded_at ON public.reports(uploaded_at DESC);

-- Enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own reports
CREATE POLICY "Users can view their own reports"
ON public.reports
FOR SELECT
USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own reports
CREATE POLICY "Users can insert their own reports"
ON public.reports
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own reports
CREATE POLICY "Users can update their own reports"
ON public.reports
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own reports
CREATE POLICY "Users can delete their own reports"
ON public.reports
FOR DELETE
USING (auth.uid() = user_id);

