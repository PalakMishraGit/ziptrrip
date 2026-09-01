import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/Common/Header.jsx';
import { TaskCard } from '../components/ListPage/TaskCard.jsx';
import { QuickAddModal } from '../components/ListPage/QuickAddModal.jsx';
import { TodoApi } from '../api/todoApi.js';
import { Search, Filter, Layers, CheckCircle2, Clock, AlertTriangle, ListTodo, SlidersHorizontal } from 'lucide-react';

export function ListPage() {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, inProgress: 0, overdue: 0, categories: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [todosRes, statsRes] = await Promise.all([
        TodoApi.fetchTodos({
          status: statusFilter,
          priority: priorityFilter,
          category: selectedCategory,
          search,
          sortBy,
          sortOrder
        }),
        TodoApi.fetchStats()
      ]);

      if (todosRes.success) setTodos(todosRes.data);
      if (statsRes.success) setStats(statsRes.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load tasks from server');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter, selectedCategory, search, sortBy, sortOrder]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleStatus = async (id) => {
    try {
      await TodoApi.toggleTodoStatus(id);
      loadData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDeleteTodo = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await TodoApi.deleteTodo(id);
        loadData();
      } catch (err) {
        alert('Failed to delete task');
      }
    }
  };

  const handleCreateTodo = async (todoData) => {
    try {
      await TodoApi.createTodo(todoData);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to create task');
    }
  };

  return (
    <div className="app-container">
      <Header currentPage="list" onOpenCreateModal={() => setIsModalOpen(true)} />

      {/* Metrics Dashboard */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Total Tasks</div>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-icon total"><ListTodo size={24} /></div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Pending / In Progress</div>
            <div className="stat-value">{stats.pending + stats.inProgress}</div>
          </div>
          <div className="stat-icon pending"><Clock size={24} /></div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{stats.completed} ({stats.completionRate || 0}%)</div>
          </div>
          <div className="stat-icon completed"><CheckCircle2 size={24} /></div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Overdue Tasks</div>
            <div className="stat-value">{stats.overdue}</div>
          </div>
          <div className="stat-icon overdue"><AlertTriangle size={24} /></div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="toolbar-card">
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks by title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select className="select-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select className="select-control" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select className="select-control" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="createdAt">Created Date</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority Order</option>
            <option value="title">Alphabetical</option>
          </select>

          <button 
            className="btn btn-secondary"
            onClick={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
            title="Toggle Sort Order"
          >
            <SlidersHorizontal size={16} /> {sortOrder}
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      {stats.categories && stats.categories.length > 0 && (
        <div className="category-chips">
          <div 
            className={`chip ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Categories
          </div>
          {stats.categories.map(cat => (
            <div 
              key={cat} 
              className={`chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </div>
          ))}
        </div>
      )}

      {/* Task List Grid */}
      {loading ? (
        <div className="empty-state">
          <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Loading tasks from server...</div>
        </div>
      ) : error ? (
        <div className="empty-state" style={{ borderColor: '#EF4444' }}>
          <div className="empty-icon">⚠️</div>
          <h3>{error}</h3>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={loadData}>Retry</button>
        </div>
      ) : todos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No tasks found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {search || statusFilter !== 'all' || priorityFilter !== 'all' 
              ? 'Try adjusting your search queries or active filters.'
              : 'Get started by creating your first todo task.'}
          </p>
          <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setIsModalOpen(true)}>
            + Create New Task
          </button>
        </div>
      ) : (
        <div className="task-grid">
          {todos.map(todo => (
            <TaskCard 
              key={todo.id} 
              task={todo} 
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteTodo}
            />
          ))}
        </div>
      )}

      {/* Create Todo Modal */}
      <QuickAddModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateTodo}
      />
    </div>
  );
}
