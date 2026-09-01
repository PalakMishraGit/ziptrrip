# Architectural Design & Rationale

**Author**: Senior Software Architect (20 Years Experience Perspective)  
**Project**: TaskSphere Enterprise Multi-Page Todo Application

---

## 🏛️ Executive Summary

When designing a production-grade application with explicit non-SPA (Multi-Page Application) constraints and a query-parameter driven detail page architecture, several architectural principles must be balanced:

1. **Strict Multi-Page Routing vs. Client-Side SPA**: Fulfilling multi-page browser mechanics while retaining modern React component reusability and fast build pipelines.
2. **Layered Separation of Concerns**: Decoupling the HTTP layer (Express Controllers) from Business Logic (Services) and Persistence (SQLite).
3. **Optimized User Experience**: Providing micro-animations, glassmorphism UI, search/filter responsiveness, subtask progress tracking, and detailed audit history.

---

## 📐 Key Design Decisions

### 1. Multi-Page React Architecture (Vite MPA)

**Challenge**: Standard React apps are built as Single-Page Applications (SPAs) with client-side routers (e.g. `react-router-dom`). The requirement explicitly mandates:
> *"Application has to be multiple page instead of SPA. Make one page for todos list... Make second page for single todo item. This page should receive a query parameter of todo id and display the todo."*

**Solution**:
We implemented **Vite Multi-Page Application (MPA)** bundle mode with two separate HTML entry points:
- **`index.html`** → Loads `src/main.jsx` → Renders `<ListPage />`
- **`todo.html`** → Loads `src/todo.jsx` → Renders `<DetailPage />`

```
Browser Request -> GET /index.html ---> Load Page 1 Bundle (ListPage)
Browser Request -> GET /todo.html?id=todo-1 ---> Load Page 2 Bundle (DetailPage)
```

**Benefits**:
- True HTML page boundaries and browser history transitions.
- Query Parameter Parsing: `new URLSearchParams(window.location.search).get('id')` cleanly retrieves the active task ID on page initialization.
- Independent JavaScript chunks (`dist/index.html`, `dist/todo.html`, `dist/assets/main-*.js`, `dist/assets/detail-*.js`), optimizing initial page load speed.

---

### 2. Persistence Layer: Relational SQLite (`better-sqlite3`)

**Decision**: Chosen over simple JSON files or external database instances.

**Rationale**:
- **Zero Configuration**: No external process or server setup required. Database is stored in `backend/data/todos.db`.
- **Relational Integrity**: Uses `FOREIGN KEY` constraints with `ON DELETE CASCADE` so deleting a todo automatically cleans up related subtasks and activity logs.
- **Synchronous Performance**: `better-sqlite3` uses C bindings to execute SQLite queries synchronously in Node.js, outperforming async SQLite wrappers and avoiding event loop starvation for localized file DB operations.
- **Auto-Seeding**: Upon first startup, if the database is empty, a seed transaction populates 4 rich sample todos with subtasks and logs.

---

### 3. Modular Backend Architecture (Layered Pattern)

```
[ HTTP Request ] -> [ Express Router ] -> [ Controller Validation ] -> [ Service Logic ] -> [ SQLite Database ]
```

1. **Routes (`routes/todoRoutes.js`)**: Pure URI to Controller method mapping.
2. **Controllers (`controllers/todoController.js`)**: Input validation (string checks, priority/status enum enforcement), HTTP status code mapping (200, 201, 400, 404, 500).
3. **Services (`services/todoService.js`)**: SQL statement preparation, parameter binding, transactions, and business calculations (e.g. overdue status, subtask progress stats).
4. **Middleware (`middleware/errorHandler.js`)**: Centralized error handling catching unhandled exceptions and returning formatted JSON `{ success: false, error: ... }`.

---

### 4. UI/UX Design System (Vanilla CSS + Modern Tokens)

- **Palette**: Dark Mode slate tones (`#0B0F19`), indigo (`#6366F1`) & violet accents (`#8B5CF6`).
- **Glassmorphism**: Translucent cards (`rgba(18, 24, 38, 0.75)`) with `backdrop-filter: blur(16px)` and subtle borders (`rgba(255, 255, 255, 0.08)`).
- **Typography**: Inter / Plus Jakarta Sans for clean legibility and JetBrains Mono for ID badges and timestamps.
- **Responsive Layout**: CSS Grid and Flexbox with media queries supporting desktop, tablet, and mobile displays.

---

## 🔒 Security & Data Integrity

1. **SQL Injection Prevention**: All SQLite queries utilize parameterized prepared statements (`db.prepare('SELECT * FROM todos WHERE id = ?')`).
2. **Input Sanitization**: Controllers trim user input strings and enforce strict enum checks on priority (`low`, `medium`, `high`, `urgent`) and status (`pending`, `in_progress`, `completed`).
3. **CORS & Proxying**: Vite development server proxies API requests `/api` to Express on port `5000`, bypassing CORS issues during development.
