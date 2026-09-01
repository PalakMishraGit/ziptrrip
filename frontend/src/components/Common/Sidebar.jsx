import React from 'react';
import { 
  CheckSquare, LayoutDashboard, Clock, AlertTriangle, CheckCircle2, 
  TrendingUp, User, Flame, Zap, ShieldAlert, Layers, ShieldCheck, Activity
} from 'lucide-react';

export function Sidebar({ 
  currentFilter, 
  onSelectFilter, 
  priorityFilter = 'all', 
  onSelectPriority,
  stats = { total: 0, completed: 0, pending: 0, completionRate: 0, overdue: 0 },
  todos = []
}) {
  // Compute priority counts dynamically
  const urgentCount = todos.filter(t => t.priority === 'urgent' && t.status !== 'completed').length;
  const highCount = todos.filter(t => t.priority === 'high' && t.status !== 'completed').length;
  const mediumCount = todos.filter(t => t.priority === 'medium' && t.status !== 'completed').length;
  const lowCount = todos.filter(t => t.priority === 'low' && t.status !== 'completed').length;

  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-logo">
          <CheckSquare size={22} color="#FFFFFF" />
        </div>
        <div className="brand-title">
          <h2>TaskSphere</h2>
          <span>Enterprise Hub</span>
        </div>
      </div>

      {/* Main Navigation Views */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Navigation</div>
        
        <div 
          className={`sidebar-nav-item ${currentFilter === 'all' && priorityFilter === 'all' ? 'active' : ''}`}
          onClick={() => { onSelectFilter('all'); onSelectPriority('all'); }}
        >
          <LayoutDashboard size={18} />
          <span>All Tasks</span>
          <span className="nav-count-badge">{stats.total}</span>
        </div>

        <div 
          className={`sidebar-nav-item ${currentFilter === 'pending' ? 'active' : ''}`}
          onClick={() => { onSelectFilter('pending'); onSelectPriority('all'); }}
        >
          <Clock size={18} />
          <span>In Progress / Active</span>
          <span className="nav-count-badge">{stats.pending || 0}</span>
        </div>

        <div 
          className={`sidebar-nav-item ${currentFilter === 'completed' ? 'active' : ''}`}
          onClick={() => { onSelectFilter('completed'); onSelectPriority('all'); }}
        >
          <CheckCircle2 size={18} />
          <span>Completed</span>
          <span className="nav-count-badge">{stats.completed}</span>
        </div>

        <div 
          className={`sidebar-nav-item ${currentFilter === 'overdue' ? 'active' : ''}`}
          onClick={() => { onSelectFilter('overdue'); onSelectPriority('all'); }}
        >
          <AlertTriangle size={18} color="#DC2626" />
          <span style={{ color: stats.overdue > 0 ? '#DC2626' : 'inherit' }}>Overdue Tasks</span>
          {stats.overdue > 0 && <span className="nav-count-badge urgent">{stats.overdue}</span>}
        </div>
      </div>

      {/* Priority Matrix Section (Replaces Categories) */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Priority Matrix</div>
        
        <div 
          className={`sidebar-nav-item ${priorityFilter === 'all' && currentFilter === 'all' ? 'active' : ''}`}
          onClick={() => { onSelectPriority('all'); onSelectFilter('all'); }}
        >
          <Layers size={16} />
          <span>All Priorities</span>
        </div>

        <div 
          className={`sidebar-nav-item ${priorityFilter === 'urgent' ? 'active' : ''}`}
          onClick={() => { onSelectPriority('urgent'); onSelectFilter('all'); }}
        >
          <Flame size={16} color="#EF4444" />
          <span style={{ color: urgentCount > 0 ? '#EF4444' : 'inherit' }}>Urgent Priority</span>
          {urgentCount > 0 && <span className="nav-count-badge urgent">{urgentCount}</span>}
        </div>

        <div 
          className={`sidebar-nav-item ${priorityFilter === 'high' ? 'active' : ''}`}
          onClick={() => { onSelectPriority('high'); onSelectFilter('all'); }}
        >
          <Zap size={16} color="#F59E0B" />
          <span>High Priority</span>
          {highCount > 0 && <span className="nav-count-badge">{highCount}</span>}
        </div>

        <div 
          className={`sidebar-nav-item ${priorityFilter === 'medium' ? 'active' : ''}`}
          onClick={() => { onSelectPriority('medium'); onSelectFilter('all'); }}
        >
          <ShieldAlert size={16} color="#3B82F6" />
          <span>Medium Priority</span>
          {mediumCount > 0 && <span className="nav-count-badge">{mediumCount}</span>}
        </div>

        <div 
          className={`sidebar-nav-item ${priorityFilter === 'low' ? 'active' : ''}`}
          onClick={() => { onSelectPriority('low'); onSelectFilter('all'); }}
        >
          <ShieldCheck size={16} color="#10B981" />
          <span>Low Priority</span>
          {lowCount > 0 && <span className="nav-count-badge">{lowCount}</span>}
        </div>
      </div>

      {/* Productivity Progress Widget */}
      <div className="sidebar-widget">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={14} color="var(--accent-primary)" /> Productivity
          </span>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
            {stats.completionRate || 0}%
          </span>
        </div>
        <div className="progress-bar-container" style={{ height: '7px' }}>
          <div className="progress-bar-fill" style={{ width: `${stats.completionRate || 0}%` }}></div>
        </div>
        <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          {stats.completed} of {stats.total} tasks completed
        </p>
      </div>

      {/* User Profile Footer */}
      <div className="sidebar-user-footer">
        <div className="user-avatar">
          <User size={18} color="var(--accent-primary)" />
        </div>
        <div className="user-info">
          <div className="user-name">Workspace Member</div>
          <div className="user-role" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span> Lead Developer
          </div>
        </div>
      </div>
    </aside>
  );
}
