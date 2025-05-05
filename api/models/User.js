import mongoose from 'mongoose';

// Define the User schema for MongoDB
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  displayName: {
    type: String,
    required: false,
    trim: true
  },
  fullName: {
    type: String,
    required: false,
    trim: true
  },
  age: {
    type: Number,
    required: false
  },
  photoURL: {
    type: String
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Create the User model
const User = mongoose.model('User', userSchema);

export default User; 