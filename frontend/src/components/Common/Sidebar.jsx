import React from 'react';
import { 
  CheckSquare, LayoutDashboard, Clock, AlertTriangle, CheckCircle2, 
  TrendingUp, User, Rocket, Cpu, Palette, Building2, Sparkles, Target, ChevronRight
} from 'lucide-react';

export function Sidebar({ 
  currentFilter, 
  onSelectFilter, 
  stats = { total: 0, completed: 0, pending: 0, completionRate: 0, overdue: 0 },
  todos = []
}) {
  // Calculate dynamic milestone stats based on task completion
  const completedCount = stats.completed || 0;
  const totalCount = stats.total || 1;
  const overallPct = Math.round((completedCount / totalCount) * 100);

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

      {/* Enterprise Sprint Milestones (Replaces Categories & Priority matrix) */}
      <div className="sidebar-section">
        <div className="sidebar-section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Sprint Milestones</span>
          <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '10px', background: 'var(--bg-input)', color: 'var(--accent-primary)', fontWeight: 800 }}>
            Q3 ACTIVE
          </span>
        </div>
        
        <div className="sidebar-milestone-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Rocket size={14} color="#8B5CF6" /> v1.0 Core Release
            </span>
            <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#8B5CF6' }}>{overallPct}%</span>
          </div>
          <div className="progress-bar-container" style={{ height: '5px' }}>
            <div className="progress-bar-fill" style={{ width: `${overallPct}%`, background: 'linear-gradient(90deg, #8B5CF6, #6366F1)' }}></div>
          </div>
        </div>

        <div className="sidebar-milestone-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Cpu size={14} color="#3B82F6" /> SQLite REST Engine
            </span>
            <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#3B82F6' }}>67%</span>
          </div>
          <div className="progress-bar-container" style={{ height: '5px' }}>
            <div className="progress-bar-fill" style={{ width: '67%', background: 'linear-gradient(90deg, #3B82F6, #60A5FA)' }}></div>
          </div>
        </div>

        <div className="sidebar-milestone-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Palette size={14} color="#10B981" /> Multi-Theme Engine
            </span>
            <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#10B981' }}>100%</span>
          </div>
          <div className="progress-bar-container" style={{ height: '5px' }}>
            <div className="progress-bar-fill" style={{ width: '100%', background: '#10B981' }}></div>
          </div>
        </div>
      </div>

      {/* Productivity Progress Widget */}
      <div className="sidebar-widget">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={14} color="var(--accent-primary)" /> Velocity Rate
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
