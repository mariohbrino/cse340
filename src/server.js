import express from "express";
import { testConnection } from "./models/db.js";
import routes from "./routes.js";
import { errorHandler, handleNotFound } from "./utils/error-handlers.js";
import { getFolderPath, getPublicDirectoryPath } from "./utils/public-path.js";

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(getPublicDirectoryPath()));

// Express middleware to parse form data from request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // For handling JSON data from API requests

app.set("view engine", "ejs");
app.set("views", getFolderPath("src/views"));

// Middleware to log all incoming requests in development mode
app.use((request, response, next) => {
  if (NODE_ENV === "development") {
    console.log(`${request.method} ${request.url}`);
  }
  next();
});

// Middlware to make NODE_ENV available in all templates
app.use((request, response, next) => {
  response.locals.NODE_ENV = NODE_ENV;
  next();
});

app.use(routes);

// Catch-all route for 404 errors
app.use(handleNotFound);

// Global error handler
app.use(errorHandler);

app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});
