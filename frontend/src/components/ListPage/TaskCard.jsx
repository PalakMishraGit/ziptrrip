import React from 'react';
import { Calendar, CheckCircle2, Circle, ExternalLink, Trash2, ListChecks } from 'lucide-react';

export function TaskCard({ task, onToggleStatus, onDelete }) {
  const isCompleted = task.status === 'completed';

  const priorityClass = {
    low: 'prio-low',
    medium: 'prio-medium',
    high: 'prio-high',
    urgent: 'prio-urgent'
  }[task.priority] || 'prio-medium';

  const subtaskProgress = task.totalSubtasks > 0 
    ? Math.round((task.completedSubtasks / task.totalSubtasks) * 100)
    : 0;

  const formattedDueDate = task.dueDate 
    ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : 'No due date';

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted;

  return (
    <div className={`task-card ${isCompleted ? 'completed' : ''}`}>
      <div>
        <div className="task-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input 
              type="checkbox" 
              className="custom-checkbox" 
              checked={isCompleted}
              onChange={() => onToggleStatus(task.id)}
            />
            <span className={`prio-badge ${priorityClass}`}>
              {task.priority}
            </span>
          </div>

          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.35rem 0.6rem', color: '#EF4444' }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            title="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <a href={`todo.html?id=${task.id}`} className="task-title" style={{ display: 'block', marginTop: '0.5rem' }}>
          {task.title}
        </a>

        {task.description && (
          <p className="task-desc">{task.description}</p>
        )}
      </div>

      <div>
        {task.totalSubtasks > 0 && (
          <div style={{ marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <span><ListChecks size={12} style={{ display: 'inline', marginRight: '4px' }}/> {task.completedSubtasks}/{task.totalSubtasks} Subtasks</span>
              <span>{subtaskProgress}%</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${subtaskProgress}%` }}></div>
            </div>
          </div>
        )}

        <div className="task-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: isOverdue ? '#EF4444' : 'var(--text-muted)' }}>
            <Calendar size={13} />
            <span>{formattedDueDate} {isOverdue && '(Overdue)'}</span>
          </div>

          <a href={`todo.html?id=${task.id}`} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
            View Details <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
