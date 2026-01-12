-- Additional RLS policies for referrals table
-- Allow service role to access all referrals (for admin operations)
CREATE POLICY IF NOT EXISTS "Service role can access all referrals"
    ON referrals FOR ALL
    USING (auth.role() = 'service_role');


-- Allow users to count their own referrals (for limit checking)
CREATE POLICY IF NOT EXISTS "Users can count their own referrals"
    ON referrals FOR SELECT
    USING (
        auth.uid()::text = user_id 
        OR user_id = current_setting('request.jwt.claims', true)::json->>'user_id'
        OR auth.role() = 'service_role'
    );

