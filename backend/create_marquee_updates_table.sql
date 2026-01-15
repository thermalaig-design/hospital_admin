-- Create marquee_updates table for notifications
CREATE TABLE IF NOT EXISTS public.marquee_updates (
  id serial not null,
  message text not null,
  is_active boolean null default true,
  priority integer null default 0,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  created_by character varying(100) null,
  updated_by character varying(100) null,
  constraint marquee_updates_pkey primary key (id)
) TABLESPACE pg_default;

-- Enable Row Level Security
ALTER TABLE public.marquee_updates ENABLE ROW LEVEL SECURITY;

-- Create RLS Policy to allow all authenticated users to read
CREATE POLICY "Allow authenticated users to read marquee_updates"
ON public.marquee_updates
FOR SELECT
TO authenticated
USING (true);

-- Create RLS Policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert marquee_updates"
ON public.marquee_updates
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create RLS Policy to allow authenticated users to update
CREATE POLICY "Allow authenticated users to update marquee_updates"
ON public.marquee_updates
FOR UPDATE
TO authenticated
USING (true);

-- Create RLS Policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete marquee_updates"
ON public.marquee_updates
FOR DELETE
TO authenticated
USING (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS marquee_updates_is_active_idx ON public.marquee_updates(is_active);
CREATE INDEX IF NOT EXISTS marquee_updates_priority_idx ON public.marquee_updates(priority DESC);
CREATE INDEX IF NOT EXISTS marquee_updates_created_at_idx ON public.marquee_updates(created_at DESC);

-- Grant permissions to anon user for public access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marquee_updates TO anon;
GRANT USAGE ON SEQUENCE public.marquee_updates_id_seq TO anon;
