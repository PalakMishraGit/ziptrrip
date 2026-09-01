import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Target, Sparkles, Coffee } from 'lucide-react';

export function FocusModeWidget({ todos = [] }) {
  const [mode, setMode] = useState('focus'); // 'focus' (25m), 'short' (5m), 'long' (15m)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState('');

  // Initial durations in seconds
  const durations = {
    focus: 25 * 60,
    short: 5 * 60,
    long: 15 * 60
  };

  const activeTodos = todos.filter(t => t.status !== 'completed');

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
    <div className="panel-widget focus-widget">
      <div className="widget-header" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Target size={18} color="var(--accent-primary)" />
          <h3>Focus Session</h3>
        </div>
        {isRunning && (
          <span className="prio-badge prio-urgent" style={{ fontSize: '0.65rem', animation: 'pulse 1.5s infinite' }}>
            🔥 Active Focus
          </span>
        )}
      </div>

      <div className="focus-body">
        {/* Mode Selector Tabs */}
        <div className="focus-mode-tabs">
          <button 
            className={`focus-tab ${mode === 'focus' ? 'active' : ''}`}
            onClick={() => handleModeChange('focus')}
          >
            Focus (25m)
          </button>
          <button 
            className={`focus-tab ${mode === 'short' ? 'active' : ''}`}
            onClick={() => handleModeChange('short')}
          >
            Short Break
          </button>
          <button 
            className={`focus-tab ${mode === 'long' ? 'active' : ''}`}
            onClick={() => handleModeChange('long')}
          >
            Long Break
          </button>
        </div>

        {/* Big Digital Timer Display */}
        <div className="focus-timer-display">
          <span className="timer-text">{formatTime(timeLeft)}</span>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-container" style={{ height: '6px', marginBottom: '1rem' }}>
          <div className="progress-bar-fill" style={{ width: `${progressPct}%` }}></div>
        </div>

        {/* Select Focus Task */}
        {mode === 'focus' && (
          <div style={{ marginBottom: '1rem' }}>
            <select 
              className="select-control" 
              style={{ width: '100%', fontSize: '0.775rem' }}
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
            >
              <option value="">🎯 Select a task to focus on...</option>
              {activeTodos.map(t => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.priority})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className={`btn ${isRunning ? 'btn-secondary' : 'btn-primary'}`} 
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
            {isRunning ? 'Pause' : 'Start Focus'}
          </button>

          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.65rem' }}
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
