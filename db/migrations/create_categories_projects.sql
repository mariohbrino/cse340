-- table name category_project
CREATE TABLE category_project (
  category_id INT NOT NULL REFERENCES category(category_id),
  project_id INT NOT NULL REFERENCES project(project_id),
  PRIMARY KEY (category_id, project_id)
);
