import { TodoService } from '../services/todoService.js';

export const TodoController = {
  // GET /api/todos
  getTodos: (req, res, next) => {
    try {
      const { status, priority, category, search, sortBy, sortOrder } = req.query;
      const todos = TodoService.getAllTodos({ status, priority, category, search, sortBy, sortOrder });
      return res.status(200).json({
        success: true,
        count: todos.length,
        data: todos
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/todos/stats
  getStats: (req, res, next) => {
    try {
      const stats = TodoService.getStats();
      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/todos/:id
  getTodoById: (req, res, next) => {
    try {
      const { id } = req.params;
      const todo = TodoService.getTodoById(id);

      if (!todo) {
        return res.status(404).json({
          success: false,
          error: `Todo with ID '${id}' not found`
        });
      }

      return res.status(200).json({
        success: true,
        data: todo
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/todos
  createTodo: (req, res, next) => {
    try {
      const { title, description, category, priority, status, dueDate, subtasks } = req.body;

      if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Title is required and must be a non-empty string'
        });
      }

      if (priority && !['low', 'medium', 'high', 'urgent'].includes(priority)) {
        return res.status(400).json({
          success: false,
          error: 'Priority must be one of: low, medium, high, urgent'
        });
      }

      if (status && !['pending', 'in_progress', 'completed'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Status must be one of: pending, in_progress, completed'
        });
      }

      const newTodo = TodoService.createTodo({
        title: title.trim(),
        description: description || '',
        category: category || 'General',
        priority: priority || 'medium',
        status: status || 'pending',
        dueDate: dueDate || null,
        subtasks: subtasks || []
      });

      return res.status(201).json({
        success: true,
        message: 'Todo created successfully',
        data: newTodo
      });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/todos/:id
  updateTodo: (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, description, category, priority, status, dueDate } = req.body;

      if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
        return res.status(400).json({
          success: false,
          error: 'Title cannot be empty'
        });
      }

      if (priority !== undefined && !['low', 'medium', 'high', 'urgent'].includes(priority)) {
        return res.status(400).json({
          success: false,
          error: 'Priority must be one of: low, medium, high, urgent'
        });
      }

      if (status !== undefined && !['pending', 'in_progress', 'completed'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Status must be one of: pending, in_progress, completed'
        });
      }

      const updated = TodoService.updateTodo(id, req.body);

      if (!updated) {
        return res.status(404).json({
          success: false,
          error: `Todo with ID '${id}' not found`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Todo updated successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/todos/:id/toggle
  toggleTodoStatus: (req, res, next) => {
    try {
      const { id } = req.params;
      const updated = TodoService.toggleTodoStatus(id);

      if (!updated) {
        return res.status(404).json({
          success: false,
          error: `Todo with ID '${id}' not found`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Todo status toggled successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/todos/:id
  deleteTodo: (req, res, next) => {
    try {
      const { id } = req.params;
      const deleted = TodoService.deleteTodo(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: `Todo with ID '${id}' not found`
        });
      }

      return res.status(200).json({
        success: true,
        message: `Todo with ID '${id}' deleted successfully`
      });
    } catch (err) {
      next(err);
    }
  },

  // Subtasks endpoints
  addSubtask: (req, res, next) => {
    try {
      const { id } = req.params;
      const { title } = req.body;

      if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Subtask title is required'
        });
      }

      const updatedTodo = TodoService.addSubtask(id, title.trim());

      if (!updatedTodo) {
        return res.status(404).json({
          success: false,
          error: `Todo with ID '${id}' not found`
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Subtask added successfully',
        data: updatedTodo
      });
    } catch (err) {
      next(err);
    }
  },

  toggleSubtask: (req, res, next) => {
    try {
      const { subtaskId } = req.params;
      const updatedTodo = TodoService.toggleSubtask(subtaskId);

      if (!updatedTodo) {
        return res.status(404).json({
          success: false,
          error: `Subtask with ID '${subtaskId}' not found`
        });
      }

      return res.status(200).json({
        success: true,
        data: updatedTodo
      });
    } catch (err) {
      next(err);
    }
  },

  deleteSubtask: (req, res, next) => {
    try {
      const { subtaskId } = req.params;
      const updatedTodo = TodoService.deleteSubtask(subtaskId);

      if (!updatedTodo) {
        return res.status(404).json({
          success: false,
          error: `Subtask with ID '${subtaskId}' not found`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Subtask removed successfully',
        data: updatedTodo
      });
    } catch (err) {
      next(err);
    }
  }
};
