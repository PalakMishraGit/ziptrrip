# TaskSphere Enterprise - Multi-Page React & Express Todo Application

> **Architected with 20 Years of Software Engineering Best Practices.**  
> A high-performance, enterprise-grade Task Management System featuring a **Vite React Multi-Page Application (MPA)** frontend, a **Node.js + Express RESTful API** backend with **SQLite persistence**, and a glassmorphism design system.

---

## 🌟 Qualification & Features Checklist

- [x] **Multi-Page Architecture (MPA)**: Distinct, non-SPA HTML pages (`/index.html` for List view, `/todo.html?id=<ID>` for Single Item Detail view).
- [x] **Single Todo Item Page with Query Parameter**: Receives `id` via URL query parameter (`todo.html?id=todo-1`), parses parameter dynamically, and renders complete task details, editable fields, subtasks checklist, and activity log.
- [x] **Express.js RESTful API**: Full CRUD capabilities (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) with modular routes, controllers, services, database constraints, input validation, and global error handling.
- [x] **SQLite Relational Persistence**: Zero-config file-backed database (`better-sqlite3`) with foreign key constraints, subtask relational tables, audit trail logs, and automated initial data seeder.
- [x] **In-Repository Markdown Documentation**: Complete technical documentation suite in repository root (`README.md`) and `DOCS/` folder (`FEATURES.md`, `API.md`, `ARCHITECTURE.md`).

---

## 🏗️ Project Architecture Overview

```
Ziptrrip/
├── backend/                  # Node.js + Express REST API Server
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   ├── controllers/      # Request handlers & HTTP responses
│   │   ├── db/               # SQLite connection & table schemas
│   │   ├── middleware/       # Global error & logging middleware
│   │   ├── routes/           # Express endpoint router definitions
│   │   ├── services/         # Database queries & business logic
│   │   ├── utils/            # Helper utilities
│   │   └── server.js         # Express server entry point
│   ├── data/                 # SQLite database storage (todos.db)
│   └── package.json
├── frontend/                 # React Vite Multi-Page Application (MPA)
│   ├── index.html            # Page 1 Entry Point (Todos List Dashboard)
│   ├── todo.html             # Page 2 Entry Point (Single Todo Item View)
│   ├── vite.config.js        # Vite MPA Rollup configuration & proxy
│   ├── src/
│   │   ├── api/              # API Client fetch service
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page view controllers (list.jsx, detail.jsx)
│   │   ├── styles/           # Glassmorphism CSS design system
│   │   ├── main.jsx          # Entry point for index.html
│   │   └── todo.jsx          # Entry point for todo.html
│   └── package.json
├── DOCS/                     # Deep-dive Markdown Documentation
│   ├── FEATURES.md           # Full breakdown of application capabilities
│   ├── API.md                # OpenAPI REST API Reference & examples
│   └── ARCHITECTURE.md       # Senior Engineer Architectural Rationale
├── README.md                 # Main Documentation & Quickstart Guide
└── .gitignore
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js `v18.0.0+` or `v20.0.0+`
- npm `v9.0.0+`

### 1. Launch Backend API Server

```bash
cd backend
npm install
npm start
```
> The API server will start at `http://localhost:5000`. On first run, it automatically seeds 4 demonstration todo items with subtasks and audit logs.

### 2. Launch Frontend React MPA

In a separate terminal window:

```bash
cd frontend
npm install
npm run dev
```
> The Vite dev server will start at `http://localhost:5173`.

---

## 💻 Multi-Page Workflow & Navigation

1. **Page 1: Workspace Dashboard (`http://localhost:5173/index.html`)**
   - View high-level metrics cards (Total Tasks, Pending, Completed, Overdue).
   - Search tasks, filter by status, priority, and category chips, or sort.
   - Click **"View Details"** or task title on any card to navigate via browser location to Page 2 (`/todo.html?id=<ID>`).

2. **Page 2: Single Task View (`http://localhost:5173/todo.html?id=<ID>`)**
   - Parses `id` from query parameter string `window.location.search`.
   - Displays task title, detailed description, priority, category, status dropdown, due date picker, interactive subtask checklist, and activity audit timeline.
   - Click **"Back to Todos List"** to navigate back to `index.html`.

---

## 📚 Technical Documentation Directory

For complete architectural and API specifications, refer to the `DOCS/` folder:

- 📖 [**DOCS/FEATURES.md**](DOCS/FEATURES.md): Comprehensive feature specification for UI/UX and backend capabilities.
- 📡 [**DOCS/API.md**](DOCS/API.md): Detailed REST API documentation with request/response payload schemas.
- 🏛️ [**DOCS/ARCHITECTURE.md**](DOCS/ARCHITECTURE.md): Architectural decisions, Vite MPA vs SPA design tradeoffs, database schema, and security considerations.

---

## 📜 License
MIT License - Developed as an enterprise multi-page todo demonstration.
