import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '../components/Common/Sidebar.jsx';
import { Header } from '../components/Common/Header.jsx';
import { TodoApi } from '../api/todoApi.js';
import { 
  ArrowLeft, Calendar, Tag, AlertCircle, Save, CheckCircle2, 
  Trash2, Plus, History, Clock, Layers, ListChecks, Check
} from 'lucide-react';

export function DetailPage() {
  const [todoId, setTodoId] = useState(null);
  const [todo, setTodo] = useState(null);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, completionRate: 0, categories: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Editable fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('pending');
  const [category, setCategory] = useState('General');
  const [dueDate, setDueDate] = useState('');
  const [subtaskInput, setSubtaskInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Parse URL Query Parameter 'id'
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');
    setTodoId(idParam);
  }, []);

  // Fetch Single Todo by ID & Stats
  const loadTodo = useCallback(async () => {
    if (!todoId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [res, statsRes] = await Promise.all([
        TodoApi.fetchTodoById(todoId),
        TodoApi.fetchStats()
      ]);

      if (statsRes && statsRes.success) {
        setStats(statsRes.data);
      }

      if (res && res.success && res.data) {
        const item = res.data;
        setTodo(item);
        setTitle(item.title);
        setDescription(item.description || '');
        setPriority(item.priority || 'medium');
        setStatus(item.status || 'pending');
        setCategory(item.category || 'General');
        setDueDate(item.dueDate ? item.dueDate.split('T')[0] : '');
        setError(null);
      } else {
        setError(`Todo task with ID "${todoId}" was not found.`);
      }
    } catch (err) {
      console.error(err);
      setError('Error connecting to backend server');
    } finally {
      setLoading(false);
    }
  }, [todoId]);

  useEffect(() => {
    if (todoId) {
      loadTodo();
    }
  }, [todoId, loadTodo]);

  // Handle Save / Update Todo
  const handleSaveDetails = async (e) => {
    if (e) e.preventDefault();
    if (!todoId || !title.trim()) return;

    try {
      setIsSaving(true);
      await TodoApi.updateTodo(todoId, {
        title: title.trim(),
        description,
        priority,
        status,
        category: category || 'General',
        dueDate: dueDate ? new Date(dueDate).toISOString() : null
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      loadTodo();
    } catch (err) {
      alert('Failed to save todo details');
    } finally {
      setIsSaving(false);
    }
  };

  // Subtask handlers
  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!subtaskInput.trim() || !todoId) return;

    try {
      await TodoApi.addSubtask(todoId, subtaskInput.trim());
      setSubtaskInput('');
      loadTodo();
    } catch (err) {
      alert('Failed to add subtask');
    }
  };

  const handleToggleSubtask = async (subtaskId) => {
    try {
      await TodoApi.toggleSubtask(subtaskId);
      loadTodo();
    } catch (err) {
      alert('Failed to toggle subtask');
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      await TodoApi.deleteSubtask(subtaskId);
      loadTodo();
    } catch (err) {
      alert('Failed to delete subtask');
    }
  };

  const handleDeleteTodo = async () => {
    if (window.confirm('Are you sure you want to permanently delete this todo task?')) {
      try {
        await TodoApi.deleteTodo(todoId);
        window.location.href = 'index.html';
      } catch (err) {
        alert('Failed to delete todo task');
      }
    }
  };

  const subtasks = todo?.subtasks || [];
  const completedSubtasks = subtasks.filter(st => st.completed).length;
  const totalSubtasks = subtasks.length;
  const subtaskPercentage = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return (
    <div className="layout-wrapper">
      <Sidebar 
        currentFilter="all"
        onSelectFilter={() => { window.location.href = 'index.html'; }}
        categories={stats.categories || []}
        selectedCategory="all"
        onSelectCategory={() => { window.location.href = 'index.html'; }}
        stats={stats}
        onOpenCreateModal={() => { window.location.href = 'index.html'; }}
      />

      <div className="main-content">
        <Header currentPage="detail" title="Item Specification View" />

        {loading ? (
          <div className="empty-state">
            <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Loading task detail view...</div>
          </div>
        ) : !todoId || error ? (
          <div className="empty-state" style={{ maxWidth: '600px', margin: '3rem auto' }}>
            <AlertCircle size={48} color="#DC2626" style={{ marginBottom: '1rem' }} />
            <h2>Task Not Found</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              {!todoId 
                ? 'No "id" query parameter was provided in the URL string.' 
                : error}
            </p>
            <a href="index.html" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
              <ArrowLeft size={16} /> Return to Dashboard
            </a>
          </div>
        ) : (
          <>
            {/* Top Action Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="prio-badge prio-medium" style={{ fontFamily: 'var(--font-mono)' }}>
                  ID: {todo.id}
                </span>
                <span className="task-cat-badge">
                  <Tag size={11} style={{ marginRight: '4px' }} /> {todo.category}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleSaveDetails}
                  disabled={isSaving}
                >
                  {saveSuccess ? <Check size={16} /> : <Save size={16} />}
                  {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}
                </button>

                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleDeleteTodo}
                >
                  <Trash2 size={16} /> Delete Task
                </button>
              </div>
            </div>

            <div className="detail-layout">
              {/* Left Pane - Form & Subtasks */}
              <div>
                <div className="detail-card">
                  <form onSubmit={handleSaveDetails}>
                    <div className="form-group">
                      <label>Task Title</label>
                      <input 
                        type="text"
                        className="editable-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Task Title..."
                        required
                      />
                    </div>

                    <div className="form-group" style={{ marginTop: '1.5rem' }}>
                      <label>Description & Notes</label>
                      <textarea 
                        className="editable-desc"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add comprehensive specifications, technical notes, or requirements..."
                      />
                    </div>

                    <div className="form-row" style={{ marginTop: '1.5rem' }}>
                      <div className="form-group">
                        <label>Status</label>
                        <select 
                          className="form-control" 
                          value={status} 
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Priority Level</label>
                        <select 
                          className="form-control" 
                          value={priority} 
                          onChange={(e) => setPriority(e.target.value)}
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row" style={{ marginTop: '1rem' }}>
                      <div className="form-group">
                        <label>Category</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Due Date</label>
                        <input 
                          type="date" 
                          className="form-control" 
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </form>
                </div>

                {/* Subtask Section */}
                <div className="detail-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 800 }}>
                      <ListChecks size={18} color="var(--accent-primary)" /> Subtasks Checklist
                    </h3>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {completedSubtasks} of {totalSubtasks} completed ({subtaskPercentage}%)
                    </span>
                  </div>

                  <div className="progress-bar-container" style={{ marginBottom: '1.25rem', height: '8px' }}>
                    <div className="progress-bar-fill" style={{ width: `${subtaskPercentage}%` }}></div>
                  </div>

                  <form onSubmit={handleAddSubtask} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Add subtask step..."
                      value={subtaskInput}
                      onChange={(e) => setSubtaskInput(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                      <Plus size={16} /> Add Step
                    </button>
                  </form>

                  {subtasks.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.875rem' }}>
                      No subtasks added yet. Use the input above to break down this task.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {subtasks.map(st => (
                        <div key={st.id} className="subtask-item">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <input 
                              type="checkbox" 
                              className="custom-checkbox" 
                              checked={Boolean(st.completed)}
                              onChange={() => handleToggleSubtask(st.id)}
                            />
                            <span style={{ 
                              fontSize: '0.9rem', 
                              fontWeight: 500,
                              textDecoration: st.completed ? 'line-through' : 'none',
                              color: st.completed ? 'var(--text-muted)' : 'var(--text-primary)' 
                            }}>
                              {st.title}
                            </span>
                          </div>

                          <button 
                            type="button"
                            className="btn btn-icon-danger" 
                            onClick={() => handleDeleteSubtask(st.id)}
                            title="Delete subtask"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Sidebar Metadata */}
              <div>
                <div className="detail-card">
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>
                    Task Information
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Created At:</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        {new Date(todo.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Last Updated:</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        {new Date(todo.updatedAt).toLocaleString()}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Query Link:</span>
                      <a href={`todo.html?id=${todo.id}`} style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'underline' }}>
                        todo.html?id={todo.id}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="detail-card">
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <History size={16} color="var(--accent-primary)" /> Activity Log
                  </h3>

                  {todo.logs && todo.logs.length > 0 ? (
                    <div>
                      {todo.logs.map(log => (
                        <div key={log.id} className="activity-item">
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{log.action}</div>
                          <div className="time">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No activity logged yet.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
