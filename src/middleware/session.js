import session from "express-session";

const SESSION_SECRET = process.env.SESSION_SECRET;

const sessionMiddleware = session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 }, // Session expires after 1 hour of inactivity
});

export { sessionMiddleware };
