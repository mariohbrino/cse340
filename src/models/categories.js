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

export { getAllCategories, getCategoryById, getCategoryByProjectId };
