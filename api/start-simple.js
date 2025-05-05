import express from 'express';
import cors from 'cors';
import process from 'node:process';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sequelize } from './config/db.js';
import Todo from './models/Todo.js';
import User from './models/User.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-123456789';

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`, req.body);
  next();
});

// Define simple routes
app.get('/', (req, res) => {
  res.send('Todo API is running');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Debug routes to help with authentication issues
app.post('/api/auth/login-debug', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Debug login attempt for:', email);

    // Actually try to find the user and verify credentials
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log('Debug login: User not found with email:', email);
      return res.status(200).json({
        success: false,
        message: 'Debug: User not found with this email',
        receivedData: { email }
      });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log('Debug login: Invalid password for user:', email);
      return res.status(200).json({
        success: false,
        message: 'Debug: Invalid password',
        receivedData: { email, passwordLength: password ? password.length : 0 }
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    console.log('Debug login: Successful login for user:', email);
    
    // Return user data and token
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }
    });
  } catch (error) {
    console.error('Debug login error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Debug server error', 
      error: error.message 
    });
  }
});

// Initialize database and start server
const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    // Initialize database
    await sequelize.authenticate();
    console.log('Database connection established');
    
    // Create tables if they don't exist
    await sequelize.sync();
    console.log('Database tables synchronized');
    
    // Create dummy user if none exists
    const userCount = await User.count();
    if (userCount === 0) {
      // Hash a password for the dummy user
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      // Create the dummy user
      const dummyUser = await User.create({
        email: 'dummy@example.com',
        password: hashedPassword,
        displayName: 'Dummy User',
        photoURL: 'https://ui-avatars.com/api/?name=Dummy+User&background=random'
      });
      
      console.log('Created dummy user:', {
        id: dummyUser.id,
        email: dummyUser.email,
        displayName: dummyUser.displayName
      });
      
      // Create some dummy todos
      await Todo.bulkCreate([
        { task: 'Complete the assignment', userId: dummyUser.id, completed: false },
        { task: 'Implement Sequelize ORM', userId: dummyUser.id, completed: true },
        { task: 'Add Swagger Documentation', userId: dummyUser.id, completed: false }
      ]);
      console.log('Created dummy todos');
      
      // Generate a token for testing
      const token = jwt.sign(
        { id: dummyUser.id, email: dummyUser.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      console.log('Test login credentials:');
      console.log('Email: dummy@example.com');
      console.log('Password: password123');
      console.log('Test Token:', token);
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Authentication route: http://localhost:${PORT}/api/auth/login`);
      console.log(`Todos route: http://localhost:${PORT}/api/todos`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer(); 