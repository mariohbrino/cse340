const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";

const setNodeEnvMiddleware = (request, response, next) => {
  response.locals.NODE_ENV = NODE_ENV;
  next();
};

export { setNodeEnvMiddleware };
