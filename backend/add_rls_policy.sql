-- Supabase SQL Editor mein yeh script run karo
-- Yeh script "Members Table" ke liye public read access allow karega

-- Step 1: Enable RLS (agar already enabled hai to skip karo)
ALTER TABLE "Members Table" ENABLE ROW LEVEL SECURITY;

-- Step 2: Policy add karo jo sabko read access de
CREATE POLICY "Allow public read access on Members Table"
ON "Members Table"
FOR SELECT
TO public
USING (true);

-- Verify karo
SELECT COUNT(*) FROM "Members Table";

