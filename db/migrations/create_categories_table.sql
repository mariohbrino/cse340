-- table name category
CREATE TABLE IF NOT EXISTS "category" (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
