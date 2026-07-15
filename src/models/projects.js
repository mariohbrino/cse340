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
      p.date ASC
    LIMIT $1;
  `;

  const result = await db.query(query, [number_of_projects]);

  return result.rows;
};

const getProjectDetails = async (id) => {
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

  const result = await db.query(query, [id]);

  return result.rows.length > 0 ? result.rows[0] : null;
};

export { getAllProjects, getProjectByOrganizationId, getProjectDetails, getUpcomingProjects };
