import {
  getAllCategories,
  getCategoryById,
  getCategoryByProjectId,
  updateCategoryAssignments,
} from "../models/categories.js";
import { getProjectByCategoryId, getProjectById, getProjectDetails } from "../models/projects.js";

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

export { processAssignCategoriesForm, showAssignCategoriesForm, showCategoriesPage, showCategoryDetailsPage };
