import express from "express";

import {
  processAssignCategoriesForm,
  showAssignCategoriesForm,
  showCategoriesPage,
  showCategoryDetailsPage,
} from "./controllers/categories.js";
import { testErrorPage } from "./controllers/errors.js";
import { showHomePage } from "./controllers/index.js";
import {
  organizationValidation,
  processEditOrganizationForm,
  processNewOrganizationForm,
  showEditOrganizationForm,
  showNewOrganizationForm,
  showOrganizationDetailsPage,
  showOrganizationsPage,
} from "./controllers/organizations.js";
import {
  processNewProjectForm,
  projectValidation,
  showNewProjectForm,
  showProjectDetailsPage,
  showProjectsPage,
} from "./controllers/projects.js";

const router = express.Router();

router.get("/", showHomePage);

router.get("/projects", showProjectsPage);
router.get("/projects/create", showNewProjectForm);
router.post("/projects", projectValidation, processNewProjectForm);
router.get("/projects/:id", showProjectDetailsPage);

router.get("/organizations", showOrganizationsPage);
router.get("/organizations/create", showNewOrganizationForm);
router.post("/organizations", organizationValidation, processNewOrganizationForm);
router.get("/organizations/:id/edit", showEditOrganizationForm);
router.post("/organizations/:id", organizationValidation, processEditOrganizationForm);
router.get("/organizations/:id", showOrganizationDetailsPage);

router.get("/categories", showCategoriesPage);
router.get("/categories/assign/:projectId", showAssignCategoriesForm);
router.post("/categories/assign/:projectId", processAssignCategoriesForm);
router.get("/categories/:id", showCategoryDetailsPage);

// error-handling routes
router.get("/test-error", testErrorPage);

export default router;
