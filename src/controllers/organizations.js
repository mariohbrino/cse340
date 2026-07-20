import { body, validationResult } from "express-validator";

import { createOrganization, getAllOrganizations, getOrganizationById } from "../models/organizations.js";
import { getProjectByOrganizationId } from "../models/projects.js";

// Define validation and sanitization rules for organization form
// Define validation rules for organization form
const organizationValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Organization name is required")
    .isLength({ min: 3, max: 150 })
    .withMessage("Organization name must be between 3 and 150 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Organization description is required")
    .isLength({ max: 500 })
    .withMessage("Organization description cannot exceed 500 characters"),
  body("contactEmail")
    .normalizeEmail()
    .notEmpty()
    .withMessage("Contact email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),
];

const showOrganizationsPage = async (request, response) => {
  const organizations = await getAllOrganizations();
  const title = "Our Partner Organizations";

  return response.render("organizations/index", { title, organizations });
};

const showOrganizationDetailsPage = async (request, response, next) => {
  const organizationId = request.params.id;
  const organization = await getOrganizationById(organizationId);

  if (!organization) {
    const err = new Error("Organization not found");
    err.status = 404;
    return next(err);
  }

  const title = `Organization Details: ${organization.name}`;
  const projects = await getProjectByOrganizationId(organizationId);

  return response.render("organizations/show", { title, organization, projects });
};

const showNewOrganizationForm = async (request, response) => {
  const title = "Add New Organization";

  return response.render("organizations/create", { title });
};

const processNewOrganizationForm = async (request, response) => {
  // Check for validation errors
  const results = validationResult(request);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      request.flash("error", error.msg);
    });

    // Redirect back to the new organization form
    return response.redirect("/new-organization");
  }

  const { name, description, contactEmail } = request.body;
  const logoFilename = "placeholder-logo.png"; // Use the placeholder logo for all new organizations

  const organizationId = await createOrganization(name, description, contactEmail, logoFilename);

  // Set a success flash message
  request.flash("success", "Organization added successfully!");

  return response.redirect(`/organizations/${organizationId}`);
};

export {
  organizationValidation,
  processNewOrganizationForm,
  showNewOrganizationForm,
  showOrganizationDetailsPage,
  showOrganizationsPage,
};
