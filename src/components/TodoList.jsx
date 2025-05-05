import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import TodoForm from "./TodoForm";
import Todo from "./Todo";
import EditTodoForm from "./EditToDoForm";
import todoApi from "../services/apiService";
import { v4 as uuidv4 } from 'uuid';

// Hardcoded todos for offline development
const HARDCODED_TODOS = [
  {
    id: uuidv4(),
    task: 'Complete WADS Assignment 8',
    completed: false
  },
  {
    id: uuidv4(),
    task: 'Implement Sequelize ORM',
    completed: true
  },
  {
    id: uuidv4(),
    task: 'Add Swagger Documentation',
    completed: false
  },
  {
    id: uuidv4(),
    task: 'Study for final exam',
    completed: false
  },
  {
    id: uuidv4(),
    task: 'Review lecture notes',
    completed: false
  }
];

const TodoList = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [useLocalData, setUseLocalData] = useState(false); // Default to API instead of local data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API data fetching
  useEffect(() => {
    if (!user || useLocalData) return;

    const fetchTodos = async () => {
      try {
        setLoading(true);
        setError(null);
        // Use either _id or id from user, whichever is available
        const userId = user._id || user.id || 'unknown';
        console.log("Fetching todos for user:", userId);
        console.log("Auth token:", localStorage.getItem("auth_token"));
        const data = await todoApi.getAll();
        console.log("API returned todos:", data);
        setTodos(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching todos from API:", error);
        
        // Check for authentication issues
        if (error.response && error.response.status === 401) {
          setError("Authentication error - please log in again");
        } else if (error.response) {
          setError(`Failed to load todos: ${error.response.data?.message || error.response.statusText}`);
        } else if (error.request) {
          setError("Cannot connect to the server. Is it running?");
          // Fallback to local data if API is unreachable
          console.log("API unreachable, falling back to local data");
          setUseLocalData(true);
        } else {
          setError(`Error: ${error.message}`);
        }
        
        setLoading(false);
      }
    };

    fetchTodos();
  }, [user, useLocalData]);

  // Local data loading
  useEffect(() => {
    if (!useLocalData) return;
    
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      console.log("Loading hardcoded todos");
      setTodos(HARDCODED_TODOS);
      setLoading(false);
    }, 500);
  }, [useLocalData]);

  // API operations
  const addToDo = async (task) => {
    if (useLocalData) {
      // For local data, just add to state
      const newTodo = {
        id: uuidv4(),
        task,
        completed: false
      };
      setTodos(prevTodos => [...prevTodos, newTodo]);
      return;
    }

    if (!user) return;

    try {
      setLoading(true);
      const todoData = { task };
      console.log("Adding todo via API:", todoData);
      const newTodo = await todoApi.create(todoData);
      console.log("API returned new todo:", newTodo);
      
      // Add the new todo to the state
      if (newTodo) {
        setTodos(prevTodos => [...prevTodos, newTodo]);
      } else {
        // If no response, refresh the todos list
        const data = await todoApi.getAll();
        setTodos(Array.isArray(data) ? data : []);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error adding todo via API:", error);
      setError("Failed to add todo via API");
      setLoading(false);
    }
  };

  const toggleComplete = async (id) => {
    if (useLocalData) {
      // For local data, just update state
      setTodos(prevTodos => 
        prevTodos.map(todo => 
          todo.id === id ? {...todo, completed: !todo.completed} : todo
        )
      );
      return;
    }

    if (!user) return;

    try {
      setLoading(true);
      console.log("Toggling todo via API:", id);
      const updated = await todoApi.toggleComplete(id);
      console.log("API returned updated todo:", updated);
      
      // Update the todo in the state - compare by _id or id
      setTodos(prevTodos => 
        prevTodos.map(todo => 
          (todo._id === id || todo.id === id) ? updated : todo
        )
      );
      setLoading(false);
    } catch (error) {
      console.error("Error toggling todo via API:", error);
      setError("Failed to update todo via API");
      setLoading(false);
    }
  };

  const deleteToDo = async (id) => {
    if (useLocalData) {
      // For local data, just filter from state
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      return;
    }

    if (!user) return;

    try {
      setLoading(true);
      console.log("Deleting todo via API:", id);
      await todoApi.delete(id);
      
      // Remove the todo from the state - filter out the matching todo
      setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id && todo.id !== id));
      setLoading(false);
    } catch (error) {
      console.error("Error deleting todo via API:", error);
      setError("Failed to delete todo via API");
      setLoading(false);
    }
  };

  const updateTask = async (id, newTask) => {
    if (useLocalData) {
      // For local data, just update state
      setTodos(prevTodos => 
        prevTodos.map(todo => 
          todo.id === id ? {...todo, task: newTask} : todo
        )
      );
      setEditingTask(null); // Exit edit mode
      return;
    }

    if (!user) return;

    try {
      setLoading(true);
      console.log("Updating todo via API:", id, newTask);
      const updated = await todoApi.update(id, { task: newTask });
      console.log("API returned updated todo:", updated);
      
      // Update the todo in the state - compare by _id or id
      setTodos(prevTodos => 
        prevTodos.map(todo => 
          (todo._id === id || todo.id === id) ? updated : todo
        )
      );
      
      setEditingTask(null); // Exit edit mode
      setLoading(false);
    } catch (error) {
      console.error("Error updating todo via API:", error);
      setError("Failed to update todo via API");
      setLoading(false);
    }
  };

  const editToDo = (id, task) => {
    console.log(`Setting up edit for todo ID: ${id}, task: ${task}`);
    // Find the complete todo object for editing
    const todoToEdit = todos.find(todo => todo._id === id || todo.id === id);
    
    if (todoToEdit) {
      // Pass the full todo object but with the id field in the format expected by the update function
      setEditingTask({ 
        id: id, // Ensure we use the ID used for the API calls
        task: task,
        _id: todoToEdit._id,
        completed: todoToEdit.completed
      });
    } else {
      console.error(`Could not find todo with ID: ${id}`);
      // Fallback to just id and task
      setEditingTask({ id, task });
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-6">
      <h1 className="text-2xl font-semibold text-center mb-4 text-black">To-Do List</h1>
      
      <div className="mb-4">
        <button 
          onClick={() => setUseLocalData(!useLocalData)}
          className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 w-full mb-2"
        >
          {useLocalData ? "Switch to API Backend" : "Switch to Local Data"}
        </button>
        <p className="text-sm text-gray-600 text-center">
          Currently using: {useLocalData ? "Local Data (Offline)" : "Database API (Sequelize)"}
        </p>
      </div>
       
      <TodoForm addToDo={addToDo} />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <button
        onClick={() => setShowCompleted(!showCompleted)}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
      >
        {showCompleted ? "Show All Tasks" : "Show Completed Tasks"}
      </button>

      {loading ? (
        <div className="text-center py-4">Loading todos...</div>
      ) : (
        <div className="space-y-3">
          {todos.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No tasks available</div>
          ) : (
            todos
              .filter((todo) => (showCompleted ? todo.completed : true))
              .map((todo) => {
                // Ensure todo has an id for the key prop
                const todoId = todo._id || todo.id;
                
                return editingTask?.id === todoId ? (
                  <EditTodoForm 
                    key={todoId} 
                    updateTask={updateTask} 
                    task={editingTask} 
                    setEditingTask={setEditingTask}
                  />
                ) : (
                  <Todo 
                    key={todoId} 
                    todo={todo} 
                    toggleComplete={toggleComplete} 
                    deleteToDo={deleteToDo} 
                    editToDo={editToDo} 
                  />
                );
              })
          )}
        </div>
      )}
       
      <div className="mt-4 text-xs text-gray-500">
        <p>Debug info:</p>
        <p>User ID: {user?.id || 'Not logged in'}</p>
        <p>Email: {user?.email || 'Not logged in'}</p>
        <p>Todos count: {todos.length}</p>
        <p>Data source: {useLocalData ? "Local" : "API"}</p>
      </div>
    </div>
  );
};

export default TodoList;
