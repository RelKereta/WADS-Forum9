import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import process from 'node:process';
import session from 'express-session';

// Load environment variables
dotenv.config();

// Database connection
import { connectDB } from './config/db.js';

// Routes
import todoRoutes from './routes/todoRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Optional database seeding
import seedDatabase from './seedData.js';

const app = express();

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [${req.method}] ${req.url}`);
  next();
});

// Enhanced CORS setup
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if(!origin) return callback(null, true);
    
    // Allow any localhost origin
    if(origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true, // Important for cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Preflight requests
app.options('*', cors());

// Parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secure-session-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, // Prevents JavaScript access to the cookie
    secure: false, // Should be true in production with HTTPS
    sameSite: 'lax', // Protection against CSRF
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Request body logging for debugging
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    console.log('Request body:', req.body);
  }
  next();
});

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TodoList API',
      version: '1.0.0',
      description: 'TodoList API Documentation with Swagger',
      contact: {
        name: 'Developer',
      },
      servers: [
        {
          url: 'http://localhost:5001',
          description: 'Development server',
        },
      ],
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'connect.sid'
        }
      },
    },
  },
  apis: ['./api/controllers/*.js', './api/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/todos', todoRoutes);
app.use('/api/auth', authRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('Todo API is running');
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working correctly with nodemon auto-reload!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
  // Express requires the next parameter even if not used
});

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log('MongoDB connected');
    
    // Check if seeding is explicitly enabled
    if (process.env.SEED_DATABASE === 'true') {
      console.log('Database seeding is enabled');
      seedDatabase()
        .then(() => console.log('Database seeded successfully'))
        .catch(err => console.error('Error seeding database:', err));
    } else {
      console.log('Database seeding is disabled');
    }
  })
  .catch(err => {
    console.error('Error connecting to database:', err);
  });

// Only start the server if this file is run directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
  });
}

export default app; 