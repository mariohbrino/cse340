import db from "./db.js";

const getAllRoles = async () => {
  const query = `
    SELECT role_id, role_name
    FROM role
    ORDER BY role_name;
  `;
  const result = await db.query(query);
  return result.rows;
};

const getRoleById = async (roleId) => {
  const query = `
    SELECT role_id, role_name
    FROM role
    WHERE role_id = $1;
  `;
  const result = await db.query(query, [roleId]);
  return result.rows[0];
};

export { getAllRoles, getRoleById };
