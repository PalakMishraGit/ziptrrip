import React from 'react';
import { CheckSquare, ListTodo, Plus, ArrowLeft } from 'lucide-react';

export function Header({ currentPage = 'list', onOpenCreateModal }) {
  return (
    <header className="app-header">
      <div className="logo-group">
        <a href="index.html" className="logo-group">
          <div className="logo-icon">
            <CheckSquare size={24} />
          </div>
          <div className="logo-text">
            <h1>TaskSphere Enterprise</h1>
            <p>Multi-Page Reactive Task Engine</p>
          </div>
        </a>
      </div>

      <div className="nav-actions">
        {currentPage === 'detail' ? (
          <a href="index.html" className="btn btn-secondary">
            <ArrowLeft size={16} /> Back to Todos List
          </a>
        ) : (
          <>
            <button className="btn btn-primary" onClick={onOpenCreateModal}>
              <Plus size={18} /> Create New Task
            </button>
          </>
        )}
      </div>
    </header>
  );
}
