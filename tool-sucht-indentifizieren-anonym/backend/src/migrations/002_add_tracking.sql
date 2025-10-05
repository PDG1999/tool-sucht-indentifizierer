-- Migration: Add Tracking Features
-- Version: 1.1.0
-- Description: Add user tracking, session metrics, and supervisor roles

-- Add tracking columns to test_results
ALTER TABLE test_results ADD COLUMN IF NOT EXISTS session_data JSONB;
ALTER TABLE test_results ADD COLUMN IF NOT EXISTS user_fingerprint VARCHAR(255);
ALTER TABLE test_results ADD COLUMN IF NOT EXISTS user_session_id VARCHAR(255);
ALTER TABLE test_results ADD COLUMN IF NOT EXISTS ip_address INET;
ALTER TABLE test_results ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE test_results ADD COLUMN IF NOT EXISTS geolocation JSONB;
ALTER TABLE test_results ADD COLUMN IF NOT EXISTS question_metrics JSONB;

-- Add supervisor role to counselors
ALTER TABLE counselors ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'counselor' CHECK (role IN ('counselor', 'supervisor', 'admin'));

-- Add abort tracking
ALTER TABLE test_results ADD COLUMN IF NOT EXISTS aborted_at VARCHAR(50);
ALTER TABLE test_results ADD COLUMN IF NOT EXISTS resume_count INTEGER DEFAULT 0;

-- Create table for anonymous test sessions (before counselor assignment)
CREATE TABLE IF NOT EXISTS anonymous_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    fingerprint VARCHAR(255) NOT NULL,
    user_agent TEXT,
    ip_address INET,
    geolocation JSONB,
    browser_info JSONB,
    first_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    visit_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for test session metrics
CREATE TABLE IF NOT EXISTS test_session_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_result_id UUID REFERENCES test_results(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    start_time BIGINT NOT NULL,
    end_time BIGINT,
    total_time BIGINT,
    resume_count INTEGER DEFAULT 0,
    aborted_at VARCHAR(50),
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for question metrics
CREATE TABLE IF NOT EXISTS question_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_result_id UUID REFERENCES test_results(id) ON DELETE CASCADE,
    question_id VARCHAR(50) NOT NULL,
    start_time BIGINT NOT NULL,
    end_time BIGINT,
    time_spent BIGINT,
    answer_changes INTEGER DEFAULT 0,
    initial_answer INTEGER,
    final_answer INTEGER,
    scrolled_to_bottom BOOLEAN DEFAULT false,
    focus_lost INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_test_results_user_fingerprint ON test_results(user_fingerprint);
CREATE INDEX IF NOT EXISTS idx_test_results_user_session_id ON test_results(user_session_id);
CREATE INDEX IF NOT EXISTS idx_anonymous_sessions_session_id ON anonymous_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_anonymous_sessions_fingerprint ON anonymous_sessions(fingerprint);
CREATE INDEX IF NOT EXISTS idx_test_session_metrics_test_result_id ON test_session_metrics(test_result_id);
CREATE INDEX IF NOT EXISTS idx_question_metrics_test_result_id ON question_metrics(test_result_id);
CREATE INDEX IF NOT EXISTS idx_question_metrics_question_id ON question_metrics(question_id);

-- Add trigger for anonymous sessions last_visit update
CREATE OR REPLACE FUNCTION update_last_visit()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_visit = NOW();
    NEW.visit_count = NEW.visit_count + 1;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_anonymous_sessions_last_visit 
BEFORE UPDATE ON anonymous_sessions
FOR EACH ROW EXECUTE FUNCTION update_last_visit();

-- Insert default supervisor account (password: Supervisor123!)
-- Password hash for 'Supervisor123!'
INSERT INTO counselors (name, email, password_hash, role, is_active)
VALUES (
    'SAMEBI Supervisor',
    'supervisor@samebi.net',
    '$2b$10$YourHashedPasswordHere',  -- You need to hash this properly
    'supervisor',
    true
)
ON CONFLICT (email) DO NOTHING;

COMMENT ON TABLE anonymous_sessions IS 'Tracks anonymous users across visits via browser fingerprinting';
COMMENT ON TABLE test_session_metrics IS 'Detailed metrics about test completion behavior';
COMMENT ON TABLE question_metrics IS 'Individual question timing and interaction metrics';
COMMENT ON COLUMN test_results.session_data IS 'Complete session tracking data including user session and metrics';
COMMENT ON COLUMN test_results.user_fingerprint IS 'Browser fingerprint for user recognition';
COMMENT ON COLUMN counselors.role IS 'User role: counselor (standard), supervisor (view all), admin (full access)';

