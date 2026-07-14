import express from "express";

import { showHomePage } from "./controllers/index.js";
import { showOrganizationsPage } from "./controllers/organizations.js";
import { showProjectsPage } from "./controllers/projects.js";

const router = express.Router();

router.get("/", showHomePage);
router.get("/organizations", showOrganizationsPage);
router.get("/projects", showProjectsPage);

export default router;
