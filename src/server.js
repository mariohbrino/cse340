import express from "express";
import { getAllCategories } from "./models/categories.js";
import { testConnection } from "./models/db.js";
import { getAllProjects } from "./models/projects.js";
import routes from "./routes.js";
import { getFolderPath, getPublicDirectoryPath } from "./utils/public-path.js";

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(getPublicDirectoryPath()));

app.set("view engine", "ejs");
app.set("views", getFolderPath("src/views"));

// Middleware to log all incoming requests in development mode
app.use((request, response, next) => {
  if (NODE_ENV === "development") {
    console.log(`${request.method} ${request.url}`);
  }
  next();
});

// Middlware to make NODE_ENV available in all templates
app.use((request, response, next) => {
  response.locals.NODE_ENV = NODE_ENV;
  next();
});

app.use(routes);

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

// Test route for 500 errors
app.get("/test-error", (req, res, next) => {
  const err = new Error("This is a test error");
  err.status = 500;
  next(err);
});

// Catch-all route for 404 errors
app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  // Log error details for debugging
  console.error("Error occurred:", err.message);
  console.error("Stack trace:", err.stack);

  // Determine status and template
  const status = err.status || 500;
  const template = status === 404 ? "404" : "500";

  // Prepare data for the template
  const context = {
    title: status === 404 ? "Page Not Found" : "Server Error",
    error: err.message,
    stack: err.stack,
  };

  // Render the appropriate error template
  res.status(status).render(`errors/${template}`, context);
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
