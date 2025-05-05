import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Sequelize, DataTypes } from 'sequelize';

// Initialize a simple SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './auth-debug.sqlite',
  logging: console.log
});

// Define a simple User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  photoURL: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

// Todo model
const Todo = sequelize.define('Todo', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  task: {
    type: DataTypes.STRING,
    allowNull: false
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', req.body);
  }
  next();
});

// Simple JWT Secret
const JWT_SECRET = 'debug-auth-secret-key-12345';

// Home route
app.get('/', (req, res) => {
  res.send('Auth Debug API is running');
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found with email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password for user:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for:', email);
    
    // Return user data and token
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Register route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    console.log('Registration attempt for:', email);

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      displayName: displayName || email.split('@')[0],
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || email.split('@')[0])}&background=random`
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Registration successful for:', email);
    
    // Return user data and token
    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Todo routes
// Get all todos for the authenticated user
app.get('/api/todos', async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify and decode token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    // Find user's todos
    const userId = decoded.id;
    const todos = await Todo.findAll({ where: { userId } });
    
    return res.status(200).json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new todo
app.post('/api/todos', async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify and decode token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    const { task } = req.body;
    if (!task) {
      return res.status(400).json({ message: 'Task is required' });
    }
    
    // Create todo
    const todo = await Todo.create({
      userId: decoded.id,
      task,
      completed: false
    });
    
    return res.status(201).json(todo);
  } catch (error) {
    console.error('Error creating todo:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a todo
app.put('/api/todos/:id', async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify and decode token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    const { id } = req.params;
    const { task } = req.body;
    
    // Find todo
    const todo = await Todo.findOne({ 
      where: { 
        id,
        userId: decoded.id
      }
    });
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    // Update todo
    todo.task = task;
    await todo.save();
    
    return res.status(200).json(todo);
  } catch (error) {
    console.error('Error updating todo:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify and decode token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    const { id } = req.params;
    
    // Find and delete todo
    const todo = await Todo.findOne({ 
      where: { 
        id,
        userId: decoded.id
      }
    });
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    await todo.destroy();
    
    return res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle todo completion status
app.patch('/api/todos/:id/toggle', async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify and decode token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    const { id } = req.params;
    
    // Find todo
    const todo = await Todo.findOne({ 
      where: { 
        id,
        userId: decoded.id
      }
    });
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    // Toggle completed status
    todo.completed = !todo.completed;
    await todo.save();
    
    return res.status(200).json(todo);
  } catch (error) {
    console.error('Error toggling todo status:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Start server
const PORT = 5001;
async function startServer() {
  try {
    // Sync database
    await sequelize.sync();
    console.log('Database synced');

    // Check if we have test user
    const testUser = await User.findOne({ where: { email: 'dummy@example.com' } });
    if (!testUser) {
      // Create test user
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        email: 'dummy@example.com',
        password: hashedPassword,
        displayName: 'Dummy User',
        photoURL: 'https://ui-avatars.com/api/?name=Dummy+User&background=random'
      });
      console.log('Created test user: dummy@example.com / password123');
    } else {
      console.log('Test user already exists');
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`Debug auth server running on http://localhost:${PORT}`);
      console.log(`Login endpoint: http://localhost:${PORT}/api/auth/login`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
  }
}

startServer(); 