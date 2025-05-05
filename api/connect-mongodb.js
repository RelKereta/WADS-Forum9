// Script to test MongoDB connection
import { connectDB } from './config/db.js';
import process from 'node:process';

async function testMongoDBConnection() {
  try {
    console.log('Testing MongoDB connection...');
    await connectDB();
    console.log('Successfully connected to MongoDB!');
    console.log('Your MongoDB database is ready to use.');
    
    // Keep the connection open for a bit, then close it
    setTimeout(() => {
      console.log('Closing MongoDB connection...');
      process.exit(0);
    }, 3000);
    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

// Run the test
testMongoDBConnection().catch(console.error); 