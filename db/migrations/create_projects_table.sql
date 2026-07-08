CREATE TABLE project (
  project_id SERIAL PRIMARY KEY,
  organization_id INT REFERENCES organization(organization_id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  date DATE NOT NULL
);
