import express from "express";

import { showHomePage } from "./controllers/index.js";

const router = express.Router();

router.get("/", showHomePage);

export default router;
