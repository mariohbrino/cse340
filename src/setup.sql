-- table organization
CREATE TABLE organization (
  organization_id SERIAL PRIMARY KEY,
  name VARCHAR(150) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  contact_email VARCHAR(150) NOT NULL,
  logo_filename VARCHAR(255) NOT NULL
);

-- table project
CREATE TABLE project (
  project_id SERIAL PRIMARY KEY,
  organization_id INT REFERENCES organization(organization_id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  date DATE NOT NULL
);

-- table category
CREATE TABLE category (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- table category_project
CREATE TABLE category_project (
  category_id INT NOT NULL REFERENCES category(category_id),
  project_id INT NOT NULL REFERENCES project(project_id),
  PRIMARY KEY (category_id, project_id)
);

-- insert organizations sample data
INSERT INTO organization (name, description, contact_email, logo_filename) VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- insert projects sample data
INSERT INTO project (organization_id, title, description, location, date) VALUES
(1, 'Community Center Renovation', 'Renovating the Westside Community Center with sustainable materials and energy-efficient systems', 'Westside District', '2026-03-15'),
(1, 'Solar Panel Installation Program', 'Installing solar panels on low-income housing to reduce energy costs and carbon footprint', 'Riverside Neighborhood', '2026-03-15'),
(1, 'Maple Street Playground Construction', 'Building an accessible playground with sustainable materials for children of all abilities', 'Maple Street Park', '2026-04-22'),
(1, 'Accessible Housing Initiative', 'Constructing affordable housing units with accessibility features for seniors and disabled residents', 'Downtown Core', '2026-05-10'), 
(1, 'Bike Lane Expansion Project', 'Expanding the city bike lane network to promote sustainable transportation', 'Main Street Corridor', '2026-05-10'),
(2, 'Rooftop Garden Initiative', 'Converting unused rooftop spaces into productive urban gardens for fresh produce', 'Hillside Apartments', '2026-02-08'),
(2, 'Community Composting Program', 'Establishing neighborhood composting sites to reduce waste and enrich soil for gardens', 'Eastside Community Center', '2026-02-08'),
(2, 'School Garden Education', 'Teaching students sustainable farming practices through hands-on garden projects', 'Lincoln Elementary School', '2026-03-20'), 
(2, 'Weekly Farmers Market Setup', 'Organizing a weekly farmers market featuring local urban farm produce and education', 'City Square Plaza', '2026-04-05'), 
(2, 'Vertical Farming Pilot', 'Testing vertical farming techniques in warehouse spaces for year-round food production', 'Industrial District Warehouse', '2026-04-18'),
(3, 'Food Bank Distribution', 'Coordinating volunteers to sort and distribute food donations to families in need', 'Hope Community Center', '2026-01-12'),
(3, 'Senior Mentorship Program', 'Matching volunteers with isolated seniors for companionship and support services', 'Sunrise Senior Living', '2026-01-12'),
(3, 'Youth Tutoring Initiative', 'Providing free tutoring services to underserved students through volunteer tutors', 'Public Library Branch', '2026-02-25'), 
(3, 'Spring Park Cleanup Campaign', 'Organizing community volunteers for park maintenance and beautification efforts', 'Riverside Park', '2026-03-08'), 
(3, 'Holiday Toy Drive', 'Collecting and distributing toys to children from low-income families during the holidays', 'Central Community Hub', '2026-03-08');

-- insert categories sample data
INSERT INTO category (name) VALUES
('Infrastructure & Construction'),
('Renewable Energy & Sustainability'),
('Community Spaces & Recreation'),
('Urban Farming & Food Security'),
('Education & Youth Development'),
('Social Services & Support'),
('Transportation & Mobility'),
('Environmental Cleanup & Beautification');

-- insert category_project sample data
INSERT INTO category_project (category_id, project_id) VALUES
(1, 1),
(2, 1),
(2, 2),
(1, 2),
(1, 3),
(3, 3),
(1, 4),
(6, 4),
(1, 5),
(7, 5),
(4, 6),
(2, 6),
(4, 7),
(8, 7),
(4, 8),
(5, 8),
(4, 9),
(3, 9),
(4, 10),
(2, 10),
(6, 11),
(4, 11),
(6, 12),
(5, 12),
(5, 13),
(6, 13),
(8, 14),
(3, 14),
(6, 15),
(5, 15);
