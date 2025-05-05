import fetch from 'node-fetch';

// First, log in to get a token
const loginAndGetToken = async () => {
  const loginURL = 'http://localhost:5001/api/auth/login';
  const credentials = {
    email: 'dummy@example.com',
    password: 'password123'
  };
  
  console.log('Attempting to log in with:', credentials.email);
  
  try {
    const response = await fetch(loginURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Login failed:', data.message || response.statusText);
      return null;
    }
    
    console.log('Login successful. Token:', data.token.substring(0, 20) + '...');
    return data.token;
  } catch (error) {
    console.error('Error during login:', error);
    return null;
  }
};

// Then, fetch todos using the token
const fetchTodos = async (token) => {
  if (!token) {
    console.error('No token available, cannot fetch todos');
    return;
  }
  
  const todosURL = 'http://localhost:5001/api/todos';
  
  console.log('Fetching todos with token');
  
  try {
    const response = await fetch(todosURL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Failed to fetch todos:', data.message || response.statusText);
      return;
    }
    
    console.log('Todos retrieved successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching todos:', error);
  }
};

// Create a new todo
const createTodo = async (token, task) => {
  if (!token) {
    console.error('No token available, cannot create todo');
    return;
  }
  
  const todosURL = 'http://localhost:5001/api/todos';
  
  console.log('Creating new todo:', task);
  
  try {
    const response = await fetch(todosURL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ task })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Failed to create todo:', data.message || response.statusText);
      return;
    }
    
    console.log('Todo created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating todo:', error);
  }
};

// Run the tests
const runTests = async () => {
  // Step 1: Log in
  const token = await loginAndGetToken();
  if (!token) return;
  
  // Step 2: Fetch todos
  const todos = await fetchTodos(token);
  
  // Step 3: Create a new todo
  if (todos) {
    await createTodo(token, 'Test todo created at ' + new Date().toISOString());
    
    // Step 4: Fetch todos again to see the new one
    await fetchTodos(token);
  }
};

runTests(); 