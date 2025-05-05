import express from 'express';
import { check } from 'express-validator';
import * as todoController from '../controllers/todoController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all todo routes
router.use(authMiddleware);

// Validation middleware
const validateTodo = [
  check('task')
    .notEmpty()
    .withMessage('Task is required')
    .isString()
    .withMessage('Task must be a string')
    .isLength({ min: 1, max: 500 })
    .withMessage('Task must be between 1 and 500 characters')
];

// Routes with swagger documentation
/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Todo management API
 */

// GET all todos for a user
router.get('/', todoController.getAllTodos);

// GET a single todo
router.get('/:id', todoController.getTodoById);

// POST create a new todo
router.post('/', validateTodo, todoController.createTodo);

// PUT update a todo
router.put('/:id', validateTodo, todoController.updateTodo);

// DELETE a todo
router.delete('/:id', todoController.deleteTodo);

// PATCH toggle todo status
router.patch('/:id/toggle', todoController.toggleTodoStatus);

export default router; 