import { getAllRoles, getRoleById } from "../models/roles.js";
import { createUser, getAllUsers, getUserById, updateUser, updateUserPassword } from "../models/users.js";
import { hashPassword } from "../utils/password.js";

import { body, validationResult } from "express-validator";

import { authenticateUser, findUserByEmail } from "../models/users.js";

const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Name must be between 3 and 30 characters"),
  body("email")
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .custom(async (email) => {
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        throw new Error("Email is already in use");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("confirm_password")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];

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

const authValidation = [
  body("email")
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .withMessage("Password must be at least 8 characters long"),
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

const showUserRegistrationForm = async (request, response) => {
  const title = "Register";
  return response.render("auth/register", { title });
};

const processUserRegistrationForm = async (request, response) => {
  // Check for validation errors
  const results = validationResult(request);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      request.flash("error", error.msg);
    });

    // Redirect back to the registration form
    return response.redirect("/register");
  }

  const { name, email, password } = request.body;

  try {
    const hashedPassword = await hashPassword(password);
    const newUser = await createUser(name, email, hashedPassword);

    // Set a success flash message
    request.flash("success", `User ${newUser.name} registered successfully!`);

    // If successful, redirect to the login page or another appropriate page
    return response.redirect("/login");
  } catch (error) {
    console.error("Error registering user:", error);
    request.flash("error", "An error occurred while registering. Please try again.");
    return response.redirect("/register");
  }
};

const showLoginForm = async (request, response) => {
  const title = "Login";
  return response.render("auth/login", { title });
};

const processLoginForm = async (request, response) => {
  // Check for validation errors
  const results = validationResult(request);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      request.flash("error", error.msg);
    });

    // Redirect back to the login form
    return response.redirect("/login");
  }

  const { email, password } = request.body;
  const { isPasswordValid, user } = await authenticateUser(email, password);

  if (!user) {
    request.flash("error", "Invalid email or password");
    return response.redirect("/login");
  }

  if (!isPasswordValid) {
    request.flash("error", "Invalid email or password");
    return response.redirect("/login");
  }

  if (response.locals.NODE_ENV === "development") {
    console.log("User logged in:", user);
  }

  // If login is successful, you can set session data or a cookie here
  request.session.user = user;
  request.flash("success", "Login successful!");
  return response.redirect("/dashboard");
};

const processLogout = async (request, response) => {
  request.session.destroy((err) => {
    if (err) {
      console.error("Error logging out:", err);
      request.flash("error", "An error occurred while logging out. Please try again.");
      return response.redirect("/");
    }
    return response.redirect("/login");
  });
};

const showDashboard = (request, response) => {
  const user = request.session.user;
  response.render("dashboard", {
    title: "Dashboard",
    name: user.name,
    email: user.email,
  });
};

/**
 * Middleware factory to require specific role for route access
 * Returns middleware that checks if user has the required role
 *
 * @param {string} role - The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
const requireRole = (role) => {
  return (req, res, next) => {
    // Check if user is logged in first
    if (!req.session || !req.session.user) {
      req.flash("error", "You must be logged in to access this page.");
      return res.redirect("/login");
    }

    // Check if user's role matches the required role
    if (req.session.user.role_name !== role) {
      req.flash("error", "You do not have permission to access this page.");
      return res.redirect("/dashboard");
    }

    // User has required role, continue
    next();
  };
};

const requireLogin = (request, response, next) => {
  // if user is logged in, then redirect to home page, otherwise continue to the next middleware
  if (request.session && request.session.user) {
    next();
  } else {
    const err = new Error(`Page Not Found: ${request.method} ${request.originalUrl}`);
    err.status = 403;
    err.message = "You must be logged in to access this page.";
    return next(err);
  }
};

export {
  authValidation,
  changePasswordValidation,
  processChangePasswordForm,
  processCreateUserForm,
  processLoginForm,
  processLogout,
  processUserEditForm,
  processUserRegistrationForm,
  registerValidation,
  requireLogin,
  requireRole,
  showChangePasswordForm,
  showCreateUserForm,
  showDashboard,
  showLoginForm,
  showUserDetailsPage,
  showUserEditPage,
  showUserRegistrationForm,
  showUsersPage,
  userValidation,
};
