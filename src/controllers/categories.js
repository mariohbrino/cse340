import { getAllCategories, getCategoryById } from "../models/categories.js";
import { getProjectByCategoryId } from "../models/projects.js";

const showCategoriesPage = async (request, response) => {
  const categories = await getAllCategories();
  const title = "Categories";
  response.render("categories", { title, categories });
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
  response.render("category", { title, category, projects });
};

export { showCategoriesPage, showCategoryDetailsPage };
