/**
 * Simplified session-based authentication middleware
 * Checks if the user has an active session
 */
const authMiddleware = (req, res, next) => {
  // Check if the user is logged in via session
  if (!req.session || !req.session.userId) {
    console.log('Authentication failed: No session or userId in session');
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  console.log('Authentication successful for user ID:', req.session.userId);
  next();
};

export default authMiddleware; 