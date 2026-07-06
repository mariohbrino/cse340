import express from "express";
import { testConnection } from "./models/db.js";
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

app.get("/organizations", (request, response) => {
  const title = "Our Partner Organizations";
  response.render("organizations", { title });
});

app.get("/projects", (request, response) => {
  const title = "Service Projects";
  response.render("projects", { title });
});

app.get("/categories", (request, response) => {
  const title = "Categories";
  response.render("categories", { title });
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
