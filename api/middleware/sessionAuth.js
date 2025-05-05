/**
 * Session-based authentication middleware
 * Verifies that a user is logged in by checking the session
 * Sets req.userId with the user's ID from the session
 */
const sessionAuth = (req, res, next) => {
  // Check if user is authenticated in the session
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  // Set userId for use in route handlers
  req.userId = req.session.userId;
  next();
};

export default sessionAuth; 