// Standalone seed script
import mongoose from 'mongoose';
import seedDatabase from './seedData.js';
import process from 'node:process';

console.log('Starting database seed process...');

// Simply run the seedDatabase function which now handles its own connection
seedDatabase()
  .then((result) => {
    console.log(`Successfully created ${result.users.length} users and ${result.todos.length} todos`);
    console.log('Database seed completed successfully');
    
    // Close connection
    console.log('Closing MongoDB connection...');
    mongoose.connection.close();
    console.log('Connection closed');
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error during seed process:', err);
    // Try to close connection if it exists
    if (mongoose.connection.readyState !== 0) {
      mongoose.connection.close()
        .then(() => process.exit(1))
        .catch(() => process.exit(1));
    } else {
      process.exit(1);
    }
  }); 