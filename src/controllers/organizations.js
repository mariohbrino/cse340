import { createOrganization, getAllOrganizations, getOrganizationById } from "../models/organizations.js";
import { getProjectByOrganizationId } from "../models/projects.js";

const showOrganizationsPage = async (request, response) => {
  const organizations = await getAllOrganizations();
  const title = "Our Partner Organizations";

  return response.render("organizations", { title, organizations });
};

const showOrganizationDetailsPage = async (request, response, next) => {
  const organizationId = request.params.id;
  const organization = await getOrganizationById(organizationId);

  if (!organization) {
    const err = new Error("Organization not found");
    err.status = 404;
    return next(err);
  }

  const title = `Organization Details: ${organization.name}`;
  const projects = await getProjectByOrganizationId(organizationId);

  return response.render("organization", { title, organization, projects });
};

const showNewOrganizationForm = async (request, response) => {
  const title = "Add New Organization";

  return response.render("new-organization", { title });
};

const processNewOrganizationForm = async (request, response) => {
  const { name, description, contactEmail } = request.body;
  const logoFilename = "placeholder-logo.png"; // Use the placeholder logo for all new organizations

  const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
  return response.redirect(`/organizations/${organizationId}`);
};

export { processNewOrganizationForm, showNewOrganizationForm, showOrganizationDetailsPage, showOrganizationsPage };
