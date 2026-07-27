-- table name role
CREATE TABLE IF NOT EXISTS "role" (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL UNIQUE,
  role_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
