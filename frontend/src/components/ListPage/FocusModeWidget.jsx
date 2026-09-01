import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Target, Sparkles, ChevronDown, Check, X } from 'lucide-react';

export function FocusModeWidget({ todos = [] }) {
  const [mode, setMode] = useState('focus'); // 'focus' (25m), 'short' (5m), 'long' (15m)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef(null);

  // Initial durations in seconds
  const durations = {
    focus: 25 * 60,
    short: 5 * 60,
    long: 15 * 60
  };

  const activeTodos = todos.filter(t => t.status !== 'completed');
  const selectedTask = activeTodos.find(t => String(t.id) === String(selectedTaskId));

  // Change mode
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(durations[newMode]);
  };

  // Timer interval effect
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Close task picker on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format seconds into MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(durations[mode]);
  };

  const progressPct = Math.round(((durations[mode] - timeLeft) / durations[mode]) * 100);

  return (
    <div className="panel-widget focus-widget" style={{ overflow: 'visible' }}>
      <div className="widget-header" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Target size={17} color="var(--accent-primary)" />
          <h3>Focus Session</h3>
        </div>
        {isRunning && (
          <span className="prio-badge prio-urgent" style={{ fontSize: '0.625rem', padding: '0.15rem 0.45rem' }}>
            🔥 Active
          </span>
        )}
      </div>

      <div className="focus-body">
        {/* Compact & Clean Mode Selector Tabs */}
        <div className="focus-mode-tabs">
          <button 
            className={`focus-tab ${mode === 'focus' ? 'active' : ''}`}
            onClick={() => handleModeChange('focus')}
            title="Focus Session (25m)"
          >
            25m Focus
          </button>
          <button 
            className={`focus-tab ${mode === 'short' ? 'active' : ''}`}
            onClick={() => handleModeChange('short')}
            title="Short Break (5m)"
          >
            5m Short
          </button>
          <button 
            className={`focus-tab ${mode === 'long' ? 'active' : ''}`}
            onClick={() => handleModeChange('long')}
            title="Long Break (15m)"
          >
            15m Long
          </button>
        </div>

        {/* Digital Countdown Timer Display */}
        <div className="focus-timer-display">
          <span className="timer-text">{formatTime(timeLeft)}</span>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-container" style={{ height: '5px', marginBottom: '0.85rem' }}>
          <div className="progress-bar-fill" style={{ width: `${progressPct}%` }}></div>
        </div>

        {/* Modern & Cool Custom Task Selector */}
        {mode === 'focus' && (
          <div style={{ position: 'relative', marginBottom: '0.85rem' }} ref={pickerRef}>
            <button 
              type="button"
              className={`focus-task-selector-btn ${selectedTask ? 'selected' : ''}`}
              onClick={() => setIsPickerOpen(prev => !prev)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0, flex: 1 }}>
                <Sparkles size={14} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                <span className="selector-label">
                  {selectedTask ? selectedTask.title : 'Pin a task to focus...'}
                </span>
              </div>
              {selectedTask ? (
                <div 
                  onClick={(e) => { e.stopPropagation(); setSelectedTaskId(''); }}
                  style={{ display: 'flex', alignItems: 'center', opacity: 0.8, padding: '2px' }}
                  title="Unpin Task"
                >
                  <X size={14} />
                </div>
              ) : (
                <ChevronDown size={14} style={{ opacity: 0.7, transform: isPickerOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
              )}
            </button>

            {/* Task Picker Dropdown Popover */}
            {isPickerOpen && (
              <div className="task-picker-popover">
                <div className="picker-header">
                  <span>Select Active Task</span>
                  <button className="btn-close-picker" onClick={() => setIsPickerOpen(false)}>
                    <X size={13} />
                  </button>
                </div>

                <div className="picker-list">
                  {activeTodos.length > 0 ? (
                    activeTodos.map(task => (
                      <div 
                        key={task.id}
                        className={`picker-item ${String(task.id) === String(selectedTaskId) ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedTaskId(task.id);
                          setIsPickerOpen(false);
                        }}
                      >
                        <span className="picker-item-title">{task.title}</span>
                        {String(task.id) === String(selectedTaskId) && (
                          <Check size={13} color="var(--accent-primary)" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="picker-empty">No active tasks available</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Timer Control Action Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className={`btn ${isRunning ? 'btn-secondary' : 'btn-primary'}`}
            style={{ flex: 1, justifyContent: 'center', padding: '0.55rem', fontSize: '0.825rem' }}
            onClick={() => setIsRunning(prev => !prev)}
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
            <span>{isRunning ? 'Pause Focus' : 'Start Focus'}</span>
          </button>

          <button 
            className="btn btn-secondary"
            style={{ padding: '0.55rem', justifyContent: 'center' }}
            onClick={handleReset}
            title="Reset Timer"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
