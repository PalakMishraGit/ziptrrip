import React, { useState, useEffect } from 'react';
import { Search, Plus, ArrowLeft, Bell, Sun, Moon, Layers } from 'lucide-react';

export function Header({ currentPage = 'list', onOpenCreateModal, title = 'Task Workspace' }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

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

        {/* Sun / Moon Theme Toggle Icon Button */}
        <button 
          className="navbar-icon-btn" 
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? (
            <Moon size={18} color="var(--text-secondary)" />
          ) : (
            <Sun size={18} color="#FBBF24" />
          )}
        </button>

        <div className="navbar-icon-btn" title="Notifications">
          <Bell size={18} color="var(--text-secondary)" />
          <span className="notification-dot"></span>
        </div>
      </div>
    </header>
  );
}
