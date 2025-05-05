// Script to verify data in MongoDB
import { connectDB, mongoose } from './config/db.js';
import User from './models/User.js';
import Todo from './models/Todo.js';
import process from 'node:process';

async function verifyData() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    
    // Count and retrieve users
    const userCount = await User.countDocuments();
    console.log(`\n--- Found ${userCount} users in the database ---`);
    
    const users = await User.find({}).select('-password'); // Exclude password from results
    console.log('\nUSERS:');
    users.forEach(user => {
      console.log(`- ${user.displayName} (${user.email}), ID: ${user._id}`);
    });
    
    // Count and retrieve todos
    const todoCount = await Todo.countDocuments();
    console.log(`\n--- Found ${todoCount} todos in the database ---`);
    
    const todos = await Todo.find({});
    console.log('\nTODOS:');
    todos.forEach(todo => {
      console.log(`- ${todo.task} (${todo.completed ? 'Completed' : 'Pending'}), Priority: ${todo.priority}, User ID: ${todo.userId}`);
    });
    
    // Sample aggregation to show todos by user
    const todosByUser = await Todo.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $group: {
          _id: '$user.displayName',
          todoCount: { $sum: 1 },
          completedCount: { 
            $sum: { $cond: ['$completed', 1, 0] }
          },
          tasks: { $push: '$task' }
        }
      }
    ]);
    
    console.log('\nTODOS BY USER:');
    todosByUser.forEach(item => {
      console.log(`- ${item._id}: ${item.todoCount} todos (${item.completedCount} completed)`);
      console.log('  Tasks:', item.tasks.join(', '));
    });
    
    // Close the connection
    console.log('\nClosing MongoDB connection...');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error verifying data:', error);
    process.exit(1);
  }
}

// Run the verification
verifyData(); 