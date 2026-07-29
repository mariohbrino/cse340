import { verifyPassword } from "../utils/password.js";
import db from "./db.js";

const findUserByEmail = async (email) => {
  const query = `
    SELECT
      u.user_id, u.name, u.email, u.role_id, u.password_hash, u.created_at, r.role_name
    FROM
      "user" "u"
    JOIN "role" "r" ON u.role_id = r.role_id
    WHERE
      u.email = $1;
  `;

  const queryParameters = [email];
  const result = await db.query(query, queryParameters);

  return result.rows.length > 0 ? result.rows[0] : null;
};

const getUserById = async (userId) => {
  const query = `
    SELECT
      u.user_id, u.name, u.email, u.role_id, u.password_hash, u.created_at, r.role_name
    FROM
      "user" "u"
    JOIN "role" "r" ON u.role_id = r.role_id
    WHERE
      u.user_id = $1;
  `;

  const queryParameters = [userId];
  const result = await db.query(query, queryParameters);

  return result.rows.length > 0 ? result.rows[0] : null;
};

const getAllUsers = async () => {
  const query = `
    SELECT
      u.user_id, u.name, u.email, u.role_id, r.role_name, u.created_at
    FROM
      public.user u
    JOIN
      public.role r ON u.role_id = r.role_id;
  `;

  const result = await db.query(query);

  return result.rows;
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

const authenticateUser = async (email, password) => {
  const existingUser = await findUserByEmail(email);
  if (!existingUser) {
    return { isPasswordValid: false, user: null };
  }

  const isPasswordValid = await verifyPassword(password, existingUser.password_hash);
  return {
    isPasswordValid,
    user: {
      user_id: existingUser.user_id,
      name: existingUser.name,
      email: existingUser.email,
      role_id: existingUser.role_id,
      role_name: existingUser.role_name,
      created_at: existingUser.created_at,
    },
  };
};

const updateUser = async (userId, name, email, roleId) => {
  const query = `
    UPDATE "user"
    SET name = $1, email = $2, role_id = $3
    WHERE user_id = $4
    RETURNING user_id, name, email, role_id, created_at;
  `;

  const queryParameters = [name, email, roleId, userId];
  const result = await db.query(query, queryParameters);

  if (result.rows.length === 0) {
    throw new Error("Failed to update user");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Updated user with ID:", result.rows[0]);
  }

  return result.rows[0].user_id;
};

const updateUserPassword = async (userId, hashedPassword) => {
  const query = `
    UPDATE "user"
    SET password_hash = $1
    WHERE user_id = $2
    RETURNING user_id;
  `;

  const queryParameters = [hashedPassword, userId];
  const result = await db.query(query, queryParameters);

  if (result.rows.length === 0) {
    throw new Error("Failed to update user password");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Updated password for user with ID:", result.rows[0].user_id);
  }

  return result.rows[0].user_id;
};

export { authenticateUser, createUser, findUserByEmail, getAllUsers, getUserById, updateUser, updateUserPassword };
