import db from '../db/database.js';
import { cryptoRandomString } from '../utils/helpers.js';

export const TodoService = {
  // Get all todos with filtering, sorting, search, pagination
  getAllTodos: (filters = {}) => {
    const { status, priority, category, search, sortBy = 'createdAt', sortOrder = 'DESC' } = filters;
    
    let query = `
      SELECT t.*, 
        COUNT(s.id) as totalSubtasks,
        SUM(CASE WHEN s.completed = 1 THEN 1 ELSE 0 END) as completedSubtasks
      FROM todos t
      LEFT JOIN subtasks s ON t.id = s.todoId
      WHERE 1=1
    `;
    
    const params = [];

    if (status && status !== 'all') {
      query += ` AND t.status = ?`;
      params.push(status);
    }

    if (priority && priority !== 'all') {
      query += ` AND t.priority = ?`;
      params.push(priority);
    }

    if (category && category !== 'all') {
      query += ` AND t.category = ?`;
      params.push(category);
    }

    if (search && search.trim() !== '') {
      query += ` AND (t.title LIKE ? OR t.description LIKE ?)`;
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    query += ` GROUP BY t.id`;

    // Allowed sort columns
    const allowedSortColumns = {
      createdAt: 't.createdAt',
      dueDate: 't.dueDate',
      priority: `CASE t.priority 
                  WHEN 'urgent' THEN 1 
                  WHEN 'high' THEN 2 
                  WHEN 'medium' THEN 3 
                  WHEN 'low' THEN 4 
                  ELSE 5 END`,
      title: 't.title'
    };

    const sortCol = allowedSortColumns[sortBy] || 't.createdAt';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    query += ` ORDER BY ${sortCol} ${order}`;

    const stmt = db.prepare(query);
    const todos = stmt.all(...params);
    
    return todos.map(t => ({
      ...t,
      totalSubtasks: t.totalSubtasks || 0,
      completedSubtasks: t.completedSubtasks || 0
    }));
  },

  // Get single todo by ID with subtasks and activity logs
  getTodoById: (id) => {
    const todoStmt = db.prepare('SELECT * FROM todos WHERE id = ?');
    const todo = todoStmt.get(id);

    if (!todo) return null;

    const subtasksStmt = db.prepare('SELECT * FROM subtasks WHERE todoId = ? ORDER BY createdAt ASC');
    const subtasks = subtasksStmt.all(id);

    const logsStmt = db.prepare('SELECT * FROM activity_logs WHERE todoId = ? ORDER BY createdAt DESC');
    const logs = logsStmt.all(id);

    return {
      ...todo,
      subtasks,
      logs
    };
  },

  // Create a new todo
  createTodo: (data) => {
    const { title, description = '', category = 'General', priority = 'medium', status = 'pending', dueDate = null, subtasks = [] } = data;
    const id = 'todo-' + cryptoRandomString(8);
    const now = new Date().toISOString();

    const insertTodo = db.prepare(`
      INSERT INTO todos (id, title, description, category, priority, status, dueDate, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertSubtask = db.prepare(`
      INSERT INTO subtasks (id, todoId, title, completed, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `);

    const insertLog = db.prepare(`
      INSERT INTO activity_logs (id, todoId, action, createdAt)
      VALUES (?, ?, ?, ?)
    `);

    db.transaction(() => {
      insertTodo.run(id, title, description, category, priority, status, dueDate, now, now);
      
      insertLog.run('log-' + cryptoRandomString(8), id, `Todo created with title "${title}"`, now);

      if (Array.isArray(subtasks)) {
        for (const st of subtasks) {
          if (st && st.title) {
            insertSubtask.run('sub-' + cryptoRandomString(8), id, st.title, st.completed ? 1 : 0, now);
          }
        }
      }
    })();

    return TodoService.getTodoById(id);
  },

  // Update existing todo
  updateTodo: (id, data) => {
    const existing = TodoService.getTodoById(id);
    if (!existing) return null;

    const { title, description, category, priority, status, dueDate } = data;
    const now = new Date().toISOString();

    const newTitle = title !== undefined ? title : existing.title;
    const newDesc = description !== undefined ? description : existing.description;
    const newCat = category !== undefined ? category : existing.category;
    const newPrio = priority !== undefined ? priority : existing.priority;
    const newStatus = status !== undefined ? status : existing.status;
    const newDueDate = dueDate !== undefined ? dueDate : existing.dueDate;

    const stmt = db.prepare(`
      UPDATE todos 
      SET title = ?, description = ?, category = ?, priority = ?, status = ?, dueDate = ?, updatedAt = ?
      WHERE id = ?
    `);

    const insertLog = db.prepare(`
      INSERT INTO activity_logs (id, todoId, action, createdAt)
      VALUES (?, ?, ?, ?)
    `);

    db.transaction(() => {
      stmt.run(newTitle, newDesc, newCat, newPrio, newStatus, newDueDate, now, id);

      let logMessage = 'Updated todo details';
      if (existing.status !== newStatus) {
        logMessage = `Changed status from "${existing.status}" to "${newStatus}"`;
      } else if (existing.priority !== newPrio) {
        logMessage = `Changed priority from "${existing.priority}" to "${newPrio}"`;
      }
      
      insertLog.run('log-' + cryptoRandomString(8), id, logMessage, now);
    })();

    return TodoService.getTodoById(id);
  },

  // Toggle todo status fast
  toggleTodoStatus: (id) => {
    const existing = TodoService.getTodoById(id);
    if (!existing) return null;

    const newStatus = existing.status === 'completed' ? 'pending' : 'completed';
    return TodoService.updateTodo(id, { status: newStatus });
  },

  // Delete todo
  deleteTodo: (id) => {
    const existing = TodoService.getTodoById(id);
    if (!existing) return false;

    const stmt = db.prepare('DELETE FROM todos WHERE id = ?');
    stmt.run(id);
    return true;
  },

  // Subtask management
  addSubtask: (todoId, title) => {
    const todo = TodoService.getTodoById(todoId);
    if (!todo) return null;

    const subId = 'sub-' + cryptoRandomString(8);
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO subtasks (id, todoId, title, completed, createdAt)
      VALUES (?, ?, ?, 0, ?)
    `);

    const insertLog = db.prepare(`
      INSERT INTO activity_logs (id, todoId, action, createdAt)
      VALUES (?, ?, ?, ?)
    `);

    db.transaction(() => {
      stmt.run(subId, todoId, title, now);
      insertLog.run('log-' + cryptoRandomString(8), todoId, `Added subtask "${title}"`, now);
    })();

    return TodoService.getTodoById(todoId);
  },

  toggleSubtask: (subtaskId) => {
    const getStmt = db.prepare('SELECT * FROM subtasks WHERE id = ?');
    const subtask = getStmt.get(subtaskId);
    if (!subtask) return null;

    const newCompleted = subtask.completed ? 0 : 1;
    const updateStmt = db.prepare('UPDATE subtasks SET completed = ? WHERE id = ?');
    updateStmt.run(newCompleted, subtaskId);

    return TodoService.getTodoById(subtask.todoId);
  },

  deleteSubtask: (subtaskId) => {
    const getStmt = db.prepare('SELECT * FROM subtasks WHERE id = ?');
    const subtask = getStmt.get(subtaskId);
    if (!subtask) return null;

    const deleteStmt = db.prepare('DELETE FROM subtasks WHERE id = ?');
    deleteStmt.run(subtaskId);

    return TodoService.getTodoById(subtask.todoId);
  },

  // Get aggregated dashboard statistics
  getStats: () => {
    const totalStmt = db.prepare('SELECT COUNT(*) as count FROM todos');
    const completedStmt = db.prepare("SELECT COUNT(*) as count FROM todos WHERE status = 'completed'");
    const pendingStmt = db.prepare("SELECT COUNT(*) as count FROM todos WHERE status = 'pending'");
    const inProgressStmt = db.prepare("SELECT COUNT(*) as count FROM todos WHERE status = 'in_progress'");
    
    const now = new Date().toISOString();
    const overdueStmt = db.prepare("SELECT COUNT(*) as count FROM todos WHERE status != 'completed' AND dueDate IS NOT NULL AND dueDate < ?");

    const categoriesStmt = db.prepare('SELECT DISTINCT category FROM todos');

    const total = totalStmt.get().count;
    const completed = completedStmt.get().count;
    const pending = pendingStmt.get().count;
    const inProgress = inProgressStmt.get().count;
    const overdue = overdueStmt.get(now).count;
    const categories = categoriesStmt.all().map(c => c.category);

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      inProgress,
      overdue,
      completionRate,
      categories
    };
  }
};
