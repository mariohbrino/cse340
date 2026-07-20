import express from "express";

import { showCategoriesPage, showCategoryDetailsPage } from "./controllers/categories.js";
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
import { showProjectDetailsPage, showProjectsPage } from "./controllers/projects.js";

const router = express.Router();

router.get("/", showHomePage);

router.get("/projects", showProjectsPage);
router.get("/projects/:id", showProjectDetailsPage);

router.get("/organizations", showOrganizationsPage);
router.get("/organizations/:id", showOrganizationDetailsPage);
router.get("/new-organization", showNewOrganizationForm);
router.post("/new-organization", organizationValidation, processNewOrganizationForm);
router.get("/edit-organization/:id", showEditOrganizationForm);
router.post("/edit-organization/:id", organizationValidation, processEditOrganizationForm);

router.get("/categories", showCategoriesPage);
router.get("/categories/:id", showCategoryDetailsPage);

// error-handling routes
router.get("/test-error", testErrorPage);

export default router;
