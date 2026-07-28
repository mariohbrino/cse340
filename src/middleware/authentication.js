const authenticationMiddleware = (request, response, next) => {
  response.locals.isLoggedIn = false;
  if (request.session && request.session.user) {
    response.locals.isLoggedIn = true;
  }
  next();
};

export { authenticationMiddleware };
