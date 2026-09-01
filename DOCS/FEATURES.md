# Features & Capabilities Documentation

This document provides a comprehensive specification of all features, motion design systems, interactive components, and backend capabilities implemented in the **TaskSphere Enterprise Multi-Page Todo Application**.

---

## 🎨 Motion Design & Visual Celebration Suite

### 1. 3D Card Flip Celebration & Confetti Engine
- **3D Perspective Flip**:
  - Clicking the completion checkbox triggers a 3D perspective rotation (`rotateY(180deg)`) on a perspective-enabled card wrapper (`perspective: 1200px`).
- **Vibrant Emerald Green Cover**:
  - The card back face features a rich emerald gradient (`linear-gradient(135deg, #10B981 0%, #059669 100%)`) with white high-contrast typography and subtle drop shadows.
- **Bottom-to-Top Animated SVG Checkmark**:
  - The checkmark circle traces itself open (`@keyframes strokeCircle`).
  - The white tick mark path (`M14 27 l7 7 l16 -16`) draws smoothly from the bottom hook up to the top right tip using CSS `stroke-dasharray` / `stroke-dashoffset` keyframes (`@keyframes strokeCheck`).
- **12-Particle Radial Confetti Explosion**:
  - 12 individual color-coded confetti particles (`.confetti-p`) burst outwards in a radial pattern with randomized rotational trajectories (`@keyframes burst1` through `burst12`).
- **Guaranteed 5-Second Celebration Hold**:
  - Optimistic local state immediately updates the checkbox while the 3D celebration holds on the back face for a full **5 seconds (5000ms)** before flipping back.
  - Deferred parent API sync guarantees that background network requests never interrupt or cancel the 5-second celebration animation.

### 2. Animated Left-to-Right Strikethrough Line
- **Left-to-Right Draw on Completion**:
  - When marked complete, a smooth 2.5px rounded strikethrough line (`.task-title::after`) draws from **0% to 100% width** left-to-right across the task title text in 0.45 seconds (`cubic-bezier(0.65, 0, 0.35, 1)`).
- **Right-to-Left Retraction on Uncheck**:
  - Unchecking a completed task smoothly retracts the line from **100% to 0% width** right-to-left, restoring standard text styling seamlessly.

### 3. Revolving Laser Border Progress Sweep
- **Priority-Matched Glowing Laser Color**:
  - **Urgent**: Glowing Red (`#EF4444`)
  - **High**: Glowing Amber (`#F59E0B`)
  - **Medium**: Glowing Blue (`#3B82F6`)
  - **Low**: Glowing Emerald (`#10B981`)
- **0–100% Perimeter Circuit**:
  - SVG `<rect>` path uses `stroke-dasharray: 28 72` and continuous linear interpolation (`@keyframes borderSweepProgress`) to complete a 0–100% circuit around the card.
- **Exact Outer Border & Corner Arc Alignment**:
  - Positioned at exact outer border boundaries (`x="0.75" y="0.75" width="calc(100% - 1.5px)" height="calc(100% - 1.5px)" rx="16"`) to replace the default border seamlessly.
- **Auto-Hiding Side Border Accent**:
  - On hover or highlight, the static side border accent stripe (`.task-card::after`) smoothly fades out (`opacity: 0`), leaving only the glowing laser line active.
- **Periodic Card Shake Attention State**:
  - Hovered or pinned task cards feature a rhythmic elastic shake (`cardShakeOnHover`) to draw immediate visual focus.

---

## 💻 Frontend Features (React Multi-Page Application)

### 1. Multi-Page Architecture (Non-SPA)
- **Vite Multi-Page Application (MPA)**:
  - Separate entry points: `index.html` (Dashboard Overview) and `todo.html` (Single Item Detail View).
  - True document location navigation (`window.location.href`) preserving deep linking and browser history.

### 2. Workspace Dashboard Overview (`index.html`)
- **Consolidated Single "Add Task" Control**:
  - Cleaned up redundant header/sidebar buttons. Single primary **"Add Task"** button prominently positioned in the Welcome Banner.
  - Opens the **QuickAddModal** with full form validation, priority selector, category selector, due date picker, and inline subtask builder.
- **Metrics Overview Banner**:
  - Real-time aggregate counters for Total Tasks, Pending/Active Tasks, Completed Tasks (with percentage), and Overdue Tasks.
- **Interactive Multi-Criteria Filter & Search Engine**:
  - Keyword search across task titles and descriptions.
  - Filter chips for status (`All`, `Pending`, `In Progress`, `Completed`), priority (`Urgent`, `High`, `Medium`, `Low`), and categories (`Architecture`, `Backend`, `Design`, `Documentation`).
  - Sort selector by Created Date, Due Date, Priority Weight, and Title (ASC/DESC).
- **Focus Session Pomodoro Widget**:
  - Selectable session timers (25m Focus, 5m Short Break, 15m Long Break).
  - Play/Pause/Reset controls with task pinning integration ("Pin a task to focus...").
- **Sprint Performance Widget**:
  - Replaced redundant sidebar category lists with a high-impact Sprint Performance widget tracking Q3 Sprint Velocity % and Active task counts.
- **Theme Customization System**:
  - Quick theme selector in Header supporting Light Mode, Dark Mode, Glassmorphism, and Cyberpunk Neon aesthetics.

### 3. Single Todo Detail View (`todo.html?id=<ID>`)
- **URL Query Parameter Routing**:
  - Dynamically parses `id` parameter from query string (`todo.html?id=todo-1`).
- **Full Editing Capabilities**:
  - Inline title editing, description textarea, status dropdown, priority picker, category tagging, and date picker.
- **Subtask Checklist System**:
  - Interactive checkboxes with real-time percentage progress bar updates.
  - Add subtask input and subtask deletion controls.
- **Activity & Audit Trail Timeline**:
  - Detailed log tracking task creation timestamps, status modifications, title edits, and subtask activity.
- **Fallback State**:
  - Clean error card handling missing query parameters or invalid task IDs.

---

## ⚙️ Backend REST API Specification

### 1. Architecture & Tech Stack
- **Node.js + Express.js**: REST API server running on port 5000.
- **SQLite Database (`data/todos.db`)**: Using high-performance `better-sqlite3` driver.
- **Relational Integrity**: `todos`, `subtasks`, and `activity_logs` tables configured with `FOREIGN KEY ... ON DELETE CASCADE`.
- **Automated Data Seeder**: Automatically initializes 4 structured demo tasks with subtasks and activity logs on first run.

### 2. API Endpoints Overview
- `GET /api/health` — API health check
- `GET /api/stats` — Dashboard aggregated metrics
- `GET /api/todos` — Filtered & sorted task list
- `GET /api/todos/:id` — Single task details with subtasks & activity logs
- `POST /api/todos` — Create new task with optional subtasks
- `PUT /api/todos/:id` — Update existing task details
- `PATCH /api/todos/:id/toggle` — Fast status toggle (`completed` / `pending`)
- `DELETE /api/todos/:id` — Delete task and associated relational records
- `POST /api/todos/:id/subtasks` — Add subtask to task
- `PATCH /api/subtasks/:subtaskId/toggle` — Toggle subtask completion status
- `DELETE /api/subtasks/:subtaskId` — Remove subtask
