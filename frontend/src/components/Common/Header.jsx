import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, ArrowLeft, Bell, Sun, Moon, Layers, AlertTriangle, AlertCircle, Clock, Check, X } from 'lucide-react';

export function Header({ currentPage = 'list', onOpenCreateModal, title = 'Task Workspace', todos = [] }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute dynamic notification alerts from todos
  const now = new Date();
  const overdueAlerts = todos
    .filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'completed')
    .map(t => ({
      id: `overdue-${t.id}`,
      taskId: t.id,
      title: `Overdue Task: "${t.title}"`,
      time: 'Passed due date',
      type: 'overdue'
    }));

  const urgentAlerts = todos
    .filter(t => t.priority === 'urgent' && t.status !== 'completed')
    .map(t => ({
      id: `urgent-${t.id}`,
      taskId: t.id,
      title: `Urgent Priority: "${t.title}"`,
      time: 'Requires immediate action',
      type: 'urgent'
    }));

  const notifications = [...overdueAlerts, ...urgentAlerts].slice(0, 5);
  const unreadCount = hasUnread ? notifications.length : 0;

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

      <div className="navbar-right" style={{ position: 'relative' }} ref={dropdownRef}>
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

        {/* Notification Bell Icon */}
        <button 
          className="navbar-icon-btn" 
          onClick={() => setIsNotificationsOpen(prev => !prev)}
          title="Notifications & Alerts"
        >
          <Bell size={18} color="var(--text-secondary)" />
          {unreadCount > 0 && <span className="notification-dot"></span>}
        </button>

        {/* Interactive Notification Popover Dropdown */}
        {isNotificationsOpen && (
          <div className="notifications-dropdown">
            <div className="dropdown-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>Notifications</h4>
                {unreadCount > 0 && (
                  <span className="prio-badge prio-urgent" style={{ fontSize: '0.65rem' }}>
                    {unreadCount} New
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button 
                  className="btn-link" 
                  onClick={() => setHasUnread(false)}
                  style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                >
                  Mark read
                </button>
              )}
            </div>

            <div className="dropdown-body">
              {notifications.length === 0 ? (
                <div style={{ padding: '1.25rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                  🎉 No overdue or urgent alerts!
                </div>
              ) : (
                notifications.map(item => (
                  <a 
                    key={item.id} 
                    href={`todo.html?id=${item.taskId}`} 
                    className="notification-item"
                    onClick={() => setIsNotificationsOpen(false)}
                  >
                    <div className="item-icon">
                      {item.type === 'overdue' ? (
                        <AlertTriangle size={15} color="#EF4444" />
                      ) : (
                        <AlertCircle size={15} color="#F59E0B" />
                      )}
                    </div>
                    <div className="item-content">
                      <div className="item-title">{item.title}</div>
                      <div className="item-time">{item.time}</div>
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
