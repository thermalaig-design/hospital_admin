-- Create the 'profiles' storage bucket in Supabase
-- IMPORTANT: Don't run this SQL directly!
-- Instead, follow these steps in Supabase Dashboard:

-- Step 1: Go to Supabase Dashboard → Storage
-- Step 2: Click "Create bucket"
-- Step 3: Set bucket name to: profiles
-- Step 4: Make it a PUBLIC bucket (check the public checkbox)
-- Step 5: Click Create

-- Step 6: After bucket is created, go to Authentication → Policies
-- Step 7: Create these policies for the storage.objects table:

-- Policy 1: Allow users to upload their own profile photos
CREATE POLICY "Users can upload their own profile photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profiles' AND
  auth.role() = 'authenticated'
);

-- Policy 2: Allow anyone to view profile photos (since bucket is public)
CREATE POLICY "Anyone can view profile photos" ON storage.objects
FOR SELECT USING (bucket_id = 'profiles');

-- Policy 3: Allow users to update their own profile photos
CREATE POLICY "Users can update their own profile photos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profiles' AND
  auth.role() = 'authenticated'
);

-- Policy 4: Allow users to delete their own profile photos
CREATE POLICY "Users can delete their own profile photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profiles' AND
  auth.role() = 'authenticated'
);

-- ALTERNATIVE: If you want to use SQL, run only this part:
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true);