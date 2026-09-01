import express from 'express';
import { TodoController } from '../controllers/todoController.js';

const router = express.Router();

// Dashboard Statistics
router.get('/stats', TodoController.getStats);

// Main Todo CRUD Operations
router.get('/todos', TodoController.getTodos);
router.get('/todos/:id', TodoController.getTodoById);
router.post('/todos', TodoController.createTodo);
router.put('/todos/:id', TodoController.updateTodo);
router.patch('/todos/:id/toggle', TodoController.toggleTodoStatus);
router.delete('/todos/:id', TodoController.deleteTodo);

// Subtask Operations
router.post('/todos/:id/subtasks', TodoController.addSubtask);
router.patch('/subtasks/:subtaskId/toggle', TodoController.toggleSubtask);
router.delete('/subtasks/:subtaskId', TodoController.deleteSubtask);

export default router;
