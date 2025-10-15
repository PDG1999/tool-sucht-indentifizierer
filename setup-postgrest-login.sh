#!/bin/bash

# Setup PostgREST Login via Coolify Database
# This script creates the login RPC function and supervisor account

echo "🚀 Setting up PostgREST Login..."
echo ""

# Database connection details (from Coolify)
DB_HOST="nsgccoc4scg8g444c400c840"
DB_NAME="postgres"
DB_USER="postgres"
DB_PASSWORD="${DATABASE_PASSWORD:-postgres}"

# Execute SQL script
docker exec -i ${DB_HOST} psql -U ${DB_USER} -d ${DB_NAME} << 'EOF'
-- Setup PostgREST Login Function
-- This creates a JWT-based login system for PostgREST

-- 1. Create JWT token type if not exists
DO $$ BEGIN
  CREATE TYPE jwt_token AS (
    token text
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Create login RPC function
CREATE OR REPLACE FUNCTION login(email TEXT, password TEXT)
RETURNS jwt_token AS $$
DECLARE
  _counselor RECORD;
  _token TEXT;
  _exp INTEGER;
BEGIN
  -- Find counselor by email
  SELECT id, email, password_hash, role, is_active
  INTO _counselor
  FROM counselors
  WHERE counselors.email = login.email;
  
  -- Check if user exists and is active
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid email or password';
  END IF;
  
  IF NOT _counselor.is_active THEN
    RAISE EXCEPTION 'Account is not active';
  END IF;
  
  -- Verify password using crypt()
  IF NOT (_counselor.password_hash = crypt(password, _counselor.password_hash)) THEN
    RAISE EXCEPTION 'Invalid email or password';
  END IF;
  
  -- Generate JWT token (valid for 7 days)
  _exp := extract(epoch from now() + interval '7 days')::integer;
  
  SELECT sign(
    json_build_object(
      'role', _counselor.role,
      'user_id', _counselor.id,
      'email', _counselor.email,
      'exp', _exp
    ),
    current_setting('app.jwt_secret')
  ) INTO _token;
  
  -- Return token
  RETURN (_token)::jwt_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Grant execute permission to anonymous role
GRANT EXECUTE ON FUNCTION login(TEXT, TEXT) TO web_anon;
GRANT EXECUTE ON FUNCTION login(TEXT, TEXT) TO authenticated;

-- 4. Create new supervisor account with bcrypt hash
-- Password: SupervisorSAMEBI2025!
INSERT INTO counselors (
  email,
  password_hash,
  name,
  role,
  is_active,
  created_at,
  updated_at
) VALUES (
  'supervisor@samebi.net',
  crypt('SupervisorSAMEBI2025!', gen_salt('bf')),
  'Supervisor Account',
  'supervisor',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) 
DO UPDATE SET
  password_hash = crypt('SupervisorSAMEBI2025!', gen_salt('bf')),
  role = 'supervisor',
  is_active = true,
  updated_at = NOW();

-- 5. Verify the account was created
\echo '✅ PostgREST Login Setup Complete!'
\echo '📧 Email: supervisor@samebi.net'
\echo '🔑 Password: SupervisorSAMEBI2025!'
\echo '🚀 Ready to use!'

SELECT 
  id,
  email,
  name,
  role,
  is_active,
  created_at
FROM counselors
WHERE email = 'supervisor@samebi.net';
EOF

echo ""
echo "✅ Done!"

