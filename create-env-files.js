// Script to create .env files in root and api directories
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define .env file content
const envContent = `# MongoDB Connection
MONGO_URI=mongodb+srv://RelKereta:Sevillen0801@cluster0.tecvskj.mongodb.net/todolist

# Server Configuration
PORT=5001
NODE_ENV=development

# Session Secret
SESSION_SECRET=your-secure-session-secret-key

# Optional: Database seeding
SEED_DATABASE=false
`;

// Paths to create .env files
const rootEnvPath = path.join(__dirname, '.env');
const apiEnvPath = path.join(__dirname, 'api', '.env');

// Create .env file in root directory
try {
  fs.writeFileSync(rootEnvPath, envContent);
  console.log(`Created .env file in root directory: ${rootEnvPath}`);
} catch (error) {
  console.error(`Error creating .env file in root directory:`, error);
}

// Create .env file in api directory
try {
  fs.writeFileSync(apiEnvPath, envContent);
  console.log(`Created .env file in api directory: ${apiEnvPath}`);
} catch (error) {
  console.error(`Error creating .env file in api directory:`, error);
}

console.log('Done creating .env files!'); 