import React from 'react';
import { Search, Plus, ArrowLeft, Bell, Sparkles, Layers } from 'lucide-react';

export function Header({ currentPage = 'list', onOpenCreateModal, title = 'Task Workspace' }) {
  return (
    <header className="top-navbar">
      <div className="navbar-left">
        {currentPage === 'detail' ? (
          <a href="index.html" className="btn btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </a>
        ) : (
          <div className="navbar-breadcrumb">
            <span className="breadcrumb-path"><Layers size={15} /> Workspace</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{title}</span>
          </div>
        )}
      </div>

      <div className="navbar-right">
        {currentPage === 'list' && (
          <button className="btn btn-primary" onClick={onOpenCreateModal}>
            <Plus size={18} /> Add Task
          </button>
        )}

        <div className="navbar-icon-btn" title="Notifications">
          <Bell size={18} color="var(--text-secondary)" />
          <span className="notification-dot"></span>
        </div>
      </div>
    </header>
  );
}
