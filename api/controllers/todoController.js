import { validationResult } from 'express-validator';
import Todo from '../models/Todo.js';

// Get all todos for a user
/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Returns all todos for the authenticated user
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *       500:
 *         description: Server error
 */
const getAllTodos = async (req, res) => {
  try {
    // Get userId from session
    const userId = req.session.userId;
    console.log('[GET /todos] Request received from user:', userId);
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Find todos in MongoDB for this user
    const todos = await Todo.find({ userId }).sort({ createdAt: -1 });

    console.log(`[GET /todos] Found ${todos.length} todos for user ${userId}`);
    return res.status(200).json(todos);
  } catch (error) {
    console.error('[GET /todos] Error fetching todos:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single todo
/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get a todo by id
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Server error
 */
const getTodoById = async (req, res) => {
  try {
    const todoId = req.params.id;
    const userId = req.session.userId;
    
    console.log('[GET /todos/:id] Request received with id:', todoId);
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Find todo by id in MongoDB
    const todo = await Todo.findOne({ _id: todoId, userId });
    
    if (!todo) {
      console.log('[GET /todos/:id] Todo not found with id:', todoId);
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    console.log('[GET /todos/:id] Todo found:', todo._id);
    return res.status(200).json(todo);
  } catch (error) {
    console.error('[GET /todos/:id] Error fetching todo:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new todo
/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - task
 *               - userId
 *             properties:
 *               task:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Todo created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
const createTodo = async (req, res) => {
  console.log('[POST /todos] Request received with body:', req.body);
  
  // Validation check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('[POST /todos] Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { task } = req.body;
    
    console.log('[POST /todos] Creating todo with:', { task, userId });
    
    if (!task) {
      console.log('[POST /todos] Missing required field: task');
      return res.status(400).json({ 
        message: 'Task is required',
        receivedData: { task }
      });
    }
    
    // Create new todo in MongoDB
    const newTodo = new Todo({
      task,
      userId,
      completed: false
    });
    
    await newTodo.save();
    
    console.log('[POST /todos] Todo created successfully:', newTodo._id);
    return res.status(201).json(newTodo);
  } catch (error) {
    console.error('[POST /todos] Error creating todo:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a todo
/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update a todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               task:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Todo updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Server error
 */
const updateTodo = async (req, res) => {
  console.log('[PUT /todos/:id] Request received with body:', req.body);
  
  // Validation check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const todoId = req.params.id;
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { task } = req.body;
    
    // Update the todo in MongoDB
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: todoId, userId },
      { $set: { task } },
      { new: true } // Return the updated document
    );
    
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    console.log('[PUT /todos/:id] Todo updated successfully:', todoId);
    return res.status(200).json(updatedTodo);
  } catch (error) {
    console.error('[PUT /todos/:id] Error updating todo:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a todo
/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo deleted
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Server error
 */
const deleteTodo = async (req, res) => {
  try {
    const todoId = req.params.id;
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Delete the todo from MongoDB
    const deletedTodo = await Todo.findOneAndDelete({ _id: todoId, userId });
    
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    console.log('[DELETE /todos/:id] Todo deleted successfully:', todoId);
    return res.status(200).json({ message: 'Todo deleted successfully', todo: deletedTodo });
  } catch (error) {
    console.error('[DELETE /todos/:id] Error deleting todo:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle todo status
/**
 * @swagger
 * /api/todos/{id}/toggle:
 *   patch:
 *     summary: Toggle todo completion status
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo status toggled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Server error
 */
const toggleTodoStatus = async (req, res) => {
  try {
    const todoId = req.params.id;
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Find the todo first to know its current status
    const todo = await Todo.findOne({ _id: todoId, userId });
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    // Toggle completed status
    todo.completed = !todo.completed;
    await todo.save();
    
    console.log('[PATCH /todos/:id/toggle] Todo status toggled successfully:', todoId);
    return res.status(200).json(todo);
  } catch (error) {
    console.error('[PATCH /todos/:id/toggle] Error toggling todo status:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoStatus
}; 