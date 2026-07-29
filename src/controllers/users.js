import { getAllRoles, getRoleById } from "../models/roles.js";
import { createUser, getAllUsers, getUserById, updateUser, updateUserPassword } from "../models/users.js";
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
    .if((value, { req }) => req.path === "/users" && req.method === "POST")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("roleId").notEmpty().withMessage("Role is required").isInt().withMessage("Role must be a valid integer"),
];

const changePasswordValidation = [
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("confirm_password")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
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
  const userDetails = await getUserById(userId);

  if (!userDetails) {
    return response.status(404).send("User not found");
  }

  if (userDetails.user_id === request.session.user.user_id) {
    request.flash(
      "error",
      "You cannot change your information from this page. Please use your profile settings to change your information",
    );
    return response.redirect(`/users/${userId}`);
  }

  const roles = await getAllRoles(); // Assuming you have a function to get all roles

  const title = `Edit User - ${userDetails.name}`;
  return response.render("users/edit", { title, userDetails, roles });
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

  const userDetails = await getUserById(userId);

  if (!userDetails) {
    request.flash("error", "Selected user does not exist");
    return response.redirect(`/users/${userId}/edit`);
  }

  if (userDetails.user_id === request.session.user.user_id) {
    request.flash(
      "error",
      "You cannot change your information from this page. Please use your profile settings to change your information",
    );
    return response.redirect(`/users/${userId}`);
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

const showChangePasswordForm = async (request, response) => {
  const userId = request.params.id;
  const userDetails = await getUserById(userId);

  if (!userDetails) {
    request.flash("error", "User not found");
    return response.redirect(`/users/${userId}/password`);
  }

  if (userDetails.user_id === request.session.user.user_id) {
    request.flash(
      "error",
      "You cannot change your own password from this page. Please use your profile settings to change your password",
    );
    return response.redirect(`/users/${userId}`);
  }

  const title = "Change User Password";
  return response.render("users/password", { title, userDetails });
};

const processChangePasswordForm = async (request, response) => {
  const userId = request.params.id;

  // Check for validation errors
  const results = validationResult(request);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      request.flash("error", error.msg);
    });

    // Redirect back to the edit user form
    return response.redirect(`/users/${userId}/password`);
  }

  const userDetails = await getUserById(userId);
  if (!userDetails) {
    request.flash("error", "User not found");
    return response.redirect(`/users/${userId}/password`);
  }

  if (userDetails.user_id === request.session.user.user_id) {
    request.flash(
      "error",
      "You cannot change your own password from this page. Please use your profile settings to change your password",
    );
    return response.redirect(`/users/${userId}/password`);
  }

  try {
    // Process the password change
    const { password } = request.body;

    const hashedPassword = await hashPassword(password);
    await updateUserPassword(userId, hashedPassword);
    request.flash("success", "Password updated successfully");
    return response.redirect(`/users/${userId}`);
  } catch (error) {
    console.error("Error updating password:", error);
    request.flash("error", "An error occurred while updating the password. Please try again.");
    return response.redirect(`/users/${userId}/password`);
  }
};

export {
  changePasswordValidation,
  processChangePasswordForm,
  processCreateUserForm,
  processUserEditForm,
  showChangePasswordForm,
  showCreateUserForm,
  showUserDetailsPage,
  showUserEditPage,
  showUsersPage,
  userValidation,
};
