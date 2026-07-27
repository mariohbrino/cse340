import { createUser, findUserByEmail } from "../models/users.js";
import { hashPassword } from "../utils/password.js";

import { body, validationResult } from "express-validator";

const userValidation = [
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

const showRegistrationPage = async (request, response) => {
  const title = "Register";
  return response.render("users/register", { title });
};

const processRegistrationForm = async (request, response) => {
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
    return response.redirect("/");
  } catch (error) {
    console.error("Error registering user:", error);
    request.flash("error", "An error occurred while registering. Please try again.");
    return response.redirect("/register");
  }
};

export { processRegistrationForm, showRegistrationPage, userValidation };
