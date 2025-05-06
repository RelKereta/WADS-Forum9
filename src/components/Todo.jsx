import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash, faCheck } from "@fortawesome/free-solid-svg-icons";
import PropTypes from 'prop-types';

const Todo = ({ task, toggleComplete, deleteToDo, editToDo }) => {
  // Handle both API format (task object) and local format
  const id = task._id || task.id;
  const taskText = task.task; // both formats have task property
  const completed = task.completed; // both formats have completed property
  
  // For debugging
  console.log("Rendering todo:", { id, task: taskText, completed });
  
  return (
    <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow mb-3">
      <p
        className={`cursor-pointer text-lg ${completed ? "line-through text-gray-500" : "text-black"}`}
        onClick={toggleComplete}
      >
        {taskText}
      </p>

      <div className="flex gap-3">
        {/* Complete Task Button */}
        <FontAwesomeIcon
          icon={faCheck}
          className={`cursor-pointer ${completed ? "text-green-400" : "text-gray-400"} hover:text-green-600`}
          onClick={toggleComplete}
        />

        {/* Edit Button */}
        <FontAwesomeIcon
          icon={faPenToSquare}
          className="text-yellow-500 cursor-pointer hover:text-yellow-600"
          onClick={editToDo}
        />

        {/* Delete Button */}
        <FontAwesomeIcon
          icon={faTrash}
          className="text-red-500 cursor-pointer hover:text-red-600"
          onClick={deleteToDo}
        />
      </div>
    </div>
  );
};

Todo.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    task: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  }).isRequired,
  toggleComplete: PropTypes.func.isRequired,
  deleteToDo: PropTypes.func.isRequired,
  editToDo: PropTypes.func.isRequired
};

export default Todo;
