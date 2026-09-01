import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/Common/Header.jsx';
import { TodoApi } from '../api/todoApi.js';
import { 
  ArrowLeft, Calendar, Tag, AlertCircle, Save, CheckCircle2, 
  Trash2, Plus, History, Clock, Layers, ListChecks, Check
} from 'lucide-react';

export function DetailPage() {
  const [todoId, setTodoId] = useState(null);
  const [todo, setTodo] = useState(null);
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

  // 1. Parse URL Query Parameter 'id'
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');
    setTodoId(idParam);
  }, []);

  // 2. Fetch Single Todo by ID
  const loadTodo = useCallback(async () => {
    if (!todoId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await TodoApi.fetchTodoById(todoId);
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

  // Calculate subtask statistics
  const subtasks = todo?.subtasks || [];
  const completedSubtasks = subtasks.filter(st => st.completed).length;
  const totalSubtasks = subtasks.length;
  const subtaskPercentage = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Render Missing Query Parameter or Not Found Error State
  if (!loading && (!todoId || error)) {
    return (
      <div className="app-container">
        <Header currentPage="detail" />
        <div className="empty-state" style={{ maxWidth: '600px', margin: '4rem auto' }}>
          <AlertCircle size={48} color="#EF4444" style={{ marginBottom: '1rem' }} />
          <h2>Task Not Found</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {!todoId 
              ? 'No "id" query parameter was provided in the URL. (e.g. todo.html?id=todo-1)' 
              : error}
          </p>
          <a href="index.html" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
            <ArrowLeft size={16} /> Return to Todos List
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header currentPage="detail" />

      {loading ? (
        <div className="empty-state">
          <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Loading todo details...</div>
        </div>
      ) : (
        <>
          {/* Top Info Header Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="prio-badge prio-medium" style={{ fontFamily: 'var(--font-mono)' }}>
                ID: {todo.id}
              </span>
              <span className="chip" style={{ margin: 0 }}>
                <Tag size={12} style={{ display: 'inline', marginRight: '4px' }} /> {todo.category}
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
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>

          <div className="detail-layout">
            {/* Left Main Content Pane */}
            <div>
              {/* Task Core Form */}
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
                    <label>Detailed Description</label>
                    <textarea 
                      className="editable-desc"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Write comprehensive notes, requirements, and specifications here..."
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
                      <label>Category / Folder</label>
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

              {/* Subtask Checklist Section */}
              <div className="detail-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.15rem' }}>
                    <ListChecks size={20} color="var(--accent-primary)" /> Subtasks Checklist
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {completedSubtasks} of {totalSubtasks} completed ({subtaskPercentage}%)
                  </span>
                </div>

                <div className="progress-bar-container" style={{ marginBottom: '1.25rem', height: '8px' }}>
                  <div className="progress-bar-fill" style={{ width: `${subtaskPercentage}%` }}></div>
                </div>

                {/* Subtask Add Input */}
                <form onSubmit={handleAddSubtask} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Add a new subtask step..."
                    value={subtaskInput}
                    onChange={(e) => setSubtaskInput(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                    <Plus size={16} /> Add Step
                  </button>
                </form>

                {/* Subtask Items List */}
                {subtasks.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.875rem' }}>
                    No subtasks added yet. Use the input above to break this task down into actionable steps.
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
                            textDecoration: st.completed ? 'line-through' : 'none',
                            color: st.completed ? 'var(--text-muted)' : 'var(--text-primary)' 
                          }}>
                            {st.title}
                          </span>
                        </div>

                        <button 
                          type="button"
                          className="btn btn-secondary" 
                          style={{ padding: '0.25rem 0.5rem', color: '#EF4444' }}
                          onClick={() => handleDeleteSubtask(st.id)}
                          title="Delete subtask"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar Metadata & Audit Log */}
            <div>
              {/* Task Metadata Overview */}
              <div className="detail-card">
                <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                  Task Metadata
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Created At:</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>
                      {new Date(todo.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Last Updated:</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>
                      {new Date(todo.updatedAt).toLocaleString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Query Link:</span>
                    <a href={`todo.html?id=${todo.id}`} style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>
                      todo.html?id={todo.id}
                    </a>
                  </div>
                </div>
              </div>

              {/* Audit & Activity Log */}
              <div className="detail-card">
                <h3 style={{ fontSize: '1.05rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <History size={18} color="var(--accent-cyan)" /> Activity History
                </h3>

                {todo.logs && todo.logs.length > 0 ? (
                  <div>
                    {todo.logs.map(log => (
                      <div key={log.id} className="activity-item">
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{log.action}</div>
                        <div className="time">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
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
  );
}
