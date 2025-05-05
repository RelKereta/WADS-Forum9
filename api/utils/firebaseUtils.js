/**
 * Utility functions to help integrate Sequelize with Firebase
 */

const User = require('../models/User');
const Todo = require('../models/Todo');

/**
 * Synchronize a Firebase user with the Sequelize database
 * @param {Object} firebaseUser - Firebase user object
 * @returns {Promise<Object>} - Sequelize user object
 */
const syncFirebaseUser = async (firebaseUser) => {
  try {
    const { uid, email, displayName, photoURL } = firebaseUser;
    
    // Find or create the user in the database
    const [user, created] = await User.findOrCreate({
      where: { id: uid },
      defaults: {
        email,
        displayName: displayName || '',
        photoURL: photoURL || ''
      }
    });
    
    // If user exists but some fields might have changed, update them
    if (!created) {
      await user.update({
        email,
        displayName: displayName || user.displayName,
        photoURL: photoURL || user.photoURL
      });
    }
    
    return user;
  } catch (error) {
    console.error('Error syncing Firebase user:', error);
    throw error;
  }
};

/**
 * Sync a Firebase todo with the Sequelize database
 * @param {Object} firebaseTodo - Firebase todo object
 * @param {string} todoId - Firebase todo ID
 * @param {string} userId - Firebase user ID
 * @returns {Promise<Object>} - Sequelize todo object
 */
const syncFirebaseTodo = async (firebaseTodo, todoId, userId) => {
  try {
    const { task, completed, createdAt } = firebaseTodo;
    
    // Find or create the todo in the database
    const [todo, created] = await Todo.findOrCreate({
      where: { id: todoId },
      defaults: {
        userId,
        task,
        completed: completed || false,
        createdAt: createdAt ? new Date(createdAt) : new Date()
      }
    });
    
    // If todo exists but some fields might have changed, update them
    if (!created) {
      await todo.update({
        task,
        completed: completed || false
      });
    }
    
    return todo;
  } catch (error) {
    console.error('Error syncing Firebase todo:', error);
    throw error;
  }
};

/**
 * Convert Sequelize todo to Firebase format
 * @param {Object} sequelizeTodo - Sequelize todo object
 * @returns {Object} - Firebase formatted todo
 */
const todoToFirebaseFormat = (sequelizeTodo) => {
  return {
    id: sequelizeTodo.id,
    task: sequelizeTodo.task,
    completed: sequelizeTodo.completed,
    createdAt: sequelizeTodo.createdAt.toISOString(),
    updatedAt: sequelizeTodo.updatedAt.toISOString()
  };
};

/**
 * Convert Firebase todo to Sequelize format
 * @param {Object} firebaseTodo - Firebase todo object
 * @param {string} todoId - Firebase todo ID
 * @param {string} userId - Firebase user ID
 * @returns {Object} - Sequelize formatted todo
 */
const firebaseToSequelizeFormat = (firebaseTodo, todoId, userId) => {
  return {
    id: todoId,
    userId,
    task: firebaseTodo.task,
    completed: firebaseTodo.completed || false,
    createdAt: firebaseTodo.createdAt ? new Date(firebaseTodo.createdAt) : new Date(),
    updatedAt: firebaseTodo.updatedAt ? new Date(firebaseTodo.updatedAt) : new Date()
  };
};

module.exports = {
  syncFirebaseUser,
  syncFirebaseTodo,
  todoToFirebaseFormat,
  firebaseToSequelizeFormat
}; 