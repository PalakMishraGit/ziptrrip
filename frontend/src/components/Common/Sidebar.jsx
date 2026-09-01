import React from 'react';
import { 
  CheckSquare, LayoutDashboard, Clock, AlertTriangle, CheckCircle2, 
  Tag, Folder, TrendingUp, Plus, Sparkles, User
} from 'lucide-react';

export function Sidebar({ 
  currentFilter, 
  onSelectFilter, 
  categories = [], 
  selectedCategory, 
  onSelectCategory,
  stats = { total: 0, completed: 0, pending: 0, completionRate: 0 },
  onOpenCreateModal 
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

      {/* Quick Action Button */}
      <div style={{ padding: '0 1rem', marginBottom: '1.5rem' }}>
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={onOpenCreateModal}>
          <Plus size={18} /> New Task
        </button>
      </div>

      {/* Main Navigation Views */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Navigation</div>
        
        <div 
          className={`sidebar-nav-item ${currentFilter === 'all' && selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => { onSelectFilter('all'); onSelectCategory('all'); }}
        >
          <LayoutDashboard size={18} />
          <span>All Tasks</span>
          <span className="nav-count-badge">{stats.total}</span>
        </div>

        <div 
          className={`sidebar-nav-item ${currentFilter === 'pending' ? 'active' : ''}`}
          onClick={() => { onSelectFilter('pending'); onSelectCategory('all'); }}
        >
          <Clock size={18} />
          <span>In Progress / Active</span>
          <span className="nav-count-badge">{stats.pending || 0}</span>
        </div>

        <div 
          className={`sidebar-nav-item ${currentFilter === 'completed' ? 'active' : ''}`}
          onClick={() => { onSelectFilter('completed'); onSelectCategory('all'); }}
        >
          <CheckCircle2 size={18} />
          <span>Completed</span>
          <span className="nav-count-badge">{stats.completed}</span>
        </div>

        <div 
          className={`sidebar-nav-item ${currentFilter === 'overdue' ? 'active' : ''}`}
          onClick={() => { onSelectFilter('overdue'); onSelectCategory('all'); }}
        >
          <AlertTriangle size={18} color="#DC2626" />
          <span style={{ color: stats.overdue > 0 ? '#DC2626' : 'inherit' }}>Overdue Tasks</span>
          {stats.overdue > 0 && <span className="nav-count-badge urgent">{stats.overdue}</span>}
        </div>
      </div>

      {/* Categories Section */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Categories</div>
        <div 
          className={`sidebar-nav-item ${selectedCategory === 'all' && currentFilter !== 'overdue' ? 'active' : ''}`}
          onClick={() => onSelectCategory('all')}
        >
          <Folder size={16} />
          <span>All Categories</span>
        </div>
        {categories.map(cat => (
          <div 
            key={cat}
            className={`sidebar-nav-item ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat)}
          >
            <Tag size={15} />
            <span>{cat}</span>
          </div>
        ))}
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
          <User size={18} color="#4F46E5" />
        </div>
        <div className="user-info">
          <div className="user-name">Workspace Member</div>
          <div className="user-role">Lead Developer</div>
        </div>
      </div>
    </aside>
  );
}
