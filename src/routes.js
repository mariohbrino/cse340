import express from "express";

import { showCategoriesPage } from "./controllers/categories.js";
import { testErrorPage } from "./controllers/errors.js";
import { showHomePage } from "./controllers/index.js";
import { showOrganizationDetailsPage, showOrganizationsPage } from "./controllers/organizations.js";
import { showProjectDetailsPage, showProjectsPage } from "./controllers/projects.js";

const router = express.Router();

router.get("/", showHomePage);
router.get("/organizations", showOrganizationsPage);
router.get("/projects", showProjectsPage);
router.get("/categories", showCategoriesPage);

router.get("/organizations/:id", showOrganizationDetailsPage);
router.get("/projects/:id", showProjectDetailsPage);

// error-handling routes
router.get("/test-error", testErrorPage);

export default router;
