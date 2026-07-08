-- table name organization
CREATE TABLE organization (
	organization_id SERIAL PRIMARY KEY,
	name VARCHAR(150) UNIQUE NOT NULL,
	description TEXT NOT NULL,
	contact_email VARCHAR(150) NOT NULL,
	logo_filename VARCHAR(255) NOT NULL
);
