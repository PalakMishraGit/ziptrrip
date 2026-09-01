import React from 'react';
import { Clock, History, PieChart, ArrowUpRight, CheckCircle2, Calendar, Tag } from 'lucide-react';
import { FocusModeWidget } from './FocusModeWidget.jsx';

export function RightPanel({ todos = [], stats = { categories: [] } }) {
  // Extract upcoming active tasks dynamically sorted by target/due date
  const upcomingTasks = todos
    .filter(t => t.status !== 'completed')
    .map(t => ({
      ...t,
      effectiveDate: t.dueDate ? new Date(t.dueDate) : new Date(t.createdAt)
    }))
    .sort((a, b) => a.effectiveDate - b.effectiveDate)
    .slice(0, 4);

  // Recent activity logs compiled dynamically from task audit logs
  const recentLogs = todos
    .flatMap(t => (t.logs || []).map(l => ({ ...l, taskTitle: t.title })))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <aside className="right-panel">
      {/* Interactive Focus Session Pomodoro Widget */}
      <FocusModeWidget todos={todos} />

      {/* Category Breakdown Progress */}
      <div className="panel-widget">
        <div className="widget-header">
          <PieChart size={16} color="var(--accent-primary)" />
          <h3>Category Breakdown</h3>
        </div>
        <div className="widget-body">
          {stats.categories && stats.categories.length > 0 ? (
            stats.categories.map(cat => {
              const catTodos = todos.filter(t => t.category === cat);
              const total = catTodos.length;
              const completed = catTodos.filter(t => t.status === 'completed').length;
              const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

              return (
                <div key={cat} style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <Tag size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} /> {cat}
                    </span>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 700, flexShrink: 0, marginLeft: '0.5rem' }}>{completed}/{total} ({pct}%)</span>
                  </div>
                  <div className="progress-bar-container" style={{ height: '6px' }}>
                    <div className="progress-bar-fill" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No category data available.</p>
          )}
        </div>
      </div>

      {/* Upcoming Deadlines Widget */}
      <div className="panel-widget">
        <div className="widget-header">
          <Calendar size={16} color="var(--accent-primary)" />
          <h3>Upcoming Deadlines</h3>
        </div>
        <div className="widget-body">
          {upcomingTasks.length > 0 ? (
            upcomingTasks.map(t => (
              <a href={`todo.html?id=${t.id}`} key={t.id} className="upcoming-item">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="upcoming-title">{t.title}</div>
                  <div className="upcoming-date">
                    <Clock size={12} style={{ flexShrink: 0 }} /> {t.effectiveDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <ArrowUpRight size={14} color="var(--text-muted)" style={{ flexShrink: 0, marginLeft: '0.4rem' }} />
              </a>
            ))
          ) : (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No active upcoming deadlines.</p>
          )}
        </div>
      </div>

      {/* Live System Activity Feed */}
      <div className="panel-widget">
        <div className="widget-header">
          <History size={16} color="var(--accent-primary)" />
          <h3>Recent Activity</h3>
        </div>
        <div className="widget-body">
          {recentLogs.length > 0 ? (
            recentLogs.map((log, idx) => (
              <div key={log.id || idx} className="activity-feed-item">
                <div className="activity-dot"></div>
                <div className="activity-text">
                  <strong>{log.action}</strong>
                  <div className="activity-time">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No recent activity logged.</p>
          )}
        </div>
      </div>
    </aside>
  );
}
