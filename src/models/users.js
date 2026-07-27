import db from "./db.js";

const findUserByEmail = async (email) => {
  const query = `
    SELECT
      user_id, name, email, role_id, created_at
    FROM
      "user"
    WHERE
      email = $1;
  `;

  const result = await db.query(query, [email]);

  return result.rows.length > 0 ? result.rows[0] : null;
};

const createUser = async (name, email, hashPassword) => {
  const defaultRole = "user";
  const query = `
    INSERT INTO "user" (name, email, password_hash, role_id)
    VALUES ($1, $2, $3, (SELECT role_id FROM "role" WHERE role_name = $4))
    RETURNING user_id, name, email, created_at;
  `;

  const queryParameters = [name, email, hashPassword, defaultRole];
  const result = await db.query(query, queryParameters);

  if (result.rows.length === 0) {
    throw new Error("Failed to create user");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Created new user with ID:", result.rows[0].user_id);
  }

  return result.rows[0];
};

export { createUser, findUserByEmail };
