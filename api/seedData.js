import User from './models/User.js';
import Todo from './models/Todo.js';
import { connectDB, mongoose } from './config/db.js';
import process from 'node:process';

// Seed data for users
const users = [
  {
    email: "user@example.com",
    password: "password123", // In production, use hashed passwords
    displayName: "John Doe",
    fullName: "John Doe",
    age: 25
  },
  {
    email: "admin@example.com",
    password: "admin123", // In production, use hashed passwords
    displayName: "Admin User",
    fullName: "Admin User",
    age: 30
  },
  {
    email: "test@example.com",
    password: "test123", // In production, use hashed passwords
    displayName: "Test User",
    fullName: "Test User",
    age: 28
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Todo.deleteMany({});
    
    console.log('Existing data cleared');
    
    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users seeded successfully`);
    
    // Create todos for each user
    const todos = [
      {
        task: "Complete project documentation",
        completed: false,
        userId: createdUsers[0]._id,
        priority: "high",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      {
        task: "Buy groceries",
        completed: true,
        userId: createdUsers[0]._id,
        priority: "medium",
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // 1 day from now
      },
      {
        task: "Review code pull requests",
        completed: false,
        userId: createdUsers[1]._id,
        priority: "high",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
      },
      {
        task: "Prepare presentation",
        completed: false,
        userId: createdUsers[1]._id,
        priority: "medium",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
      },
      {
        task: "Test new features",
        completed: false,
        userId: createdUsers[2]._id,
        priority: "low",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
      }
    ];
    
    const createdTodos = await Todo.insertMany(todos);
    console.log(`${createdTodos.length} todos seeded successfully`);
    
    return { users: createdUsers, todos: createdTodos };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

// Only run the seeding function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    try {
      console.log('Connecting to MongoDB...');
      await connectDB();
      
      console.log('Starting database seeding...');
      const result = await seedDatabase();
      
      console.log('Database seeding completed successfully!');
      console.log(`Created ${result.users.length} users and ${result.todos.length} todos.`);
      
      // Close the connection
      console.log('Closing MongoDB connection...');
      await mongoose.connection.close();
      
      console.log('Done!');
      process.exit(0);
    } catch (error) {
      console.error('Seeding failed:', error);
      process.exit(1);
    }
  })();
}

export default seedDatabase; 