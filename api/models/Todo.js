import mongoose from 'mongoose';

// Define the Todo schema for MongoDB
const todoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: [true, 'Task is required'],
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  dueDate: {
    type: Date,
    required: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Create the Todo model
const Todo = mongoose.model('Todo', todoSchema);

export default Todo; 