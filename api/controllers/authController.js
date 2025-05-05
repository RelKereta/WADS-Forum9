import { validationResult } from 'express-validator';
import User from '../models/User.js';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - displayName
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               displayName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or user already exists
 *       500:
 *         description: Server error
 */
const register = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password, displayName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user in MongoDB
    const newUser = new User({
      email,
      password, // For testing: storing plain password
      displayName: displayName || email.split('@')[0],
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || email.split('@')[0])}&background=random`
    });
    
    await newUser.save();
    
    // Store user ID in session
    req.session.userId = newUser._id;
    
    console.log('User registered:', newUser.email);

    // Return user data (without password)
    const userToReturn = newUser.toObject();
    delete userToReturn.password;
    
    return res.status(201).json({
      user: userToReturn
    });
  } catch (error) {
    console.error('[Register] Error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('[Login] Attempt for email:', email);

    // Find user in MongoDB
    const user = await User.findOne({ email });
    if (!user) {
      console.log('[Login] User not found with email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // For testing, we'll use simple password comparison
    // In production, you should use bcrypt
    // const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = password === user.password;
    
    if (!isMatch) {
      console.log('[Login] Invalid password for user:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Store user ID in session
    req.session.userId = user._id;
    
    console.log('[Login] Successful login for user:', email);
    
    // Return user data (without password)
    const userToReturn = user.toObject();
    delete userToReturn.password;
    
    return res.status(200).json({
      user: userToReturn
    });
  } catch (error) {
    console.error('[Login] Error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user data
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
const getCurrentUser = async (req, res) => {
  try {
    // Get the user ID from the session
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Find user in MongoDB
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data (without password)
    const userToReturn = user.toObject();
    delete userToReturn.password;
    
    return res.status(200).json(userToReturn);
  } catch (error) {
    console.error('[Get Current User] Error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       500:
 *         description: Server error
 */
const logout = (req, res) => {
  // Clear session
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out', error: err.message });
    }
    
    res.clearCookie('connect.sid');
    return res.status(200).json({ message: 'Logged out successfully' });
  });
};

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *               photoURL:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
const updateProfile = async (req, res) => {
  try {
    // Get the user ID from the session
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Find user in MongoDB
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { displayName, photoURL } = req.body;
    
    // Update user fields if provided
    if (displayName) user.displayName = displayName;
    
    // If photoURL is provided, use it; if it's empty, generate a default one
    if (photoURL !== undefined) {
      user.photoURL = photoURL || 
        `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || user.email.split('@')[0])}&background=random`;
    }
    
    await user.save();
    console.log('[Update Profile] User updated:', user.email);

    // Return updated user data (without password)
    const userToReturn = user.toObject();
    delete userToReturn.password;
    
    return res.status(200).json(userToReturn);
  } catch (error) {
    console.error('[Update Profile] Error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { register, login, getCurrentUser, logout, updateProfile }; 