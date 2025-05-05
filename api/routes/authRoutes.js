import express from 'express';
import { check } from 'express-validator';
import * as authController from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const validateRegister = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  check('displayName', 'Name is required').notEmpty()
];

const validateLogin = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];

const validateProfileUpdate = [
  check('displayName', 'Display name cannot be empty when provided').optional().notEmpty(),
  check('photoURL', 'Photo URL must be a valid URL or empty').optional()
];

// Route: POST /api/auth/register
// Description: Register a new user
router.post('/register', validateRegister, authController.register);

// Route: POST /api/auth/login
// Description: Login user
router.post('/login', validateLogin, authController.login);

// Route: POST /api/auth/logout
// Description: Logout user
router.post('/logout', authController.logout);

// Route: GET /api/auth/me
// Description: Get current user data
// Support both session auth and token auth for backward compatibility
router.get('/me', (req, res, next) => {
  // Try session auth first
  if (req.session && req.session.userId) {
    return next();
  }
  
  // Fall back to token auth if no session
  authMiddleware(req, res, next);
}, authController.getCurrentUser);

// Route: PUT /api/auth/profile
// Description: Update user profile
router.put('/profile', validateProfileUpdate, (req, res, next) => {
  // Try session auth first
  if (req.session && req.session.userId) {
    return next();
  }
  
  // Fall back to token auth if no session
  authMiddleware(req, res, next);
}, authController.updateProfile);

export default router; 