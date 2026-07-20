import { getCategoryByProjectId } from "../models/categories.js";
import { getProjectDetails, getUpcomingProjects } from "../models/projects.js";

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (request, response) => {
  const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
  const title = "Service Projects";
  return response.render("projects", { title, projects });
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
  return response.render("project", { title, project, categories });
};

export { showProjectDetailsPage, showProjectsPage };
