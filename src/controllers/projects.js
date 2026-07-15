import { getProjectDetails, getUpcomingProjects } from "../models/projects.js";

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (request, response) => {
  const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
  const title = "Service Projects";
  response.render("projects", { title, projects });
};

const showProjectDetailsPage = async (request, response) => {
  const projectId = request.params.id;
  const project = await getProjectDetails(projectId);

  if (!project) {
    response.status(404).send("Project not found");
    return;
  }

  const title = `Project Details - ${project.title}`;
  response.render("project", { title, project });
};

export { showProjectDetailsPage, showProjectsPage };
