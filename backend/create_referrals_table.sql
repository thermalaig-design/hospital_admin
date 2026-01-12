-- Create referrals table for patient referrals
CREATE TABLE IF NOT EXISTS referrals (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    user_name VARCHAR(255),
    user_email VARCHAR(255),
    user_phone VARCHAR(20),
    
    -- Patient details
    patient_name VARCHAR(255) NOT NULL,
    patient_age INTEGER,
    patient_gender VARCHAR(20),
    patient_phone VARCHAR(20) NOT NULL,
    
    -- Referral details
    category VARCHAR(20) NOT NULL CHECK (category IN ('General', 'EWS')),
    referred_to_doctor VARCHAR(255) NOT NULL,
    doctor_id INTEGER,
    department VARCHAR(255),
    medical_condition TEXT NOT NULL,
    notes TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Completed')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_referrals_user_id ON referrals(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_category ON referrals(category);
CREATE INDEX IF NOT EXISTS idx_referrals_created_at ON referrals(created_at DESC);

-- Enable Row Level Security
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own referrals
CREATE POLICY "Users can view their own referrals"
    ON referrals FOR SELECT
    USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claims', true)::json->>'user_id');

-- RLS Policy: Users can insert their own referrals
CREATE POLICY "Users can insert their own referrals"
    ON referrals FOR INSERT
    WITH CHECK (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claims', true)::json->>'user_id');

-- RLS Policy: Users can update their own referrals (for status updates by admin)
CREATE POLICY "Users can update their own referrals"
    ON referrals FOR UPDATE
    USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claims', true)::json->>'user_id');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_referrals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_referrals_updated_at
    BEFORE UPDATE ON referrals
    FOR EACH ROW
    EXECUTE FUNCTION update_referrals_updated_at();

-- Add comment to table
COMMENT ON TABLE referrals IS 'Stores patient referrals made by trustees and patrons';
COMMENT ON COLUMN referrals.category IS 'Category: General (max 2) or EWS (max 2) per user';
COMMENT ON COLUMN referrals.status IS 'Status: Pending, Approved, Rejected, or Completed';

