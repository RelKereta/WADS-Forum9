import { useState } from "react";

const TodoForm = ({ addToDo }) => {
  const [task, setTask] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    addToDo(task);
    setTask("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        placeholder="Add a task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="flex-grow p-2 border border-gray-300 rounded-md text-black"
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
        Add
      </button>
    </form>
  );
};

export default TodoForm;
