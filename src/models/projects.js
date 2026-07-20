import db from "./db.js";

const getAllProjects = async () => {
  const query = `
    SELECT
      p.project_id,
      o.organization_id,
      o.name AS organization_name,
      p.title,
      p.description,
      p.location,
      p.date
    FROM
      public.project p
    JOIN
      public.organization o ON p.organization_id = o.organization_id;
  `;

  const result = await db.query(query);

  return result.rows;
};

const getProjectById = async (projectId) => {
  const query = `
    SELECT
      p.project_id,
      o.organization_id,
      o.name AS organization_name,
      p.title,
      p.description,
      p.location,
      p.date
    FROM
      public.project p
    JOIN
      public.organization o ON p.organization_id = o.organization_id
    WHERE
      p.project_id = $1;
  `;

  const result = await db.query(query, [projectId]);

  return result.rows.length > 0 ? result.rows[0] : null;
};

const getProjectByOrganizationId = async (organizationId) => {
  const query = `
    SELECT
      project_id, organization_id, title, description, location, date
    FROM
      public.project
    WHERE
      organization_id = $1;
  `;

  const result = await db.query(query, [organizationId]);

  return result.rows.length > 0 ? result.rows : null;
};

const getUpcomingProjects = async (number_of_projects) => {
  const query = `
    SELECT
      p.project_id,
      o.organization_id,
      o.name AS organization_name,
      p.title,
      p.description,
      p.location,
      p.date
    FROM
      public.project p
    JOIN
      public.organization o ON p.organization_id = o.organization_id
    ORDER BY
      p.date DESC
    LIMIT $1;
  `;

  const result = await db.query(query, [number_of_projects]);

  return result.rows;
};

const getProjectDetails = async (projectId) => {
  const query = `
    SELECT
      p.project_id,
      o.organization_id,
      o.name AS organization_name,
      p.title,
      p.description,
      p.location,
      p.date
    FROM
      public.project p
    JOIN
      public.organization o ON p.organization_id = o.organization_id
    WHERE
      p.project_id = $1;
  `;

  const result = await db.query(query, [projectId]);

  return result.rows.length > 0 ? result.rows[0] : null;
};

const getProjectByCategoryId = async (categoryId) => {
  const query = `
    SELECT
      p.project_id,
      p.organization_id,
      o.name AS organization_name,
      p.title,
      p.description,
      p.location,
      p.date,
      c.category_id,
      c.name as category_name
    FROM
      category_project cp
      JOIN project p ON p.project_id = cp.project_id
      JOIN category c ON c.category_id = cp.category_id
      JOIN organization o ON o.organization_id = p.organization_id
    WHERE
      cp.category_id = $1;
  `;

  const result = await db.query(query, [categoryId]);

  return result.rows;
};

/**
 * Creates a new project in the database.
 * @param {string} title
 * @param {string} description
 * @param {string} location
 * @param {string} date
 * @param {number} organizationId
 * @returns {number} The ID of the newly created project
 */
const createProject = async (title, description, location, date, organizationId) => {
  const query = `
    INSERT INTO project (title, description, location, date, organization_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id;
  `;

  const queryParams = [title, description, location, date, organizationId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error("Failed to create project");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Created new project with ID:", result.rows[0].project_id);
  }

  return result.rows[0].project_id;
};

export {
  createProject,
  getAllProjects,
  getProjectByCategoryId,
  getProjectById,
  getProjectByOrganizationId,
  getProjectDetails,
  getUpcomingProjects,
};
