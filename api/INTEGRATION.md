# Integrating the API with the React Frontend

This guide provides instructions on how to integrate the Sequelize ORM API with your existing React frontend that currently uses Firebase.

## Prerequisites

1. Make sure your API server is running:
   ```bash
   npm run start-api
   ```

2. MongoDB should be installed and running

## Setup the API Client

Create a new file `src/services/apiService.js` to interact with your API:

```javascript
import { auth } from '../firebase';

const API_URL = 'http://localhost:5001/api';

// Helper function to get auth token
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    return token;
  }
  return null;
};

// Helper to make authenticated requests
const makeAuthRequest = async (endpoint, method = 'GET', data = null) => {
  const token = await getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
  
  const config = {
    method,
    headers,
    ...(data && { body: JSON.stringify(data) })
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  
  return response.json();
};

// Todo API endpoints
export const todoApi = {
  // Get all todos for current user
  getAllTodos: async (userId) => {
    return makeAuthRequest(`/todos?userId=${userId}`);
  },
  
  // Get a single todo
  getTodoById: async (id) => {
    return makeAuthRequest(`/todos/${id}`);
  },
  
  // Create a new todo
  createTodo: async (todoData) => {
    return makeAuthRequest('/todos', 'POST', todoData);
  },
  
  // Update a todo
  updateTodo: async (id, todoData) => {
    return makeAuthRequest(`/todos/${id}`, 'PUT', todoData);
  },
  
  // Delete a todo
  deleteTodo: async (id) => {
    return makeAuthRequest(`/todos/${id}`, 'DELETE');
  },
  
  // Toggle todo completion status
  toggleTodoStatus: async (id) => {
    return makeAuthRequest(`/todos/${id}/toggle`, 'PATCH');
  }
};

export default todoApi;
```

## Modify the TodoList Component

Update your TodoList component to use both Firebase and the new API:

```jsx
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import TodoForm from "./TodoForm";
import Todo from "./Todo";
import EditTodoForm from "./EditToDoForm";
import todoApi from "../services/apiService";

const TodoList = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [useApi, setUseApi] = useState(false); // Toggle between Firebase and API

  // Firebase data fetching
  useEffect(() => {
    if (!user || useApi) return;

    const userTodosRef = collection(db, "users", user.uid, "todos");

    const unsubscribe = onSnapshot(userTodosRef, (snapshot) => {
      setTodos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [user, useApi]);

  // API data fetching
  useEffect(() => {
    if (!user || !useApi) return;

    const fetchTodos = async () => {
      try {
        const data = await todoApi.getAllTodos(user.uid);
        setTodos(data);
      } catch (error) {
        console.error("Error fetching todos from API:", error);
      }
    };

    fetchTodos();
  }, [user, useApi]);

  // Firebase operations
  const addToDoFirebase = async (task) => {
    if (!user) return;

    await addDoc(collection(db, "users", user.uid, "todos"), {
      task,
      completed: false,
      createdAt: new Date()
    });
  };

  const toggleCompleteFirebase = async (id, completed) => {
    if (!user) return;

    const taskRef = doc(db, "users", user.uid, "todos", id);
    await updateDoc(taskRef, { completed: !completed });
  };

  const deleteToDoFirebase = async (id) => {
    if (!user) return;

    const taskRef = doc(db, "users", user.uid, "todos", id);
    await deleteDoc(taskRef);
  };

  const updateTaskFirebase = async (id, newTask) => {
    if (!user) return;

    const taskRef = doc(db, "users", user.uid, "todos", id);
    await updateDoc(taskRef, { task: newTask });

    setEditingTask(null); // Exit edit mode
  };

  // API operations
  const addToDoApi = async (task) => {
    if (!user) return;

    await todoApi.createTodo({
      task,
      userId: user.uid
    });
    
    // Refresh todos
    const data = await todoApi.getAllTodos(user.uid);
    setTodos(data);
  };

  const toggleCompleteApi = async (id) => {
    if (!user) return;

    await todoApi.toggleTodoStatus(id);
    
    // Refresh todos
    const data = await todoApi.getAllTodos(user.uid);
    setTodos(data);
  };

  const deleteToDoApi = async (id) => {
    if (!user) return;

    await todoApi.deleteTodo(id);
    
    // Refresh todos
    const data = await todoApi.getAllTodos(user.uid);
    setTodos(data);
  };

  const updateTaskApi = async (id, newTask) => {
    if (!user) return;

    await todoApi.updateTodo(id, { task: newTask });

    // Refresh todos
    const data = await todoApi.getAllTodos(user.uid);
    setTodos(data);
    
    setEditingTask(null); // Exit edit mode
  };

  // Use the appropriate functions based on useApi state
  const addToDo = useApi ? addToDoApi : addToDoFirebase;
  const toggleComplete = useApi ? toggleCompleteApi : toggleCompleteFirebase;
  const deleteToDo = useApi ? deleteToDoApi : deleteToDoFirebase;
  const updateTask = useApi ? updateTaskApi : updateTaskFirebase;

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-6">
      <h1 className="text-2xl font-semibold text-center mb-4 text-black">To-Do List</h1>
      
      <div className="mb-4">
        <button 
          onClick={() => setUseApi(!useApi)}
          className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 w-full mb-2"
        >
          {useApi ? "Switch to Firebase" : "Switch to API"}
        </button>
        <p className="text-sm text-gray-600 text-center">
          Currently using: {useApi ? "REST API" : "Firebase"}
        </p>
      </div>
      
      <TodoForm addToDo={addToDo} />

      <button
        onClick={() => setShowCompleted(!showCompleted)}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
      >
        {showCompleted ? "Show All Tasks" : "Show Completed Tasks"}
      </button>

      <div className="space-y-3">
        {todos
          .filter((todo) => (showCompleted ? todo.completed : true))
          .map((todo) =>
            editingTask?.id === todo.id ? (
              <EditTodoForm key={todo.id} updateTask={updateTask} task={editingTask} />
            ) : (
              <Todo key={todo.id} task={todo} toggleComplete={toggleComplete} deleteToDo={deleteToDo} editToDo={editToDo} />
            )
          )}
      </div>
    </div>
  );
};

export default TodoList;
```

## Benefits of This Integration Approach

1. **Gradual Migration**: You can toggle between Firebase and the API, allowing for a gradual migration.
2. **Testing**: Compare functionality between both implementations.
3. **Flexibility**: Some features might work better with Firebase (real-time updates) while others benefit from the structured API approach.

## Next Steps

1. Add error handling and loading states to the UI
2. Implement proper authentication token handling for API requests
3. Add more comprehensive testing of both implementations
4. Consider adding WebSocket support to the API for real-time updates similar to Firebase 