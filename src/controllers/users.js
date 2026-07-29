import { getAllRoles, getRoleById } from "../models/roles.js";
import { createUser, getAllUsers, getUserById, updateUser } from "../models/users.js";
import { hashPassword } from "../utils/password.js";

import { body, validationResult } from "express-validator";

const userValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Name must be between 3 and 200 characters"),
  body("email")
    .normalizeEmail()
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .notEmpty()
    .if((value, { req }) => req.path === "/users" || value)
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("roleId").notEmpty().withMessage("Role is required").isInt().withMessage("Role must be a valid integer"),
];

const showUsersPage = async (request, response) => {
  const users = await getAllUsers();

  const title = "Users";
  return response.render("users/index", { title, users });
};

const showCreateUserForm = async (request, response) => {
  const roles = await getAllRoles();

  const title = "Create User";
  return response.render("users/create", { title, roles });
};

const processCreateUserForm = async (request, response) => {
  // Check for validation errors
  const results = validationResult(request);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      request.flash("error", error.msg);
    });

    // Redirect back to the registration form
    return response.redirect("/users/create");
  }

  const { name, email, password } = request.body;

  try {
    const hashedPassword = await hashPassword(password);
    const newUser = await createUser(name, email, hashedPassword);

    // Set a success flash message
    request.flash("success", `User ${newUser.name} registered successfully!`);

    // If successful, redirect to the login page or another appropriate page
    return response.redirect("/users");
  } catch (error) {
    console.error("Error registering user:", error);
    request.flash("error", "An error occurred while registering. Please try again.");
    return response.redirect("/users/create");
  }
};

const showUserDetailsPage = async (request, response) => {
  const userId = request.params.id;
  const userDetails = await getUserById(userId);

  if (!userDetails) {
    return response.status(404).send("User not found");
  }

  const title = `User Details - ${userDetails.name}`;
  return response.render("users/show", { title, userDetails });
};

const showUserEditPage = async (request, response) => {
  const userId = request.params.id;
  const user = await getUserById(userId);

  if (!user) {
    return response.status(404).send("User not found");
  }

  const roles = await getAllRoles(); // Assuming you have a function to get all roles

  const title = `Edit User - ${user.name}`;
  return response.render("users/edit", { title, user, roles });
};

const processUserEditForm = async (request, response) => {
  const userId = request.params.id;

  // Check for validation errors
  const results = validationResult(request);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      request.flash("error", error.msg);
    });

    // Redirect back to the edit user form
    return response.redirect(`/users/${userId}/edit`);
  }

  const user = await getUserById(userId);

  if (!user) {
    request.flash("error", "Selected user does not exist");
    return response.redirect(`/users/${userId}/edit`);
  }

  const { name, email, roleId } = request.body;
  const role = await getRoleById(roleId);

  if (!role) {
    request.flash("error", "Selected role does not exist");
    return response.redirect(`/users/${userId}/edit`);
  }

  // Update the user in the database
  const updatedUserId = await updateUser(userId, name, email, roleId);

  // Redirect to the user's details page after successful update
  return response.redirect(`/users/${updatedUserId}`);
};

export {
  processCreateUserForm,
  processUserEditForm,
  showCreateUserForm,
  showUserDetailsPage,
  showUserEditPage,
  showUsersPage,
  userValidation,
};
