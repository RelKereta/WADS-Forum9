import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Important for cookies/sessions - this enables sending cookies with cross-origin requests
});

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized request. Redirecting to login...');
      // Consider redirecting to login page here
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Todo API methods
const todoApi = {
  // Get all todos for the current user
  getAll: async () => {
    try {
      const response = await api.get('/todos');
      return response.data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  // Get a specific todo by id
  getById: async (id) => {
    try {
      const response = await api.get(`/todos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching todo ${id}:`, error);
      throw error;
    }
  },

  // Create a new todo
  create: async (todoData) => {
    try {
      const response = await api.post('/todos', todoData);
      return response.data;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  // Update an existing todo
  update: async (id, todoData) => {
    try {
      const response = await api.put(`/todos/${id}`, todoData);
      return response.data;
    } catch (error) {
      console.error(`Error updating todo ${id}:`, error);
      throw error;
    }
  },

  // Delete a todo
  delete: async (id) => {
    try {
      const response = await api.delete(`/todos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting todo ${id}:`, error);
      throw error;
    }
  },

  // Toggle todo completion status
  toggleComplete: async (id) => {
    try {
      const response = await api.patch(`/todos/${id}/toggle`);
      return response.data;
    } catch (error) {
      console.error(`Error toggling todo ${id}:`, error);
      throw error;
    }
  }
};

export default todoApi; 