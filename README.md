# TaskSphere Enterprise - Multi-Page React & Express Todo Application

> **Architected with Senior Engineering Best Practices.**  
> A high-performance, visually immersive Task Management System featuring a **Vite React Multi-Page Application (MPA)** frontend, an **Express RESTful API** backend with **SQLite persistence**, and a motion design system with 3D card celebrations, priority-matched revolving laser progress sweeps, and animated strikethroughs.

---

## 🌟 Key Features & Architectural Highlights

### 🎨 Advanced Motion Design & Celebration Suite
- **3D Card Flip Celebration**: Marking a task complete triggers a 3D perspective flip (`rotateY(180deg)`), revealing a vibrant emerald green card back cover with a 12-particle radial confetti burst.
- **Bottom-to-Top Animated Checkmark**: Features an SVG checkmark circle that traces open and a checkmark path (`stroke-dasharray` / `stroke-dashoffset`) that draws smoothly from bottom to top.
- **5-Second Celebration Hold**: Celebration stays active for a full 5 seconds before flipping back to the updated front card face.
- **Animated Strikethrough Line**: Task titles feature a smooth left-to-right animated strikethrough line on completion, and right-to-left retraction when unchecked.
- **Revolving Laser Border Progress Sweep**: Task cards feature a priority-matched (Red/Amber/Blue/Green) glowing laser border line that completes a 0–100% circuit around the outer card perimeter on hover or pin.
- **Periodic Card Shake**: Hovered or pinned task cards feature a rhythmic elastic shake (`cardShakeOnHover`) for visual emphasis.

### 💻 Multi-Page Frontend Architecture (React + Vite MPA)
- **Distinct HTML Pages**: `/index.html` (Workspace Dashboard) and `/todo.html?id=<ID>` (Single Task Detail View).
- **Single Consolidated "Add Task" Button**: Prominently located in the Welcome Banner to trigger the QuickAddModal.
- **Focus Session Pomodoro Widget**: Integrated timer with 25m Focus, 5m Short Break, and 15m Long Break modes.
- **Sprint Performance Widget**: High-impact sidebar component tracking Q3 Sprint Velocity % and active tasks.
- **Theme Selector**: Dynamic switching between Light, Dark, Glassmorphic, and Cyberpunk Neon visual themes.

### ⚙️ Production RESTful API (Express + SQLite)
- **Zero-Config Persistence**: Embedded SQLite database (`data/todos.db`) via `better-sqlite3`.
- **Relational Data Integrity**: Foreign keys with `ON DELETE CASCADE` for subtasks and activity audit logs.
- **Full CRUD Capabilities**: Search, filter by status/priority/category, multi-field sorting, subtask management, and audit log generation.

---

## 🏗️ Project Directory Structure

```
Ziptrrip/
├── backend/                  # Node.js + Express REST API Server
│   ├── src/
│   │   ├── config/           # App configuration
│   │   ├── controllers/      # Route controllers & HTTP response logic
│   │   ├── db/               # SQLite database initialization & schemas
│   │   ├── middleware/       # Global error & morgan request logging
│   │   ├── routes/           # Express router endpoints
│   │   ├── services/         # SQLite queries & business logic
│   │   └── server.js         # Express server entry point (Port 5000)
│   ├── data/                 # SQLite database storage (todos.db)
│   └── package.json
├── frontend/                 # React Vite Multi-Page Application (MPA)
│   ├── index.html            # Dashboard Page Entry Point
│   ├── todo.html             # Item Detail Page Entry Point
│   ├── vite.config.js        # Vite MPA Rollup bundle configuration
│   ├── src/
│   │   ├── api/              # Todo API client service (fetch wrapper)
│   │   ├── components/       # UI Components (TaskCard, Header, Widgets, Modals)
│   │   ├── pages/            # Page View Controllers (list.jsx, detail.jsx)
│   │   ├── styles/           # Design System & Motion CSS (index.css)
│   │   ├── main.jsx          # Entry script for index.html
│   │   └── todo.jsx          # Entry script for todo.html
│   └── package.json
├── DOCS/                     # Comprehensive Technical Documentation
│   ├── FEATURES.md           # Full breakdown of UI/UX & backend features
│   ├── API.md                # OpenAPI REST API Reference & payloads
│   └── ARCHITECTURE.md       # Senior Architectural Design & Tradeoffs
├── README.md                 # Project Overview & Quick Start Guide
└── .gitignore
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: `v18.0.0+` or `v20.0.0+`
- **npm**: `v9.0.0+`

### 1. Launch Backend REST API Server

```bash
cd backend
npm install
npm run dev
```
> The API server will start at `http://localhost:5000`. On initial run, SQLite automatically seeds 4 demonstration todo items with subtasks and activity history.

### 2. Launch Frontend React Application

In a new terminal window:

```bash
cd frontend
npm install
npm run dev
```
> The Vite dev server will start at `http://localhost:5173`.

---

## 💻 Navigation & Multi-Page Workflow

1. **Workspace Dashboard (`http://localhost:5173/index.html`)**:
   - View top metrics overview (Total Tasks, Active, Completed %, Overdue).
   - Search by keyword, filter by status/priority/category, or sort.
   - Click **"Add Task"** in the Welcome Banner to create new tasks with subtasks.
   - Hover or pin task cards to activate revolving laser border progress sweeps and shake feedback.
   - Click completion checkboxes to trigger the 3D card flip celebration and radial confetti burst.
   - Click **"View Details"** or task title to navigate to Page 2 (`/todo.html?id=<ID>`).

2. **Single Task View (`http://localhost:5173/todo.html?id=<ID>`)**:
   - Parses task `id` from query parameter string.
   - Displays task metadata, editable fields, interactive subtask checklist, and audit trail timeline.
   - Click **"Back to Todos List"** to navigate back to `index.html`.

---

## 📚 Detailed Documentation Suite

For complete in-depth documentation, explore the `DOCS/` directory:

- 📖 [**DOCS/FEATURES.md**](DOCS/FEATURES.md): Deep-dive into motion design, 3D card flip, strikethroughs, laser sweeps, and UI widgets.
- 📡 [**DOCS/API.md**](DOCS/API.md): Complete REST API reference, request headers, query parameters, and JSON payloads.
- 🏛️ [**DOCS/ARCHITECTURE.md**](DOCS/ARCHITECTURE.md): Architectural rationale, MPA vs SPA tradeoffs, SQLite schema, and state management strategy.

---

## 📜 License
MIT License — Enterprise Multi-Page Todo Application.
