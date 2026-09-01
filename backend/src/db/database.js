import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'todos.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    category TEXT DEFAULT 'General',
    priority TEXT CHECK(priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    status TEXT CHECK(status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
    dueDate TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS subtasks (
    id TEXT PRIMARY KEY,
    todoId TEXT NOT NULL,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    createdAt TEXT NOT NULL,
    FOREIGN KEY(todoId) REFERENCES todos(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS activity_logs (
    id TEXT PRIMARY KEY,
    todoId TEXT NOT NULL,
    action TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY(todoId) REFERENCES todos(id) ON DELETE CASCADE
  );
`);

// Seed initial sample data if table is empty
const countStmt = db.prepare('SELECT COUNT(*) as count FROM todos');
const { count } = countStmt.get();

if (count === 0) {
  console.log('🌱 Seeding database with initial sample todos...');
  
  const insertTodo = db.prepare(`
    INSERT INTO todos (id, title, description, category, priority, status, dueDate, createdAt, updatedAt)
    VALUES (@id, @title, @description, @category, @priority, @status, @dueDate, @createdAt, @updatedAt)
  `);

  const insertSubtask = db.prepare(`
    INSERT INTO subtasks (id, todoId, title, completed, createdAt)
    VALUES (@id, @todoId, @title, @completed, @createdAt)
  `);

  const insertLog = db.prepare(`
    INSERT INTO activity_logs (id, todoId, action, createdAt)
    VALUES (@id, @todoId, @action, @createdAt)
  `);

  const now = new Date().toISOString();
  const tomorrow = new Date(Date.now() + 86400000).toISOString();
  const nextWeek = new Date(Date.now() + 86400000 * 7).toISOString();

  const seedTodos = [
    {
      id: 'todo-1',
      title: 'Architect Enterprise Multi-Page React Router & State',
      description: 'Design robust modular architecture separating List page and Detail page view contexts with search query parameter handling.',
      category: 'Architecture',
      priority: 'high',
      status: 'completed',
      dueDate: tomorrow,
      createdAt: now,
      updatedAt: now,
      subtasks: [
        { id: 'sub-101', title: 'Define Vite MPA entrypoints', completed: 1 },
        { id: 'sub-102', title: 'Setup query parameter URL state engine', completed: 1 },
        { id: 'sub-103', title: 'Configure global dark/light styling tokens', completed: 1 }
      ]
    },
    {
      id: 'todo-2',
      title: 'Implement Express.js REST API with SQLite backend',
      description: 'Build CRUD endpoints with structured controllers, services, database constraints, input validation, and activity logging.',
      category: 'Backend',
      priority: 'urgent',
      status: 'in_progress',
      dueDate: tomorrow,
      createdAt: now,
      updatedAt: now,
      subtasks: [
        { id: 'sub-201', title: 'Configure SQLite database connection with Foreign Keys', completed: 1 },
        { id: 'sub-202', title: 'Implement GET /api/todos with filtering & pagination', completed: 1 },
        { id: 'sub-203', title: 'Add subtask sub-resource routes', completed: 0 }
      ]
    },
    {
      id: 'todo-3',
      title: 'Design Premium Glassmorphism UI & Micro-animations',
      description: 'Craft responsive CSS custom properties, vibrant badges, interactive task cards, and detail view layout.',
      category: 'Design',
      priority: 'medium',
      status: 'pending',
      dueDate: nextWeek,
      createdAt: now,
      updatedAt: now,
      subtasks: [
        { id: 'sub-301', title: 'Add hover scale and priority glow effects', completed: 0 },
        { id: 'sub-302', title: 'Ensure mobile responsive breakpoints', completed: 0 }
      ]
    },
    {
      id: 'todo-4',
      title: 'Write Technical Documentation & OpenAPI Specifications',
      description: 'Document architectural patterns, API documentation, and feature list in markdown files per qualification guidelines.',
      category: 'Documentation',
      priority: 'high',
      status: 'pending',
      dueDate: nextWeek,
      createdAt: now,
      updatedAt: now,
      subtasks: [
        { id: 'sub-401', title: 'Write README.md quickstart guide', completed: 0 },
        { id: 'sub-402', title: 'Detail API parameters in DOCS/API.md', completed: 0 },
        { id: 'sub-403', title: 'Draft Senior Software Engineer Architecture rationale', completed: 0 }
      ]
    }
  ];

  const seedTransaction = db.transaction((todos) => {
    for (const t of todos) {
      const { subtasks, ...todoData } = t;
      insertTodo.run(todoData);
      insertLog.run({
        id: 'log-' + Math.random().toString(36).substr(2, 9),
        todoId: t.id,
        action: 'Todo created in initial database seed',
        createdAt: now
      });
      for (const st of subtasks) {
        insertSubtask.run({
          ...st,
          todoId: t.id,
          createdAt: now
        });
      }
    }
  });

  seedTransaction(seedTodos);
  console.log('✅ Seeded 4 sample todos with subtasks!');
}

export default db;
