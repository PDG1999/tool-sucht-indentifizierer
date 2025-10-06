-- Migration: Make client_id nullable in test_results table
-- This allows anonymous tests without a client record

-- Make client_id nullable
ALTER TABLE test_results 
ALTER COLUMN client_id DROP NOT NULL;

-- Add comment
COMMENT ON COLUMN test_results.client_id IS 'Client ID (nullable for anonymous tests)';

-- Verify change
SELECT 
    column_name, 
    is_nullable, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'test_results' 
  AND column_name = 'client_id';
