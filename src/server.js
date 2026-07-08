import express from "express";
import { getAllCategories } from "./models/categories.js";
import { testConnection } from "./models/db.js";
import { getAllOrganizations } from "./models/organizations.js";
import { getAllProjects } from "./models/projects.js";
import { getFolderPath, getPublicDirectoryPath } from "./utils/public-path.js";

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(getPublicDirectoryPath()));

app.set("view engine", "ejs");
app.set("views", getFolderPath("src/views"));

app.get("/", (request, response) => {
  const title = "Home";
  response.render("home", { title });
});

app.get("/organizations", async (request, response) => {
  const organizations = await getAllOrganizations();
  const title = "Our Partner Organizations";

  response.render("organizations", { title, organizations });
});

app.get("/projects", async (request, response) => {
  const projects = await getAllProjects();
  const title = "Service Projects";
  response.render("projects", { title, projects });
});

app.get("/categories", async (request, response) => {
  const categories = await getAllCategories();
  const title = "Categories";
  response.render("categories", { title, categories });
});

app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});
