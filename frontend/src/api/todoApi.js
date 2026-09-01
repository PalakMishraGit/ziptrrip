const API_BASE = '/api';

export const TodoApi = {
  // Fetch list of todos with search & filters
  async fetchTodos(params = {}) {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.priority && params.priority !== 'all') query.append('priority', params.priority);
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);

    const res = await fetch(`${API_BASE}/todos?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch todos');
    return await res.json();
  },

  // Fetch dashboard statistics
  async fetchStats() {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return await res.json();
  },

  // Fetch single todo by ID
  async fetchTodoById(id) {
    const res = await fetch(`${API_BASE}/todos/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Failed to fetch todo item with ID '${id}'`);
    return await res.json();
  },

  // Create new todo item
  async createTodo(todoData) {
    const res = await fetch(`${API_BASE}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData)
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to create todo');
    }
    return await res.json();
  },

  // Update existing todo item
  async updateTodo(id, todoData) {
    const res = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData)
    });
    if (!res.ok) throw new Error('Failed to update todo');
    return await res.json();
  },

  // Toggle todo status fast
  async toggleTodoStatus(id) {
    const res = await fetch(`${API_BASE}/todos/${id}/toggle`, {
      method: 'PATCH'
    });
    if (!res.ok) throw new Error('Failed to toggle status');
    return await res.json();
  },

  // Delete todo item
  async deleteTodo(id) {
    const res = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete todo');
    return await res.json();
  },

  // Subtask APIs
  async addSubtask(todoId, title) {
    const res = await fetch(`${API_BASE}/todos/${todoId}/subtasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    if (!res.ok) throw new Error('Failed to add subtask');
    return await res.json();
  },

  async toggleSubtask(subtaskId) {
    const res = await fetch(`${API_BASE}/subtasks/${subtaskId}/toggle`, {
      method: 'PATCH'
    });
    if (!res.ok) throw new Error('Failed to toggle subtask');
    return await res.json();
  },

  async deleteSubtask(subtaskId) {
    const res = await fetch(`${API_BASE}/subtasks/${subtaskId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete subtask');
    return await res.json();
  }
};
