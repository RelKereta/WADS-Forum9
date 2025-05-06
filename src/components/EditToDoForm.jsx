import { useState, useEffect } from "react";
import PropTypes from 'prop-types';

const EditTodoForm = ({ editTask, task }) => {
  // Initialize value with the task string, handling different property structures
  const initialValue = typeof task === 'object' ? task.task : task;
  const [value, setValue] = useState(initialValue);

  // Update form when task changes
  useEffect(() => {
    setValue(typeof task === 'object' ? task.task : task);
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    
    // Get the id from the task object, handling both API and local formats
    const id = task._id || task.id;
    console.log(`Updating task with ID: ${id}, new value: ${value}`);
    editTask(id, value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 bg-gray-100 rounded-lg shadow mb-3">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-grow p-2 border border-gray-300 rounded-md text-black"
        autoFocus
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Update</button>
      <button 
        type="button" 
        onClick={() => editTask(null, '')}
        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
      >
        Cancel
      </button>
    </form>
  );
};

EditTodoForm.propTypes = {
  editTask: PropTypes.func.isRequired,
  task: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      task: PropTypes.string,
    })
  ]).isRequired
};

export default EditTodoForm;
