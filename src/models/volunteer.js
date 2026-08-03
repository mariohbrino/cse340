import db from "./db.js";

const getVolunteerByUserId = async (userId) => {
  const query = `
    SELECT
      v.user_id, v.project_id, v.created_at
    FROM
      public.volunteer v
    WHERE v.user_id = $1;
  `;

  const result = await db.query(query, [userId]);

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Fetched volunteer record:", result.rows);
  }

  return result.rows;
};

const getVolunteerByProjectId = async (projectId) => {
  const query = `
    SELECT
      v.user_id, v.project_id, v.created_at
    FROM
      public.volunteer v
    WHERE v.project_id = $1;
  `;

  const result = await db.query(query, [projectId]);

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Fetched volunteer record:", result.rows);
  }

  return result.rows;
};

const getAllVolunteerByUserId = async (userId) => {
  const query = `
    SELECT
      u.user_id, v.project_id, p.title, p.organization_id, o.name as organization_name, v.created_at as volunteer_created_at
    FROM
      public.user u
    JOIN
      public.volunteer v ON u.user_id = v.user_id
    JOIN
      public.project p ON v.project_id = p.project_id
    JOIN
      public.organization o ON p.organization_id = o.organization_id
    WHERE u.user_id = $1;
  `;

  const result = await db.query(query, [userId]);

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Fetched volunteer record:", result.rows);
  }

  return result.rows;
};

const isUserVolunteeredForProject = async (userId, projectId) => {
  const query = `
    SELECT
      COUNT(*) as count
    FROM
      public.volunteer v
    WHERE v.user_id = $1 AND v.project_id = $2;
  `;

  const result = await db.query(query, [userId, projectId]);

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log(`Checked if user ${userId} is volunteered for project ${projectId}:`, result.rows[0].count > 0);
  }

  return result.rows[0].count > 0;
};

const volunteerToProject = async (userId, projectId) => {
  const query = `
    INSERT INTO public.volunteer (user_id, project_id)
    VALUES ($1, $2)
    RETURNING user_id, project_id, created_at;
  `;

  const queryParameters = [userId, projectId];
  const result = await db.query(query, queryParameters);

  if (result.rows.length === 0) {
    throw new Error("Failed to create volunteer record");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Created new volunteer record:", result.rows[0]);
  }

  return result.rows[0];
};

const resignVolunteerFromProject = async (userId, projectId) => {
  const query = `
    DELETE FROM public.volunteer
    WHERE user_id = $1 AND project_id = $2
    RETURNING user_id, project_id, created_at;
  `;

  const queryParameters = [userId, projectId];
  const result = await db.query(query, queryParameters);

  if (result.rows.length === 0) {
    throw new Error("Failed to resign volunteer record");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Resigned volunteer record:", result.rows[0]);
  }

  return result.rows[0];
};

export {
  getAllVolunteerByUserId,
  getVolunteerByProjectId,
  getVolunteerByUserId,
  isUserVolunteeredForProject,
  resignVolunteerFromProject,
  volunteerToProject,
};
