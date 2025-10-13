-- Create test_progress table for saving intermediate test state
CREATE TABLE IF NOT EXISTS test_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  responses JSONB NOT NULL,
  current_question INTEGER,
  test_type VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast session lookup
CREATE INDEX IF NOT EXISTS idx_test_progress_session_id ON test_progress(session_id);

-- Auto-delete old progress after 7 days (cleanup)
CREATE INDEX IF NOT EXISTS idx_test_progress_updated_at ON test_progress(updated_at);

COMMENT ON TABLE test_progress IS 'Stores intermediate test progress for recovery';
COMMENT ON COLUMN test_progress.session_id IS 'Unique session identifier from frontend';
COMMENT ON COLUMN test_progress.responses IS 'Array of answered questions so far';
COMMENT ON COLUMN test_progress.current_question IS 'Current question number (0-indexed)';
COMMENT ON COLUMN test_progress.test_type IS 'Type of test (short, full)';







