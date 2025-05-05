import mongoose from 'mongoose';
import dotenv from 'dotenv';
import process from 'node:process';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Path to potential .env file locations
const rootEnvPath = path.resolve(process.cwd(), '.env');
const apiEnvPath = path.resolve(process.cwd(), 'api', '.env');

// Check if .env exists in root directory and load it
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
  console.log('Loaded .env from root directory');
}

// Check if .env exists in api directory and load it
if (fs.existsSync(apiEnvPath)) {
  dotenv.config({ path: apiEnvPath });
  console.log('Loaded .env from api directory');
}

// MongoDB URI from environment or fallback to hardcoded value
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://RelKereta:Sevillen0801@cluster0.tecvskj.mongodb.net/todolist';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB Atlas connected successfully');
    return mongoose.connection;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

export { connectDB, mongoose }; 