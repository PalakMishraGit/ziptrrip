# Features & Capabilities Documentation

This document outlines all features and functionalities implemented in the Enterprise Multi-Page Todo Application.

---

## 🎨 Frontend Features (React Multi-Page Application)

### 1. Multi-Page Architecture (Non-SPA)
- **Separate HTML Entry Points**: Built using Vite Multi-Page Application (MPA) setup (`index.html` and `todo.html`).
- **Standard Browser Navigation**: Real document navigation (`window.location.href`) between pages rather than simulated single-page router rendering.

### 2. Page 1: Todos List Dashboard (`index.html`)
- **Metrics Overview Banner**:
  - Total Tasks counter
  - Pending & In Progress active tasks counter
  - Completed tasks counter with percentage progress
  - Overdue tasks counter based on ISO timestamp evaluation
- **Multi-Criteria Search & Filter Engine**:
  - Real-time text search (searches title and description fields)
  - Status filter dropdown (`All`, `Pending`, `In Progress`, `Completed`)
  - Priority level filter dropdown (`All`, `Urgent`, `High`, `Medium`, `Low`)
  - Category Chip filter bar dynamically populated from database categories
  - Multi-column sorting (`Created Date`, `Due Date`, `Priority Weight`, `Alphabetical Title`) with ASC/DESC toggle
- **Interactive Task Cards**:
  - Priority badge with distinct glowing color coding (Urgent: red glow, High: amber, Medium: blue, Low: emerald)
  - Quick toggle completion checkbox
  - Subtask progress bar indicator (e.g. `2/3 Subtasks (67%)`)
  - Due date countdown badge highlighting overdue tasks in red
  - **"View Details" Link**: Directly navigates to Page 2 (`/todo.html?id=<task_id>`)
- **Quick Creation Modal**:
  - Form validation for Title, Description, Priority, Category, Due Date
  - Dynamic subtask list creation directly inside modal before saving

### 3. Page 2: Single Todo Detail View (`todo.html?id=<ID>`)
- **URL Query Parameter Parser**:
  - Parses `id` parameter from URL query string (`window.location.search`).
  - Fetches specific todo details, subtasks, and audit history from Express API.
- **Editable Core Properties**:
  - Title inline input with focus state styling
  - Detailed rich description textarea
  - Status selector dropdown (`Pending`, `In Progress`, `Completed`)
  - Priority selector dropdown (`Low`, `Medium`, `High`, `Urgent`)
  - Category string tag input
  - Due date datepicker
- **Subtasks Checklist Engine**:
  - Add subtask step input
  - Individual subtask completion checkbox toggle
  - Subtask deletion action
  - Real-time subtask completion percentage bar calculation
- **Activity & Audit Trail Timeline**:
  - History log showing creation timestamp, title modifications, status updates, and subtask additions.
- **Navigation Controls**:
  - "Back to Todos List" button returning to `index.html`.
  - Delete task button with prompt confirmation.
- **Robust 404 / Missing Parameter View**:
  - Visual fallback card if `id` parameter is missing or task ID does not exist in SQLite database.

---

## ⚙️ Backend Features (Node.js + Express + SQLite)

### 1. RESTful API Architecture
- Modular controller-service-repository layered structure.
- Middleware logging (`morgan`) and CORS header configuration.
- Global error handling middleware returning uniform JSON responses.

### 2. Database & Data Model
- **SQLite Database** (`data/todos.db`) via `better-sqlite3`.
- **Relational Tables**:
  - `todos`: `id`, `title`, `description`, `category`, `priority`, `status`, `dueDate`, `createdAt`, `updatedAt`
  - `subtasks`: `id`, `todoId`, `title`, `completed`, `createdAt` (Foreign Key `ON DELETE CASCADE`)
  - `activity_logs`: `id`, `todoId`, `action`, `createdAt` (Foreign Key `ON DELETE CASCADE`)
- **Automated Data Seeder**: Automatically populates 4 realistic demo tasks with subtasks on fresh installation.

### 3. Advanced Querying Capabilities
- Full-text keyword search across titles and descriptions using SQL `LIKE`.
- Filter aggregation by status, priority, and category.
- Dynamic sorting by creation date, due date, custom priority ordering, or title.
- Aggregated statistics API endpoint (`/api/stats`).
