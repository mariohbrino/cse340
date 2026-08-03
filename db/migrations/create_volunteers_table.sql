-- table name volunteer_project
CREATE TABLE IF NOT EXISTS "volunteer" (
  user_id INT NOT NULL REFERENCES "user"(user_id),
  project_id INT NOT NULL REFERENCES "project"(project_id),
  PRIMARY KEY (user_id, project_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
