// This script is a wrapper to run the API from the root directory
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import process from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting API server from root directory...');

// Run the API from the api directory
const apiProcess = spawn('node', [path.join(__dirname, 'api', 'server.js')], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'development',
  },
});

// Handle process events
apiProcess.on('close', (code) => {
  console.log(`API server process exited with code ${code}`);
});

// Handle signals to cleanly shut down
process.on('SIGINT', () => {
  console.log('Shutting down API server...');
  apiProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Shutting down API server...');
  apiProcess.kill('SIGTERM');
}); 