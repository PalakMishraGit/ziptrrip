import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, ArrowLeft, Bell, Sun, Moon, Layers, AlertTriangle, AlertCircle, Clock, Check, X, Palette, Code, Sparkles, Snowflake, Monitor } from 'lucide-react';

export function Header({ currentPage = 'list', onOpenCreateModal, title = 'Task Workspace', todos = [] }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('read_notification_ids') || '[]');
    } catch {
      return [];
    }
  });

  const [isAllRead, setIsAllRead] = useState(() => {
    return localStorage.getItem('notifications_marked_read') === 'true';
  });

  const dropdownRef = useRef(null);
  const themeRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Available Theme Presets
  const themes = [
    { id: 'light', label: 'Enterprise Light', icon: Sun, color: '#4F46E5', bgPreview: '#F8FAFC' },
    { id: 'dark', label: 'True OLED Black', icon: Moon, color: '#6366F1', bgPreview: '#000000' },
    { id: 'vscode', label: 'VS Code Dark+', icon: Code, color: '#007ACC', bgPreview: '#1E1E1E' },
    { id: 'dracula', label: 'Dracula Neon', icon: Sparkles, color: '#FF79C6', bgPreview: '#282A36' },
    { id: 'nord', label: 'Nord Ice Slate', icon: Snowflake, color: '#88C0D0', bgPreview: '#2E3440' }
  ];

  const currentThemeObj = themes.find(t => t.id === theme) || themes[0];
  const CurrentIcon = currentThemeObj.icon;

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target)) {
        setIsThemeOpen(false);
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

  const unreadNotifications = isAllRead
    ? []
    : notifications.filter(n => !readIds.includes(n.id));

  const unreadCount = unreadNotifications.length;

  const handleMarkAllRead = () => {
    const allIds = notifications.map(n => n.id);
    const updated = Array.from(new Set([...readIds, ...allIds]));
    setReadIds(updated);
    setIsAllRead(true);
    localStorage.setItem('read_notification_ids', JSON.stringify(updated));
    localStorage.setItem('notifications_marked_read', 'true');
  };

  const handleItemClick = (id) => {
    if (!readIds.includes(id)) {
      const updated = [...readIds, id];
      setReadIds(updated);
      localStorage.setItem('read_notification_ids', JSON.stringify(updated));
    }
    setIsNotificationsOpen(false);
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

      <div className="navbar-right" style={{ position: 'relative' }}>
        {currentPage === 'list' && (
          <button className="btn btn-primary" onClick={onOpenCreateModal}>
            <Plus size={18} /> Add Task
          </button>
        )}

        {/* Theme Palette Icon Button & Popover */}
        <div style={{ position: 'relative' }} ref={themeRef}>
          <button 
            className="navbar-icon-btn" 
            onClick={() => setIsThemeOpen(prev => !prev)}
            title={`Current Theme: ${currentThemeObj.label}`}
          >
            <Palette size={18} color={currentThemeObj.color} />
          </button>

          {isThemeOpen && (
            <div className="theme-popover">
              <div className="picker-header">
                <span>Select Theme</span>
              </div>
              <div className="theme-list">
                {themes.map(t => {
                  const ItemIcon = t.icon;
                  const isActive = theme === t.id;
                  return (
                    <div 
                      key={t.id}
                      className={`theme-option ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        setTheme(t.id);
                        setIsThemeOpen(false);
                      }}
                    >
                      <div className="theme-swatch" style={{ background: t.bgPreview, border: `1px solid ${t.color}` }}>
                        <ItemIcon size={12} color={t.color} />
                      </div>
                      <span className="theme-label">{t.label}</span>
                      {isActive && <Check size={14} color="var(--accent-primary)" style={{ marginLeft: 'auto' }} />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell Icon & Popover */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button 
            className="navbar-icon-btn" 
            onClick={() => setIsNotificationsOpen(prev => !prev)}
            title="Notifications & Alerts"
          >
            <Bell size={18} color="var(--text-secondary)" />
            {unreadCount > 0 && <span className="notification-dot"></span>}
          </button>

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
                    onClick={handleMarkAllRead}
                    style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="dropdown-body">
                {notifications.length === 0 ? (
                  <div style={{ padding: '1.25rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                    🎉 No overdue or urgent alerts!
                  </div>
                ) : (
                  notifications.map(item => {
                    const isRead = isAllRead || readIds.includes(item.id);
                    return (
                      <a 
                        key={item.id} 
                        href={`todo.html?id=${item.taskId}`} 
                        className={`notification-item ${isRead ? 'read' : 'unread'}`}
                        onClick={() => handleItemClick(item.id)}
                        style={{ opacity: isRead ? 0.6 : 1 }}
                      >
                        <div className="item-icon">
                          {item.type === 'overdue' ? (
                            <AlertTriangle size={15} color="#EF4444" />
                          ) : (
                            <AlertCircle size={15} color="#F59E0B" />
                          )}
                        </div>
                        <div className="item-content" style={{ flex: 1 }}>
                          <div className="item-title" style={{ fontWeight: isRead ? 500 : 800 }}>
                            {item.title}
                          </div>
                          <div className="item-time">{item.time}</div>
                        </div>
                        {isRead && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <Check size={12} color="#10B981" /> Read
                          </span>
                        )}
                      </a>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
