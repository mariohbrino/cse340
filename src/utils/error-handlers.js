const handleNotFound = (req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  return next(err);
};

const errorHandler = (err, req, res, next) => {
  // Log error details for debugging
  console.error("Error occurred:", err.message);
  console.error("Stack trace:", err.stack);

  // Determine status and template
  const status = err.status || 500;
  const template = status === 404 ? "404" : "500";

  // Prepare data for the template
  const context = {
    title: status === 404 ? "Page Not Found" : "Server Error",
    error: err.message,
    stack: err.stack,
  };

  // Render the appropriate error template
  res.status(status).render(`errors/${template}`, context);
};

export { errorHandler, handleNotFound };
