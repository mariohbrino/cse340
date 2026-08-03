/**
 * Middleware factory to require specific role for route access
 * Returns middleware that checks if user has the required role
 *
 * @param {string} role - The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
const requireRole = (role) => {
  return (req, res, next) => {
    // Check if user is logged in first
    if (!req.session || !req.session.user) {
      req.flash("error", "You must be logged in to access this page.");
      return res.redirect("/login");
    }

    // Check if user's role matches the required role
    if (req.session.user.role_name !== role) {
      req.flash("error", "You do not have permission to access this page.");
      return res.redirect("/dashboard");
    }

    // User has required role, continue
    next();
  };
};

export { requireRole };
