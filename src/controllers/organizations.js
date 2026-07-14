import { getAllOrganizations, getOrganizationById } from "../models/organizations.js";
import { getProjectByOrganizationId } from "../models/projects.js";

const showOrganizationsPage = async (request, response) => {
  const organizations = await getAllOrganizations();
  const title = "Our Partner Organizations";

  response.render("organizations", { title, organizations });
};

const showOrganizationDetailsPage = async (request, response, next) => {
  const organizationId = request.params.id;
  const organization = await getOrganizationById(organizationId);

  if (!organization) {
    const err = new Error("Organization not found");
    err.status = 404;
    next(err);
  }

  const title = `Organization Details: ${organization.name}`;
  const projects = await getProjectByOrganizationId(organizationId);

  response.render("organization", { title, organization, projects });
};

export { showOrganizationDetailsPage, showOrganizationsPage };
