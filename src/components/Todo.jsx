import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash, faCheck } from "@fortawesome/free-solid-svg-icons";
import PropTypes from 'prop-types';

const Todo = ({ todo, toggleComplete, deleteToDo, editToDo }) => {
  // Handle both API format (todo object) and local format
  const id = todo._id || todo.id;
  const task = todo.task; // both formats have task property
  const completed = todo.completed; // both formats have completed property
  
  // For debugging
  console.log("Rendering todo:", { id, task, completed });
  
  return (
    <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow">
      <p
        className={`cursor-pointer text-lg ${completed ? "line-through text-gray-500" : "text-black"}`}
        onClick={() => toggleComplete(id)}
      >
        {task}
      </p>

      <div className="flex gap-3">
        {/* Complete Task Button */}
        <FontAwesomeIcon
          icon={faCheck}
          className={`cursor-pointer ${completed ? "text-green-400" : "text-gray-400"} hover:text-green-600`}
          onClick={() => toggleComplete(id)}
        />

        {/* Edit Button */}
        <FontAwesomeIcon
          icon={faPenToSquare}
          className="text-yellow-500 cursor-pointer hover:text-yellow-600"
          onClick={() => editToDo(id, task)}
        />

        {/* Delete Button */}
        <FontAwesomeIcon
          icon={faTrash}
          className="text-red-500 cursor-pointer hover:text-red-600"
          onClick={() => deleteToDo(id)}
        />
      </div>
    </div>
  );
};

Todo.propTypes = {
  todo: PropTypes.shape({
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
