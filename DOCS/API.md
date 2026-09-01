# REST API Reference Documentation

Base Server URL: `http://localhost:5000/api`

---

## 1. System Health Check

### `GET /api/health`
Returns the operational status of the Express server.

**Response (200 OK):**
```json
{
  "status": "online",
  "timestamp": "2026-09-01T17:53:29.124Z",
  "service": "Enterprise Todo REST API"
}
```

---

## 2. Dashboard Statistics

### `GET /api/stats`
Retrieves aggregated metrics for the frontend dashboard.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total": 4,
    "completed": 1,
    "pending": 2,
    "inProgress": 1,
    "overdue": 0,
    "completionRate": 25,
    "categories": ["Architecture", "Backend", "Design", "Documentation"]
  }
}
```

---

## 3. Todos Endpoints

### `GET /api/todos`
Retrieve a list of todo items matching optional filter parameters.

**Query Parameters:**
| Parameter | Type | Default | Description |
|---|---|---|---|
| `status` | string | `all` | Filter by status: `pending`, `in_progress`, `completed` |
| `priority` | string | `all` | Filter by priority: `low`, `medium`, `high`, `urgent` |
| `category` | string | `all` | Filter by category name |
| `search` | string | `""` | Keyword search in title and description |
| `sortBy` | string | `createdAt` | Sort field: `createdAt`, `dueDate`, `priority`, `title` |
| `sortOrder` | string | `DESC` | `ASC` or `DESC` |

**Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "todo-1",
      "title": "Architect Enterprise Multi-Page React Router & State",
      "description": "Design robust modular architecture...",
      "category": "Architecture",
      "priority": "high",
      "status": "completed",
      "dueDate": "2026-09-02T17:53:08.041Z",
      "createdAt": "2026-09-01T17:53:08.041Z",
      "updatedAt": "2026-09-01T17:53:08.041Z",
      "totalSubtasks": 3,
      "completedSubtasks": 3
    }
  ]
}
```

---

### `GET /api/todos/:id`
Fetch complete details for a single todo item by ID, including subtasks and activity logs.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "todo-1",
    "title": "Architect Enterprise Multi-Page React Router & State",
    "description": "Design robust modular architecture...",
    "category": "Architecture",
    "priority": "high",
    "status": "completed",
    "dueDate": "2026-09-02T17:53:08.041Z",
    "createdAt": "2026-09-01T17:53:08.041Z",
    "updatedAt": "2026-09-01T17:53:08.041Z",
    "subtasks": [
      {
        "id": "sub-101",
        "todoId": "todo-1",
        "title": "Define Vite MPA entrypoints",
        "completed": 1,
        "createdAt": "2026-09-01T17:53:08.041Z"
      }
    ],
    "logs": [
      {
        "id": "log-x123",
        "todoId": "todo-1",
        "action": "Todo created in initial database seed",
        "createdAt": "2026-09-01T17:53:08.041Z"
      }
    ]
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Todo with ID 'invalid-id' not found"
}
```

---

### `POST /api/todos`
Create a new todo task.

**Request Body:**
```json
{
  "title": "Setup OAuth2 Authentication",
  "description": "Integrate JWT and OAuth workflow",
  "category": "Backend",
  "priority": "high",
  "status": "pending",
  "dueDate": "2026-09-10T00:00:00.000Z",
  "subtasks": [
    { "title": "Configure Passport middleware" }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Todo created successfully",
  "data": { /* Created Todo Object */ }
}
```

---

### `PUT /api/todos/:id`
Update an existing todo task.

---

### `PATCH /api/todos/:id/toggle`
Fast toggle todo status between `completed` and `pending`.

---

### `DELETE /api/todos/:id`
Delete todo task and associated subtasks/logs.

---

## 4. Subtasks Endpoints

- `POST /api/todos/:id/subtasks` — Add subtask to todo
- `PATCH /api/subtasks/:subtaskId/toggle` — Toggle subtask completion status
- `DELETE /api/subtasks/:subtaskId` — Remove subtask
