-- Add tracking and abort columns to test_results table
ALTER TABLE test_results 
ADD COLUMN IF NOT EXISTS aborted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS aborted_at_question INTEGER,
ADD COLUMN IF NOT EXISTS completed_questions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS session_data JSONB,
ADD COLUMN IF NOT EXISTS tracking_data JSONB;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_test_results_aborted ON test_results(aborted);
CREATE INDEX IF NOT EXISTS idx_test_results_tracking_city ON test_results((tracking_data->'geo_data'->>'city'));
CREATE INDEX IF NOT EXISTS idx_test_results_device_type ON test_results((tracking_data->>'device_type'));

COMMENT ON COLUMN test_results.aborted IS 'Whether the test was aborted before completion';
COMMENT ON COLUMN test_results.aborted_at_question IS 'Question number where test was aborted';
COMMENT ON COLUMN test_results.completed_questions IS 'Number of questions answered';
COMMENT ON COLUMN test_results.session_data IS 'Session tracking data (timing, metrics)';
COMMENT ON COLUMN test_results.tracking_data IS 'Geo-location and device data';







