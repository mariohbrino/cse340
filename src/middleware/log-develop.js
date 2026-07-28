// Middleware to log all incoming requests in development mode
const logDevelopMiddleware = (request, response, next) => {
  if (process.env.NODE_ENV?.toLowerCase() === "development") {
    console.log(`${request.method} ${request.url}`);
  }
  next();
};

export { logDevelopMiddleware };
