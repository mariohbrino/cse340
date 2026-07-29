import express from "express";

import {
  categoryValidation,
  processAssignCategoriesForm,
  processEditCategoryForm,
  processNewCategoryForm,
  showAssignCategoriesForm,
  showCategoriesPage,
  showCategoryDetailsPage,
  showEditCategoryForm,
  showNewCategoryForm,
} from "./controllers/categories.js";
import { showDashboard } from "./controllers/dashboard.js";
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
  processEditProjectForm,
  processNewProjectForm,
  projectValidation,
  showEditProjectForm,
  showNewProjectForm,
  showProjectDetailsPage,
  showProjectsPage,
} from "./controllers/projects.js";
import {
  authValidation,
  processLoginForm,
  processLogout,
  processRegistrationForm,
  showLoginForm,
  showRegistrationPage,
  userValidation,
} from "./controllers/users.js";
import { loggedInMiddleware, loggedOutMiddleware } from "./middleware/auth.js";
import { requireRole } from "./middleware/role.js";

const router = express.Router();

router.get("/", showHomePage);
router.get("/dashboard", loggedInMiddleware, showDashboard);

router.get("/register", loggedOutMiddleware, showRegistrationPage);
router.post("/register", loggedOutMiddleware, userValidation, processRegistrationForm);
router.get("/login", loggedOutMiddleware, showLoginForm);
router.post("/login", loggedOutMiddleware, authValidation, processLoginForm);
router.get("/logout", loggedInMiddleware, processLogout);

// Project routes
router.get("/projects", showProjectsPage);
router.get("/projects/create", loggedInMiddleware, requireRole("admin"), showNewProjectForm);
router.post("/projects", loggedInMiddleware, requireRole("admin"), projectValidation, processNewProjectForm);
router.get("/projects/:id/edit", loggedInMiddleware, requireRole("admin"), showEditProjectForm);
router.post("/projects/:id", loggedInMiddleware, requireRole("admin"), projectValidation, processEditProjectForm);
router.get("/projects/:id", showProjectDetailsPage);

// Organization routes
router.get("/organizations", showOrganizationsPage);
router.get("/organizations/create", loggedInMiddleware, requireRole("admin"), showNewOrganizationForm);
router.post(
  "/organizations",
  loggedInMiddleware,
  requireRole("admin"),
  organizationValidation,
  processNewOrganizationForm,
);
router.get("/organizations/:id/edit", loggedInMiddleware, requireRole("admin"), showEditOrganizationForm);
router.post(
  "/organizations/:id",
  loggedInMiddleware,
  requireRole("admin"),
  organizationValidation,
  processEditOrganizationForm,
);
router.get("/organizations/:id", showOrganizationDetailsPage);

// Category routes
router.get("/categories", showCategoriesPage);
router.get("/categories/create", loggedInMiddleware, requireRole("admin"), showNewCategoryForm);
router.post("/categories", loggedInMiddleware, requireRole("admin"), categoryValidation, processNewCategoryForm);
router.get("/categories/assign/:projectId", loggedInMiddleware, requireRole("admin"), showAssignCategoriesForm);
router.post("/categories/assign/:projectId", loggedInMiddleware, requireRole("admin"), processAssignCategoriesForm);
router.get("/categories/:id/edit", loggedInMiddleware, requireRole("admin"), showEditCategoryForm);
router.post("/categories/:id", loggedInMiddleware, requireRole("admin"), categoryValidation, processEditCategoryForm);
router.get("/categories/:id", showCategoryDetailsPage);

// error-handling routes
router.get("/test-error", testErrorPage);

export default router;
