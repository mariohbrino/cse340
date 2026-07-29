import { createUser } from "./models/users.js";
import { hashPassword } from "./utils/password.js";

const name = process.env.ADMIN_NAME || "Admin";
const email = process.env.ADMIN_EMAIL || null;
const password = process.env.ADMIN_PASSWORD || null;

if (!email || !password) {
  console.error("Admin email and password must be provided in environment variables.");
  process.exit(1);
}

const hashedPassword = await hashPassword(password);
const newUser = await createUser(name, email, hashedPassword, "admin");

if (newUser) {
  console.log(`Admin user created successfully: ${newUser.name} (${newUser.email})`);
} else {
  console.error("Failed to create admin user.");
}
