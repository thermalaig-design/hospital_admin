-- Drop table if exists
DROP TABLE IF EXISTS reports;

-- Create reports table
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    report_name VARCHAR(255) NOT NULL,
    report_type VARCHAR(100),
    test_date DATE,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Disable RLS for development
ALTER TABLE reports DISABLE ROW LEVEL SECURITY;