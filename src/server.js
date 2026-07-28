import express from "express";
import { authenticationMiddleware } from "./middleware/authentication.js";
import { errorHandlerMiddleware, handleNotFoundMiddleware } from "./middleware/error-handlers.js";
import flash from "./middleware/flash.js";
import { logDevelopMiddleware } from "./middleware/log-develop.js";
import { sessionMiddleware } from "./middleware/session.js";
import { setNodeEnvMiddleware } from "./middleware/set-nodenv.js";
import { testConnection } from "./models/db.js";
import routes from "./routes.js";
import { getFolderPath, getPublicDirectoryPath } from "./utils/public-path.js";

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
const PORT = process.env.PORT || 3000;

const app = express();

// Set up session management
app.use(sessionMiddleware);

// Use flash message middleware
app.use(flash);

app.use(express.static(getPublicDirectoryPath()));

// Express middleware to parse form data from request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // For handling JSON data from API requests

app.set("view engine", "ejs");
app.set("views", getFolderPath("src/views"));

app.use(authenticationMiddleware);
app.use(logDevelopMiddleware);
app.use(setNodeEnvMiddleware);

app.use(routes);

app.use(handleNotFoundMiddleware);
app.use(errorHandlerMiddleware);

app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});
