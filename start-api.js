/**
 * Simple API Server Launcher
 */
import { spawn } from 'child_process';
import process from 'node:process';

console.log('Starting API server...');

// Run the API directly without seeding
const serverProcess = spawn('node', ['api/runApi.js'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    SEED_DATABASE: 'false'
  }
});

// Handle exit gracefully
serverProcess.on('close', (code) => {
  console.log(`API server exited with code ${code}`);
  process.exit(code);
});

// Forward termination signals
process.on('SIGINT', () => serverProcess.kill('SIGINT'));
process.on('SIGTERM', () => serverProcess.kill('SIGTERM')); 