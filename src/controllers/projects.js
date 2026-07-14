import { getAllProjects } from "../models/projects.js";

const showProjectsPage = async (request, response) => {
  const projects = await getAllProjects();
  const title = "Service Projects";
  response.render("projects", { title, projects });
};

export { showProjectsPage };
