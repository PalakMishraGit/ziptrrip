import React from 'react';
import { Calendar, ExternalLink, Trash2, ListChecks, Tag, Clock } from 'lucide-react';

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
    <div className={`task-card prio-stripe-${task.priority} ${isCompleted ? 'completed' : ''}`}>
      <div>
        <div className="task-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <input 
              type="checkbox" 
              className="custom-checkbox" 
              checked={isCompleted}
              onChange={() => onToggleStatus(task.id)}
              title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
            />
            <span className={`prio-badge ${priorityClass}`}>
              {task.priority}
            </span>
            {task.category && (
              <span className="task-cat-badge">
                <Tag size={10} style={{ marginRight: '3px' }} />
                {task.category}
              </span>
            )}
          </div>

          <button 
            className="btn btn-icon-danger" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            title="Delete task"
          >
            <Trash2 size={15} />
          </button>
        </div>

        <a href={`todo.html?id=${task.id}`} className="task-title" style={{ display: 'block', marginTop: '0.4rem' }}>
          {task.title}
        </a>

        {task.description && (
          <p className="task-desc">{task.description}</p>
        )}
      </div>

      <div>
        {task.totalSubtasks > 0 && (
          <div style={{ marginTop: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ListChecks size={13} color="var(--accent-primary)" /> 
                {task.completedSubtasks}/{task.totalSubtasks} Subtasks
              </span>
              <span>{subtaskProgress}%</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${subtaskProgress}%` }}></div>
            </div>
          </div>
        )}

        <div className="task-footer">
          <div className={`due-badge ${isOverdue ? 'overdue' : ''}`}>
            <Clock size={12} />
            <span>{formattedDueDate} {isOverdue && '(Overdue)'}</span>
          </div>

          <a href={`todo.html?id=${task.id}`} className="btn btn-outline-sm">
            View Details <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
