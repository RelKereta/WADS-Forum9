import { useState } from "react";
import TodoForm from "./TodoForm";
import Todo from "./Todo";
import EditTodoForm from "./EditToDoForm";

const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);

  const addToDo = (task) => {
    setTodos([...todos, { id: Date.now(), task, completed: false, isEditing: false }]);
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const editToDo = (id, newTask) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, task: newTask, isEditing: false } : todo
      )
    );
  };

  const deleteToDo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const filteredTodos = showCompleted
    ? todos.filter((todo) => todo.completed)
    : todos;

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-6">
      <h1 className="text-2xl font-semibold text-center mb-4 text-black">To-Do List</h1>
      <TodoForm addToDo={addToDo} />

      <button
        onClick={() => setShowCompleted(!showCompleted)}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
      >
        {showCompleted ? "Show All Tasks" : "Show Completed Tasks"}
      </button>

      <div className="space-y-3">
        {filteredTodos.map((todo) =>
          todo.isEditing ? (
            <EditTodoForm key={todo.id} editToDo={editToDo} task={todo} />
          ) : (
            <Todo key={todo.id} task={todo} toggleComplete={toggleComplete} deleteToDo={deleteToDo} editToDo={() => editToDo(todo.id)} />
          )
        )}
      </div>
    </div>
  );
};

export default TodoWrapper;
