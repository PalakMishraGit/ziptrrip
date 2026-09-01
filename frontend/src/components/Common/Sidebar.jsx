import React from 'react';
import { 
  CheckSquare, LayoutDashboard, Clock, AlertTriangle, CheckCircle2, 
  User, Zap, Flame, Award
} from 'lucide-react';

export function Sidebar({ 
  currentFilter, 
  onSelectFilter, 
  stats = { total: 0, completed: 0, pending: 0, completionRate: 0, overdue: 0 }
}) {
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
          className={`sidebar-nav-item ${currentFilter === 'all' ? 'active' : ''}`}
          onClick={() => onSelectFilter('all')}
        >
          <LayoutDashboard size={18} />
          <span>All Tasks</span>
          <span className="nav-count-badge">{stats.total}</span>
        </div>

        <div 
          className={`sidebar-nav-item ${currentFilter === 'pending' ? 'active' : ''}`}
          onClick={() => onSelectFilter('pending')}
        >
          <Clock size={18} />
          <span>In Progress / Active</span>
          <span className="nav-count-badge">{stats.pending || 0}</span>
        </div>

        <div 
          className={`sidebar-nav-item ${currentFilter === 'completed' ? 'active' : ''}`}
          onClick={() => onSelectFilter('completed')}
        >
          <CheckCircle2 size={18} />
          <span>Completed</span>
          <span className="nav-count-badge">{stats.completed}</span>
        </div>

        <div 
          className={`sidebar-nav-item ${currentFilter === 'overdue' ? 'active' : ''}`}
          onClick={() => onSelectFilter('overdue')}
        >
          <AlertTriangle size={18} color="#DC2626" />
          <span style={{ color: stats.overdue > 0 ? '#DC2626' : 'inherit' }}>Overdue Tasks</span>
          {stats.overdue > 0 && <span className="nav-count-badge urgent">{stats.overdue}</span>}
        </div>
      </div>

      {/* Clean & Compact Sprint Performance Card */}
      <div className="sidebar-widget" style={{ marginTop: 'auto', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Zap size={15} color="var(--accent-primary)" /> Sprint Performance
          </span>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '12px', background: 'var(--bg-input)', color: 'var(--accent-primary)' }}>
            Q3 Sprint
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div style={{ background: 'var(--bg-input)', padding: '0.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.completionRate || 0}%</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Velocity</div>
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '0.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{stats.pending || 0}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Active</div>
          </div>
        </div>

        <div className="progress-bar-container" style={{ height: '6px' }}>
          <div className="progress-bar-fill" style={{ width: `${stats.completionRate || 0}%` }}></div>
        </div>
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
