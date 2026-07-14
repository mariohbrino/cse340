import { getAllOrganizations } from "../models/organizations.js";

const showOrganizationsPage = async (request, response) => {
  const organizations = await getAllOrganizations();
  const title = "Our Partner Organizations";

  response.render("organizations", { title, organizations });
};

export { showOrganizationsPage };
