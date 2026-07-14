import { getAllCategories } from "../models/categories.js";

const showCategoriesPage = async (request, response) => {
  const categories = await getAllCategories();
  const title = "Categories";
  response.render("categories", { title, categories });
};

export { showCategoriesPage };
