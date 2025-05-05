// Script to start MongoDB and API server together
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting MongoDB and API server...');

// Check if MongoDB is installed
const checkMongo = spawn('mongod', ['--version'], { shell: true });

checkMongo.on('close', (code) => {
  if (code !== 0) {
    console.error('\x1b[31m%s\x1b[0m', 'MongoDB not found. Please install MongoDB first.');
    console.log('You can download it from: https://www.mongodb.com/try/download/community');
    process.exit(1);
  }
  
  console.log('\x1b[32m%s\x1b[0m', 'MongoDB detected.');
  startServers();
});

function startServers() {
  // Start MongoDB (if not already running)
  console.log('Starting MongoDB service...');
  const mongoProcess = spawn('mongod', { shell: true, stdio: 'pipe' });
  
  // Buffer for MongoDB output
  let mongoOutput = '';
  mongoProcess.stdout.on('data', (data) => {
    mongoOutput += data.toString();
    if (mongoOutput.includes('waiting for connections')) {
      console.log('\x1b[32m%s\x1b[0m', 'MongoDB started successfully!');
      startApiServer();
    }
  });
  
  mongoProcess.stderr.on('data', (data) => {
    const error = data.toString();
    if (error.includes('address already in use') || error.includes('already running')) {
      console.log('\x1b[33m%s\x1b[0m', 'MongoDB is already running. Proceeding with API server...');
      startApiServer();
    } else {
      console.error('\x1b[31m%s\x1b[0m', 'MongoDB error:', error);
    }
  });
  
  // Set a timeout to start API anyway if MongoDB doesn't start within 5 seconds
  setTimeout(() => {
    if (!mongoOutput.includes('waiting for connections')) {
      console.log('\x1b[33m%s\x1b[0m', 'MongoDB might be already running or had issues starting. Proceeding with API server...');
      startApiServer();
    }
  }, 5000);
}

function startApiServer() {
  // Run the server.js file with CommonJS
  console.log('Starting API server...');
  const serverProcess = spawn('node', ['--commonjs', path.join(__dirname, 'server.js')], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: process.env.NODE_ENV || 'development',
    },
  });

  // Handle server process events
  serverProcess.on('close', (code) => {
    console.log(`API server process exited with code ${code}`);
    process.exit(code);
  });

  // Handle signals to cleanly shut down
  process.on('SIGINT', () => {
    console.log('Shutting down API server...');
    serverProcess.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    console.log('Shutting down API server...');
    serverProcess.kill('SIGTERM');
  });
} 