-- ============================================
-- SAMEBI Check Tool - Complete Database Setup
-- Version: 1.1.0
-- Description: Full schema for deployment
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Counselors table
CREATE TABLE IF NOT EXISTS counselors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    license_number VARCHAR(50),
    specialization TEXT[],
    role VARCHAR(20) DEFAULT 'counselor' CHECK (role IN ('counselor', 'supervisor', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    counselor_id UUID NOT NULL REFERENCES counselors(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_test_at TIMESTAMP WITH TIME ZONE
);

-- Test results table
CREATE TABLE IF NOT EXISTS test_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    counselor_id UUID NOT NULL REFERENCES counselors(id) ON DELETE CASCADE,
    responses JSONB NOT NULL,
    public_scores JSONB NOT NULL,
    professional_scores JSONB NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_notes TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date TIMESTAMP WITH TIME ZONE,
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('low', 'moderate', 'high', 'critical')),
    primary_concern VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Tracking columns
    session_data JSONB,
    user_fingerprint VARCHAR(255),
    user_session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    geolocation JSONB,
    question_metrics JSONB,
    aborted_at VARCHAR(50),
    resume_count INTEGER DEFAULT 0
);

-- Sessions table for tracking counselor sessions
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    counselor_id UUID NOT NULL REFERENCES counselors(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    counselor_id UUID REFERENCES counselors(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Anonymous sessions (before counselor assignment)
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

-- Test session metrics
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

-- Question metrics
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

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_clients_counselor_id ON clients(counselor_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_test_results_client_id ON test_results(client_id);
CREATE INDEX IF NOT EXISTS idx_test_results_counselor_id ON test_results(counselor_id);
CREATE INDEX IF NOT EXISTS idx_test_results_risk_level ON test_results(risk_level);
CREATE INDEX IF NOT EXISTS idx_test_results_completed_at ON test_results(completed_at);
CREATE INDEX IF NOT EXISTS idx_test_results_user_fingerprint ON test_results(user_fingerprint);
CREATE INDEX IF NOT EXISTS idx_test_results_user_session_id ON test_results(user_session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_counselor_id ON sessions(counselor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_audit_logs_counselor_id ON audit_logs(counselor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_anonymous_sessions_session_id ON anonymous_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_anonymous_sessions_fingerprint ON anonymous_sessions(fingerprint);
CREATE INDEX IF NOT EXISTS idx_test_session_metrics_test_result_id ON test_session_metrics(test_result_id);
CREATE INDEX IF NOT EXISTS idx_question_metrics_test_result_id ON question_metrics(test_result_id);
CREATE INDEX IF NOT EXISTS idx_question_metrics_question_id ON question_metrics(question_id);

-- ============================================
-- TRIGGERS & FUNCTIONS
-- ============================================

-- Function: Update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger: Counselors updated_at
CREATE TRIGGER update_counselors_updated_at BEFORE UPDATE ON counselors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Clients updated_at
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Test results updated_at
CREATE TRIGGER update_test_results_updated_at BEFORE UPDATE ON test_results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Update last_visit for anonymous sessions
CREATE OR REPLACE FUNCTION update_last_visit()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_visit = NOW();
    NEW.visit_count = NEW.visit_count + 1;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger: Anonymous sessions last_visit
CREATE TRIGGER update_anonymous_sessions_last_visit 
BEFORE UPDATE ON anonymous_sessions
FOR EACH ROW EXECUTE FUNCTION update_last_visit();

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE anonymous_sessions IS 'Tracks anonymous users across visits via browser fingerprinting';
COMMENT ON TABLE test_session_metrics IS 'Detailed metrics about test completion behavior';
COMMENT ON TABLE question_metrics IS 'Individual question timing and interaction metrics';
COMMENT ON COLUMN test_results.session_data IS 'Complete session tracking data including user session and metrics';
COMMENT ON COLUMN test_results.user_fingerprint IS 'Browser fingerprint for user recognition';
COMMENT ON COLUMN counselors.role IS 'User role: counselor (standard), supervisor (view all), admin (full access)';

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '✅ Database schema successfully created!';
    RAISE NOTICE '📊 Tables: counselors, clients, test_results, sessions, audit_logs, anonymous_sessions, test_session_metrics, question_metrics';
    RAISE NOTICE '⚠️  WICHTIG: Erstelle jetzt einen Demo-Berater Account mit: INSERT INTO counselors...';
END $$;

