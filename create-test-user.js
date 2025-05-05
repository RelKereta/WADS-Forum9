import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

async function createUserAndTodos() {
  try {
    console.log('Creating new user...');
    
    // 1. Register the user
    const userResponse = await api.post('/auth/register', {
      email: 'farrell.arya@binus.ac.id',
      password: '2702323540',
      displayName: 'Farrell Sevillen Arya'
    });
    
    console.log('User created successfully:', userResponse.data.user);
    
    // 2. Login with the user credentials to get a session
    await api.post('/auth/login', {
      email: 'farrell.arya@binus.ac.id',
      password: '2702323540'
    });
    
    console.log('Logged in with new user');
    
    // 3. Create todos for the user
    const todos = [
      { task: 'Todo number 1', completed: false },
      { task: 'Todo number 2', completed: true },
      { task: 'Todo number 3', completed: false },
      { task: 'Todo number 4', completed: false },
      { task: 'Todo number 5', completed: true }
    ];
    
    console.log('Creating todos...');
    
    for (const todo of todos) {
      await api.post('/todos', todo);
      console.log(`Created todo: "${todo.task}" (completed: ${todo.completed})`);
    }
    
    console.log('All todos created successfully!');
    console.log('\nUser creation complete:');
    console.log('- Email: farrell.arya@binus.ac.id');
    console.log('- Password: 2702323540');
    console.log('- Name: Farrell Sevillen Arya');
    console.log('- Todos: 5 todos (numbers 2 and 5 are completed)');
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

createUserAndTodos(); 