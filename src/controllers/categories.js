import { body, validationResult } from "express-validator";

import {
  createCategory,
  getAllCategories,
  getCategoryById,
  getCategoryByProjectId,
  updateCategory,
  updateCategoryAssignments,
} from "../models/categories.js";
import { getProjectByCategoryId, getProjectById, getProjectDetails } from "../models/projects.js";

const categoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3, max: 255 })
    .withMessage("Category name must be between 3 and 255 characters"),
];

const showCategoriesPage = async (request, response) => {
  const categories = await getAllCategories();
  const title = "Categories";
  return response.render("categories/index", { title, categories });
};

const showCategoryDetailsPage = async (request, response, next) => {
  const categoryId = request.params.id;
  const category = await getCategoryById(categoryId);

  if (!category) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  const projects = await getProjectByCategoryId(categoryId);

  const title = "Category Details";
  return response.render("categories/show", { title, category, projects });
};

const showNewCategoryForm = async (request, response) => {
  const title = "New Category";
  return response.render("categories/create", { title });
};

const processNewCategoryForm = async (request, response) => {
  // Check for validation errors
  const results = validationResult(request);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      request.flash("error", error.msg);
    });

    // Redirect back to the new organization form
    return response.redirect("/categories/create");
  }

  const { name } = request.body;

  const newCategoryId = await createCategory(name);

  request.flash("success", "Category created successfully.");

  return response.redirect(`/categories/${newCategoryId}`);
};

const showEditCategoryForm = async (request, response) => {
  const categoryId = request.params.id;
  const category = await getCategoryById(categoryId);

  if (!category) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  const title = "Edit Category";
  return response.render("categories/edit", { title, category });
};

const processEditCategoryForm = async (request, response, next) => {
  const categoryId = request.params.id;
  const category = await getCategoryById(categoryId);

  if (!category) {
    const err = new Error("Category not found");
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

    // Redirect back to the edit category form
    return response.redirect(`/categories/${categoryId}/edit`);
  }

  const result = await updateCategory(categoryId, request.body.name);
  request.flash("success", "Category updated successfully.");

  return response.redirect(`/categories/${categoryId}`);
};

const showAssignCategoriesForm = async (request, response, next) => {
  const projectId = request.params.projectId;

  const project = await getProjectById(projectId);

  if (!project) {
    const err = new Error("Project not found");
    err.status = 404;
    return next(err);
  }

  const projectDetails = await getProjectDetails(projectId);
  const categories = await getAllCategories();
  const assignedCategories = await getCategoryByProjectId(projectId);

  const title = "Assign Categories to Project";

  return response.render("categories/assign", { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (request, response, next) => {
  const projectId = request.params.projectId;
  const selectedCategoryIds = request.body.categoryIds || [];

  const project = await getProjectById(projectId);

  if (!project) {
    const err = new Error("Project not found");
    err.status = 404;
    return next(err);
  }

  // Ensure selectedCategoryIds is an array
  const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
  await updateCategoryAssignments(projectId, categoryIdsArray);
  request.flash("success", "Categories updated successfully.");

  return response.redirect(`/projects/${projectId}`);
};

export {
  categoryValidation,
  processAssignCategoriesForm,
  processEditCategoryForm,
  processNewCategoryForm,
  showAssignCategoriesForm,
  showCategoriesPage,
  showCategoryDetailsPage,
  showEditCategoryForm,
  showNewCategoryForm,
};
