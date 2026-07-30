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
  changePasswordValidation,
  processChangePasswordForm,
  processCreateUserForm,
  processLoginForm,
  processLogout,
  processUserEditForm,
  processUserRegistrationForm,
  registerValidation,
  requireLogin,
  requireRole,
  showChangePasswordForm,
  showCreateUserForm,
  showDashboard,
  showLoginForm,
  showUserDetailsPage,
  showUserEditPage,
  showUserRegistrationForm,
  showUsersPage,
  userValidation,
} from "./controllers/users.js";
import { loggedOutMiddleware } from "./middleware/auth.js";

const router = express.Router();

router.get("/", showHomePage);
router.get("/dashboard", requireLogin, showDashboard);

router.get("/register", loggedOutMiddleware, showUserRegistrationForm);
router.post("/register", loggedOutMiddleware, registerValidation, processUserRegistrationForm);
router.get("/login", loggedOutMiddleware, showLoginForm);
router.post("/login", loggedOutMiddleware, authValidation, processLoginForm);
router.get("/logout", requireLogin, processLogout);

// Project routes
router.get("/projects", showProjectsPage);
router.get("/projects/create", requireLogin, requireRole("admin"), showNewProjectForm);
router.post("/projects", requireLogin, requireRole("admin"), projectValidation, processNewProjectForm);
router.get("/projects/:id/edit", requireLogin, requireRole("admin"), showEditProjectForm);
router.post("/projects/:id", requireLogin, requireRole("admin"), projectValidation, processEditProjectForm);
router.get("/projects/:id", showProjectDetailsPage);

// Organization routes
router.get("/organizations", showOrganizationsPage);
router.get("/organizations/create", requireLogin, requireRole("admin"), showNewOrganizationForm);
router.post("/organizations", requireLogin, requireRole("admin"), organizationValidation, processNewOrganizationForm);
router.get("/organizations/:id/edit", requireLogin, requireRole("admin"), showEditOrganizationForm);
router.post(
  "/organizations/:id",
  requireLogin,
  requireRole("admin"),
  organizationValidation,
  processEditOrganizationForm,
);
router.get("/organizations/:id", showOrganizationDetailsPage);

// Category routes
router.get("/categories", showCategoriesPage);
router.get("/categories/create", requireLogin, requireRole("admin"), showNewCategoryForm);
router.post("/categories", requireLogin, requireRole("admin"), categoryValidation, processNewCategoryForm);
router.get("/categories/:projectId/assign", requireLogin, requireRole("admin"), showAssignCategoriesForm);
router.post("/categories/:projectId/assign", requireLogin, requireRole("admin"), processAssignCategoriesForm);
router.get("/categories/:id/edit", requireLogin, requireRole("admin"), showEditCategoryForm);
router.post("/categories/:id", requireLogin, requireRole("admin"), categoryValidation, processEditCategoryForm);
router.get("/categories/:id", showCategoryDetailsPage);

// User routes
router.get("/users", requireLogin, requireRole("admin"), showUsersPage);
router.get("/users/create", requireLogin, requireRole("admin"), showCreateUserForm);
router.get("/users/:id", requireLogin, requireRole("admin"), showUserDetailsPage);
router.post("/users", requireLogin, requireRole("admin"), userValidation, processCreateUserForm);
router.get("/users/:id/edit", requireLogin, requireRole("admin"), showUserEditPage);
router.get("/users/:id/password", requireLogin, requireRole("admin"), showChangePasswordForm);
router.post(
  "/users/:id/password",
  requireLogin,
  requireRole("admin"),
  changePasswordValidation,
  processChangePasswordForm,
);
router.post("/users/:id", requireLogin, requireRole("admin"), userValidation, processUserEditForm);

// error-handling routes
router.get("/test-error", testErrorPage);

export default router;
