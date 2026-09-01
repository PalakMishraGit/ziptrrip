const API_BASE = '/api';

const isStaticHost = typeof window !== 'undefined' && (
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1'
);

const DEMO_TODOS = [
  {
    id: 'todo-1',
    title: 'Architect Enterprise Multi-Page React Router & State',
    description: 'Design robust modular architecture with Vite MPA rollup configuration and express RESTful API routing.',
    category: 'Architecture',
    priority: 'high',
    status: 'completed',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString(),
    totalSubtasks: 3,
    completedSubtasks: 3,
    subtasks: [
      { id: 'sub-1', todoId: 'todo-1', title: 'Define Vite MPA entrypoints', completed: 1 },
      { id: 'sub-2', todoId: 'todo-1', title: 'Implement query parameter parser', completed: 1 },
      { id: 'sub-3', todoId: 'todo-1', title: 'Add SQLite persistence schema', completed: 1 }
    ],
    logs: [
      { id: 'log-1', todoId: 'todo-1', action: 'Todo created in initial database seed', createdAt: new Date().toISOString() }
    ]
  },
  {
    id: 'todo-2',
    title: 'Implement 3D Card Flip Celebration & Confetti Engine',
    description: 'Build CSS 3D perspective flip with emerald green cover, bottom-to-top animated checkmark, and radial confetti explosion.',
    category: 'Design',
    priority: 'urgent',
    status: 'in_progress',
    dueDate: new Date(Date.now() + 172800000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    totalSubtasks: 4,
    completedSubtasks: 2,
    subtasks: [
      { id: 'sub-4', todoId: 'todo-2', title: 'Create perspective container', completed: 1 },
      { id: 'sub-5', todoId: 'todo-2', title: 'SVG checkmark stroke keyframes', completed: 1 },
      { id: 'sub-6', todoId: 'todo-2', title: '12-particle confetti explosion', completed: 0 },
      { id: 'sub-7', todoId: 'todo-2', title: '5-second celebration timer hold', completed: 0 }
    ],
    logs: [
      { id: 'log-2', todoId: 'todo-2', action: 'Todo created in initial database seed', createdAt: new Date().toISOString() }
    ]
  },
  {
    id: 'todo-3',
    title: 'Revolving Priority Laser Border Progress Sweeps',
    description: 'SVG laser path sweeping 0-100% around exact outer card border edge with priority color coding.',
    category: 'Frontend',
    priority: 'medium',
    status: 'pending',
    dueDate: new Date(Date.now() + 259200000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totalSubtasks: 2,
    completedSubtasks: 0,
    subtasks: [
      { id: 'sub-8', todoId: 'todo-3', title: 'Outer border path alignment', completed: 0 },
      { id: 'sub-9', todoId: 'todo-3', title: 'Auto-hide side accent bar on hover', completed: 0 }
    ],
    logs: [
      { id: 'log-3', todoId: 'todo-3', action: 'Todo created in initial database seed', createdAt: new Date().toISOString() }
    ]
  },
  {
    id: 'todo-4',
    title: 'Comprehensive Markdown Documentation & API Specifications',
    description: 'Write complete documentation suite in README.md, FEATURES.md, API.md, and ARCHITECTURE.md.',
    category: 'Documentation',
    priority: 'low',
    status: 'pending',
    dueDate: new Date(Date.now() + 345600000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totalSubtasks: 3,
    completedSubtasks: 1,
    subtasks: [
      { id: 'sub-10', todoId: 'todo-4', title: 'Feature breakdown specification', completed: 1 },
      { id: 'sub-11', todoId: 'todo-4', title: 'REST API OpenAPI reference', completed: 0 },
      { id: 'sub-12', todoId: 'todo-4', title: 'Senior architect rationale', completed: 0 }
    ],
    logs: [
      { id: 'log-4', todoId: 'todo-4', action: 'Todo created in initial database seed', createdAt: new Date().toISOString() }
    ]
  }
];

function getLocalTodos() {
  const stored = localStorage.getItem('ziptrrip_todos');
  if (!stored) {
    localStorage.setItem('ziptrrip_todos', JSON.stringify(DEMO_TODOS));
    return DEMO_TODOS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEMO_TODOS;
  }
}

function saveLocalTodos(todos) {
  localStorage.setItem('ziptrrip_todos', JSON.stringify(todos));
}

export const TodoApi = {
  // Fetch list of todos with search & filters
  async fetchTodos(params = {}) {
    if (!isStaticHost) {
      try {
        const query = new URLSearchParams();
        if (params.status && params.status !== 'all') query.append('status', params.status);
        if (params.priority && params.priority !== 'all') query.append('priority', params.priority);
        if (params.category && params.category !== 'all') query.append('category', params.category);
        if (params.search) query.append('search', params.search);
        if (params.sortBy) query.append('sortBy', params.sortBy);
        if (params.sortOrder) query.append('sortOrder', params.sortOrder);

        const res = await fetch(`${API_BASE}/todos?${query.toString()}`);
        if (res.ok) return await res.json();
      } catch {
        // Fallback if local backend is down
      }
    }

    // LocalStorage Engine for Static Hosting (GitHub Pages)
    let todos = getLocalTodos();

    if (params.status && params.status !== 'all') {
      todos = todos.filter(t => t.status === params.status);
    }
    if (params.priority && params.priority !== 'all') {
      todos = todos.filter(t => t.priority === params.priority);
    }
    if (params.category && params.category !== 'all') {
      todos = todos.filter(t => t.category === params.category);
    }
    if (params.search) {
      const s = params.search.toLowerCase();
      todos = todos.filter(t => t.title.toLowerCase().includes(s) || (t.description && t.description.toLowerCase().includes(s)));
    }

    // Sort
    const field = params.sortBy || 'createdAt';
    const isAsc = params.sortOrder === 'ASC';
    todos.sort((a, b) => {
      let valA = a[field] || '';
      let valB = b[field] || '';
      if (field === 'priority') {
        const weights = { urgent: 4, high: 3, medium: 2, low: 1 };
        valA = weights[valA] || 0;
        valB = weights[valB] || 0;
      }
      if (valA < valB) return isAsc ? -1 : 1;
      if (valA > valB) return isAsc ? 1 : -1;
      return 0;
    });

    return { success: true, count: todos.length, data: todos };
  },

  // Fetch dashboard statistics
  async fetchStats() {
    if (!isStaticHost) {
      try {
        const res = await fetch(`${API_BASE}/stats`);
        if (res.ok) return await res.json();
      } catch {
        // Fallback if local backend is down
      }
    }

    const todos = getLocalTodos();
    const total = todos.length;
    const completed = todos.filter(t => t.status === 'completed').length;
    const pending = todos.filter(t => t.status === 'pending').length;
    const inProgress = todos.filter(t => t.status === 'in_progress').length;
    const now = new Date();
    const overdue = todos.filter(t => t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < now).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const categories = Array.from(new Set(todos.map(t => t.category).filter(Boolean)));

    return {
      success: true,
      data: { total, completed, pending, inProgress, overdue, completionRate, categories }
    };
  },

  // Fetch single todo by ID
  async fetchTodoById(id) {
    if (!isStaticHost) {
      try {
        const res = await fetch(`${API_BASE}/todos/${id}`);
        if (res.status === 404) return null;
        if (res.ok) return await res.json();
      } catch {
        // Fallback if local backend is down
      }
    }

    const todos = getLocalTodos();
    const item = todos.find(t => t.id === id);
    if (!item) return null;
    return { success: true, data: item };
  },

  // Create new todo item
  async createTodo(todoData) {
    if (!isStaticHost) {
      try {
        const res = await fetch(`${API_BASE}/todos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(todoData)
        });
        if (res.ok) return await res.json();
      } catch {
        // Fallback
      }
    }

    const todos = getLocalTodos();
    const newId = `todo-${Date.now()}`;
    const subtasks = (todoData.subtasks || []).map((sub, idx) => ({
      id: `sub-${Date.now()}-${idx}`,
      todoId: newId,
      title: typeof sub === 'string' ? sub : sub.title,
      completed: 0
    }));

    const newTodo = {
      id: newId,
      title: todoData.title,
      description: todoData.description || '',
      category: todoData.category || 'General',
      priority: todoData.priority || 'medium',
      status: todoData.status || 'pending',
      dueDate: todoData.dueDate || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalSubtasks: subtasks.length,
      completedSubtasks: 0,
      subtasks,
      logs: [
        { id: `log-${Date.now()}`, todoId: newId, action: 'Task created', createdAt: new Date().toISOString() }
      ]
    };

    todos.unshift(newTodo);
    saveLocalTodos(todos);

    return { success: true, message: 'Todo created successfully', data: newTodo };
  },

  // Update existing todo item
  async updateTodo(id, todoData) {
    if (!isStaticHost) {
      try {
        const res = await fetch(`${API_BASE}/todos/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(todoData)
        });
        if (res.ok) return await res.json();
      } catch {
        // Fallback
      }
    }

    const todos = getLocalTodos();
    const idx = todos.findIndex(t => t.id === id);
    if (idx !== -1) {
      todos[idx] = { ...todos[idx], ...todoData, updatedAt: new Date().toISOString() };
      saveLocalTodos(todos);
      return { success: true, data: todos[idx] };
    }
    throw new Error('Task not found');
  },

  // Toggle todo status fast
  async toggleTodoStatus(id) {
    if (!isStaticHost) {
      try {
        const res = await fetch(`${API_BASE}/todos/${id}/toggle`, { method: 'PATCH' });
        if (res.ok) return await res.json();
      } catch {
        // Fallback
      }
    }

    const todos = getLocalTodos();
    const item = todos.find(t => t.id === id);
    if (item) {
      item.status = item.status === 'completed' ? 'pending' : 'completed';
      item.updatedAt = new Date().toISOString();
      saveLocalTodos(todos);
      return { success: true, data: item };
    }
    throw new Error('Task not found');
  },

  // Delete todo item
  async deleteTodo(id) {
    if (!isStaticHost) {
      try {
        const res = await fetch(`${API_BASE}/todos/${id}`, { method: 'DELETE' });
        if (res.ok) return await res.json();
      } catch {
        // Fallback
      }
    }

    let todos = getLocalTodos();
    todos = todos.filter(t => t.id !== id);
    saveLocalTodos(todos);
    return { success: true, message: 'Todo deleted successfully' };
  },

  // Subtask APIs
  async addSubtask(todoId, title) {
    if (!isStaticHost) {
      try {
        const res = await fetch(`${API_BASE}/todos/${todoId}/subtasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title })
        });
        if (res.ok) return await res.json();
      } catch {
        // Fallback
      }
    }

    const todos = getLocalTodos();
    const item = todos.find(t => t.id === todoId);
    if (item) {
      const newSub = { id: `sub-${Date.now()}`, todoId, title, completed: 0 };
      item.subtasks = item.subtasks || [];
      item.subtasks.push(newSub);
      item.totalSubtasks = item.subtasks.length;
      saveLocalTodos(todos);
      return { success: true, data: newSub };
    }
    throw new Error('Task not found');
  },

  async toggleSubtask(subtaskId) {
    if (!isStaticHost) {
      try {
        const res = await fetch(`${API_BASE}/subtasks/${subtaskId}/toggle`, { method: 'PATCH' });
        if (res.ok) return await res.json();
      } catch {
        // Fallback
      }
    }

    const todos = getLocalTodos();
    for (const item of todos) {
      const sub = (item.subtasks || []).find(s => s.id === subtaskId);
      if (sub) {
        sub.completed = sub.completed ? 0 : 1;
        item.completedSubtasks = item.subtasks.filter(s => s.completed === 1).length;
        saveLocalTodos(todos);
        return { success: true, data: sub };
      }
    }
    throw new Error('Subtask not found');
  },

  async deleteSubtask(subtaskId) {
    if (!isStaticHost) {
      try {
        const res = await fetch(`${API_BASE}/subtasks/${subtaskId}`, { method: 'DELETE' });
        if (res.ok) return await res.json();
      } catch {
        // Fallback
      }
    }

    const todos = getLocalTodos();
    for (const item of todos) {
      if (item.subtasks) {
        const initialLen = item.subtasks.length;
        item.subtasks = item.subtasks.filter(s => s.id !== subtaskId);
        if (item.subtasks.length !== initialLen) {
          item.totalSubtasks = item.subtasks.length;
          item.completedSubtasks = item.subtasks.filter(s => s.completed === 1).length;
          saveLocalTodos(todos);
          return { success: true, message: 'Subtask deleted' };
        }
      }
    }
    throw new Error('Subtask not found');
  }
};
