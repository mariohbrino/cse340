import db from "./db.js";

const getAllCategories = async () => {
  const query = `
      SELECT
        category_id,
        name
      FROM
        public.category
      ORDER BY
        name ASC;
    `;

  const result = await db.query(query);

  return result.rows;
};

const getCategoryById = async (categoryId) => {
  const query = `
      SELECT
        category_id,
        name
      FROM
        public.category
      WHERE
        category_id = $1
      ORDER BY
        name ASC;
    `;

  const result = await db.query(query, [categoryId]);

  return result.rows.length > 0 ? result.rows[0] : null;
};

const getCategoryByProjectId = async (projectId) => {
  const query = `
      SELECT
        c.category_id,
        c.name
      FROM
        public.category c
      JOIN
        public.category_project cp ON cp.category_id = c.category_id
      WHERE
        cp.project_id = $1
      ORDER BY
        c.name ASC;
    `;

  const result = await db.query(query, [projectId]);

  return result.rows;
};

const assignCategoryToProject = async (categoryId, projectId) => {
  const query = `
      INSERT INTO public.category_project (category_id, project_id)
      VALUES ($1, $2)
      ON CONFLICT (category_id, project_id) 
      DO UPDATE SET 
        category_id = EXCLUDED.category_id
      RETURNING category_id;
    `;

  const result = await db.query(query, [categoryId, projectId]);

  return result.rows.length > 0 ? result.rows[0].category_id : null;
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
  // First, remove existing category assignments for the project
  const deleteQuery = `
      DELETE FROM public.category_project
      WHERE project_id = $1;
    `;

  await db.query(deleteQuery, [projectId]);

  // Next, add the new category assignments
  for (const categoryId of categoryIds) {
    await assignCategoryToProject(categoryId, projectId);
  }
};

export {
  assignCategoryToProject,
  getAllCategories,
  getCategoryById,
  getCategoryByProjectId,
  updateCategoryAssignments,
};
