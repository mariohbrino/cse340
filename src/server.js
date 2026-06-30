import express from "express";
import { getFilePath, getPublicDirectoryPath } from "./utils/public-path.js";

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(getPublicDirectoryPath()));

app.get("/", (request, response) => {
  response.sendFile(getFilePath("src/views/home.html"));
});

app.get("/organizations", (request, response) => {
  response.sendFile(getFilePath("src/views/organizations.html"));
});

app.get("/projects", (request, response) => {
  response.sendFile(getFilePath("src/views/projects.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});
