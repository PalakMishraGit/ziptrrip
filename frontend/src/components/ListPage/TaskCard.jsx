import React from 'react';
import { Calendar, ExternalLink, Trash2, ListChecks, Tag, Clock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

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
      <div className="task-card-inner-top">
        <div className="task-header">
          <div className="task-header-left">
            <input 
              type="checkbox" 
              className="custom-checkbox" 
              checked={isCompleted}
              onChange={() => onToggleStatus(task.id)}
              title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
            />
            <span className={`prio-badge ${priorityClass}`}>
              {task.priority === 'urgent' && <AlertCircle size={10} style={{ marginRight: '3px' }} />}
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

        <a href={`todo.html?id=${task.id}`} className="task-title">
          {task.title}
        </a>

        {task.description && (
          <p className="task-desc">{task.description}</p>
        )}
      </div>

      <div className="task-card-inner-bottom">
        {task.totalSubtasks > 0 && (
          <div className="task-subtask-wrapper">
            <div className="subtask-header-info">
              <span className="subtask-label">
                <ListChecks size={13} className="subtask-icon" /> 
                {task.completedSubtasks}/{task.totalSubtasks} Subtasks
              </span>
              <span className="subtask-percent">{subtaskProgress}%</span>
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

          <a href={`todo.html?id=${task.id}`} className="btn btn-outline-sm btn-details-link">
            View Details <ArrowRight size={13} className="details-arrow" />
          </a>
        </div>
      </div>
    </div>
  );
}
