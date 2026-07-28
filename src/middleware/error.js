// Catch-all route for 404 errors
const handleNotFoundMiddleware = (request, response, next) => {
  const err = new Error(`Page Not Found: ${request.method} ${request.originalUrl}`);
  err.status = 404;
  return next(err);
};

// Global error handler
const errorHandlerMiddleware = (err, request, response, next) => {
  // Determine status and template
  const status = err.status || 500;
  const template = status === 404 ? "404" : "500";

  if (status === 404) {
    console.warn(err.message);
  } else {
    console.error("Error occurred:", err.message);
    console.error("Stack trace:", err.stack);
  }

  // Prepare data for the template
  const context = {
    title: status === 404 ? "Page Not Found" : "Server Error",
    error: err.message,
    stack: err.stack,
  };

  // Render the appropriate error template
  response.status(status).render(`errors/${template}`, context);
};

export { errorHandlerMiddleware, handleNotFoundMiddleware };
