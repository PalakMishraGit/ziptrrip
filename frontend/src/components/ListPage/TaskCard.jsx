import React, { useState, useEffect } from 'react';
import { Calendar, ExternalLink, Trash2, ListChecks, Tag, Clock, ArrowRight, AlertCircle, Pin } from 'lucide-react';

export function TaskCard({ task, onToggleStatus, onDelete, isPinned: propPinned, onTogglePin }) {
  const [localPinned, setLocalPinned] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [localCompleted, setLocalCompleted] = useState(null);

  useEffect(() => {
    setLocalCompleted(null);
  }, [task.status]);

  const isPinned = propPinned !== undefined ? propPinned : localPinned;
  const isCompleted = localCompleted !== null ? localCompleted : (task.status === 'completed');

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    const nextCompleted = !isCompleted;
    setLocalCompleted(nextCompleted);

    if (nextCompleted) {
      // Trigger 3D Celebration Flip
      setIsFlipping(true);

      // Hold celebration on back face for full 5 seconds before flipping back
      setTimeout(() => {
        setIsFlipping(false);
        // Persist to parent/API after full 5-second celebration finishes
        onToggleStatus(task.id);
      }, 5000);
    } else {
      onToggleStatus(task.id);
    }
  };

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

  const handlePinClick = (e) => {
    e.stopPropagation();
    if (onTogglePin) {
      onTogglePin(task.id);
    } else {
      setLocalPinned(prev => !prev);
    }
  };

  return (
    <div className={`task-card-3d-wrapper ${isFlipping ? 'is-flipped' : ''}`}>
      <div className="task-card-3d-inner">
        {/* Front Face of Task Card */}
        <div className={`task-card prio-stripe-${task.priority} ${isCompleted ? 'completed' : ''} ${isPinned ? 'highlighted-card' : ''}`}>
          {/* SVG Overlay tracing exact outer border path */}
          <svg className="card-border-svg">
            <rect 
              x="0.75" 
              y="0.75" 
              width="calc(100% - 1.5px)" 
              height="calc(100% - 1.5px)" 
              rx="16" 
              ry="16" 
              pathLength="100" 
              className="border-rect"
            />
          </svg>

          <div className="task-card-inner-top">
            <div className="task-header">
              <div className="task-header-left">
                <input 
                  type="checkbox" 
                  className="custom-checkbox" 
                  checked={isCompleted}
                  onChange={handleCheckboxClick}
                  title={isCompleted ? 'Mark as pending' : 'Mark as completed with 3D flip & confetti'}
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <button 
                  className={`btn btn-icon-secondary ${isPinned ? 'pinned-active' : ''}`}
                  onClick={handlePinClick}
                  title={isPinned ? 'Unpin/Unhighlight task' : 'Pin/Highlight task with revolving border & shake'}
                  style={{
                    background: isPinned ? 'rgba(79, 70, 229, 0.15)' : 'transparent',
                    color: isPinned ? 'var(--accent-primary)' : 'var(--text-muted)',
                    border: 'none',
                    padding: '0.35rem',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Pin size={15} style={{ transform: isPinned ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s ease' }} />
                </button>

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

        {/* Back Face of Card - 3D Celebration Flip with Full Green Cover & Centered Animated Tick */}
        <div className="task-card-back">
          {/* Confetti Explosion Particles */}
          <div className="confetti-burst">
            <span className="confetti-p p1"></span>
            <span className="confetti-p p2"></span>
            <span className="confetti-p p3"></span>
            <span className="confetti-p p4"></span>
            <span className="confetti-p p5"></span>
            <span className="confetti-p p6"></span>
            <span className="confetti-p p7"></span>
            <span className="confetti-p p8"></span>
            <span className="confetti-p p9"></span>
            <span className="confetti-p p10"></span>
            <span className="confetti-p p11"></span>
            <span className="confetti-p p12"></span>
          </div>

          <div className="celebration-content">
            {/* SVG Checkmark stroke animated from bottom to top */}
            <div className="celebration-tick-wrapper">
              <svg className="animated-check-svg" viewBox="0 0 52 52">
                <circle className="animated-check-circle" cx="26" cy="26" r="23" fill="none" />
                <path className="animated-check-path" fill="none" d="M14 27 l7 7 l16 -16" />
              </svg>
            </div>
            <h3 className="celebration-title">TASK COMPLETED!</h3>
            <p className="celebration-subtitle">Great job! Keep up the momentum 🎉</p>
          </div>
        </div>
      </div>
    </div>
  );
}
