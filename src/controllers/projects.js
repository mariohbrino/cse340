import { getCategoryByProjectId } from "../models/categories.js";
import { getAllOrganizations, getOrganizationById } from "../models/organizations.js";
import { createProject, getProjectDetails, getUpcomingProjects, updateProject } from "../models/projects.js";

import { body, validationResult } from "express-validator";

const projectValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 1000 })
    .withMessage("Description must be less than 1000 characters"),
  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .isLength({ max: 200 })
    .withMessage("Location must be less than 200 characters"),
  body("date").notEmpty().withMessage("Date is required").isISO8601().withMessage("Date must be a valid date format"),
  body("organizationId")
    .notEmpty()
    .withMessage("Organization is required")
    .isInt()
    .withMessage("Organization must be a valid integer"),
];

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (request, response) => {
  const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
  const title = "Service Projects";
  return response.render("projects/index", { title, projects });
};

const showProjectDetailsPage = async (request, response, next) => {
  const projectId = request.params.id;
  const project = await getProjectDetails(projectId);

  if (!project) {
    const err = new Error("Project not found");
    err.status = 404;
    return next(err);
  }

  const categories = await getCategoryByProjectId(projectId);

  const title = "Project Details";
  return response.render("projects/show", { title, project, categories });
};

const showNewProjectForm = async (request, response) => {
  const organizations = await getAllOrganizations();

  const title = "Add New Project";
  return response.render("projects/create", { title, organizations });
};

const processNewProjectForm = async (request, response) => {
  // Check for validation errors
  const results = validationResult(request);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      request.flash("error", error.msg);
    });

    // Redirect back to the new project form
    return response.redirect("/projects/create");
  }

  const { title, description, location, date, organizationId } = request.body;

  const organization = await getOrganizationById(organizationId);

  if (!organization) {
    request.flash("error", "Selected organization does not exist");
    return response.redirect("/projects/create");
  }

  // Create the new project in the database
  const newProjectId = await createProject(title, description, location, date, organizationId);

  // Set a success flash message
  request.flash("success", "Project created successfully!");

  // Redirect to the projects page
  return response.redirect(`/projects/${newProjectId}`);
};

const showEditProjectForm = async (request, response, next) => {
  const projectId = request.params.id;
  const project = await getProjectDetails(projectId);

  if (!project) {
    const err = new Error("Project not found");
    err.status = 404;
    return next(err);
  }

  const organizations = await getAllOrganizations();
  const title = "Edit Project";

  return response.render("projects/edit", { title, project, organizations });
};

const processEditProjectForm = async (request, response, next) => {
  const projectId = request.params.id;
  const project = await getProjectDetails(projectId);

  if (!project) {
    const err = new Error("Project not found");
    err.status = 404;
    return next(err);
  }

  // Check for validation errors
  const results = validationResult(request);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      request.flash("error", error.msg);
    });

    // Redirect back to the edit project form
    return response.redirect(`/projects/${projectId}/edit`);
  }

  const { title, description, location, date, organizationId } = request.body;
  const organization = await getOrganizationById(organizationId);

  if (!organization) {
    request.flash("error", "Selected organization does not exist");
    return response.redirect(`/projects/${projectId}/edit`);
  }

  // Update the project in the database
  const updatedProjectId = await updateProject(projectId, title, description, location, date, organizationId);

  // Set a success flash message
  request.flash("success", "Project updated successfully!");

  // Redirect to the project details page
  return response.redirect(`/projects/${updatedProjectId}`);
};

export {
  processEditProjectForm,
  processNewProjectForm,
  projectValidation,
  showEditProjectForm,
  showNewProjectForm,
  showProjectDetailsPage,
  showProjectsPage,
};
