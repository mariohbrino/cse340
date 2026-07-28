const loggedInMiddleware = (request, response, next) => {
  // if user is logged in, then redirect to home page, otherwise continue to the next middleware
  if (request.session && request.session.user) {
    next();
  } else {
    const err = new Error(`Page Not Found: ${request.method} ${request.originalUrl}`);
    err.status = 403;
    err.message = "You must be logged in to access this page.";
    return next(err);
  }
};

const loggedOutMiddleware = (request, response, next) => {
  // if user is logged in, then redirect to home page, otherwise continue to the next middleware
  if (request.session && request.session.user) {
    response.redirect("/");
  } else {
    next();
  }
};

export { loggedInMiddleware, loggedOutMiddleware };
