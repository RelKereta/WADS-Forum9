// Simple API server wrapper
import process from 'node:process';
import dotenv from 'dotenv';
import app from './server.js';

// Load environment variables
dotenv.config();

// Disable seeding
process.env.SEED_DATABASE = 'false';

console.log('Starting API server...');

const PORT = process.env.PORT || 5001;

// Start the server
const server = app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
  console.log(`API documentation at http://localhost:${PORT}/api-docs`);
}).on('error', (err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});

// Handle shutdown
process.on('SIGINT', () => {
  console.log('Shutting down...');
  server.close(() => process.exit(0));
});

process.on('SIGTERM', () => {
  console.log('Shutting down...');
  server.close(() => process.exit(0));
}); 