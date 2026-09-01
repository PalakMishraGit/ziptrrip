import http from 'http';

const BASE_URL = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:5173';

function request(url, options = {}, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: body ? JSON.parse(body) : null, raw: body });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Automated Integration Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health Check
    console.log('1️⃣ Testing Health Check Endpoint...');
    const health = await request(`${BASE_URL}/health`);
    assert(health.status === 200 && health.data.status === 'online', 'Health endpoint returns 200 OK');

    // 2. Fetch Stats
    console.log('\n2️⃣ Testing Stats Endpoint...');
    const stats = await request(`${BASE_URL}/stats`);
    assert(stats.status === 200 && typeof stats.data.data.total === 'number', 'Stats endpoint returns valid dashboard stats');

    // 3. Fetch All Todos
    console.log('\n3️⃣ Testing GET /api/todos...');
    const todos = await request(`${BASE_URL}/todos`);
    assert(todos.status === 200 && Array.isArray(todos.data.data), 'Todos list endpoint returns array of todos');
    assert(todos.data.data.length >= 4, `Database contains ${todos.data.data.length} seeded sample items`);

    // 4. Create New Todo with Subtasks
    console.log('\n4️⃣ Testing POST /api/todos (Create Task)...');
    const newTodoPayload = {
      title: 'Automated Test Task ' + Date.now(),
      description: 'Created during integration test run',
      category: 'Testing',
      priority: 'urgent',
      status: 'pending',
      subtasks: [
        { title: 'Subtask Step A', completed: false },
        { title: 'Subtask Step B', completed: true }
      ]
    };
    const createRes = await request(`${BASE_URL}/todos`, { method: 'POST', headers: { 'Content-Type': 'application/json' } }, newTodoPayload);
    assert(createRes.status === 201 && createRes.data.success, 'Created new todo task with status 201');
    const createdId = createRes.data.data.id;
    assert(createdId && createdId.startsWith('todo-'), `Generated valid ID: ${createdId}`);

    // 5. Fetch Single Todo Detail (Page 2 backend target)
    console.log(`\n5️⃣ Testing GET /api/todos/${createdId} (Single Item Detail)...`);
    const detailRes = await request(`${BASE_URL}/todos/${createdId}`);
    assert(detailRes.status === 200 && detailRes.data.data.title === newTodoPayload.title, 'Retrieved single todo details matching created title');
    assert(detailRes.data.data.subtasks.length === 2, 'Retrieved associated subtasks');
    assert(detailRes.data.data.logs.length >= 1, 'Retrieved activity log entry');

    // 6. Update Todo
    console.log(`\n6️⃣ Testing PUT /api/todos/${createdId} (Update Task)...`);
    const updateRes = await request(`${BASE_URL}/todos/${createdId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' } }, {
      title: newTodoPayload.title + ' (Updated)',
      priority: 'high',
      status: 'in_progress'
    });
    assert(updateRes.status === 200 && updateRes.data.data.status === 'in_progress', 'Updated status to in_progress');

    // 7. Toggle Todo Status
    console.log(`\n7️⃣ Testing PATCH /api/todos/${createdId}/toggle (Fast Toggle)...`);
    const toggleRes = await request(`${BASE_URL}/todos/${createdId}/toggle`, { method: 'PATCH' });
    assert(toggleRes.status === 200 && toggleRes.data.data.status === 'completed', 'Toggled status to completed');

    // 8. Add Subtask
    console.log(`\n8️⃣ Testing POST /api/todos/${createdId}/subtasks...`);
    const subRes = await request(`${BASE_URL}/todos/${createdId}/subtasks`, { method: 'POST', headers: { 'Content-Type': 'application/json' } }, { title: 'New Dynamic Subtask' });
    assert(subRes.status === 201 && subRes.data.data.subtasks.length === 3, 'Added 3rd subtask to task');

    // 9. Delete Todo
    console.log(`\n9️⃣ Testing DELETE /api/todos/${createdId}...`);
    const deleteRes = await request(`${BASE_URL}/todos/${createdId}`, { method: 'DELETE' });
    assert(deleteRes.status === 200 && deleteRes.data.success, 'Successfully deleted test todo item');

    // 10. Verify Frontend Multi-Page HTTP Responses
    console.log('\n🔟 Testing Frontend Multi-Page HTML Entry Points...');
    const page1 = await request(`${FRONTEND_URL}/index.html`);
    assert(page1.status === 200 && page1.raw.includes('Workspace Overview'), 'Page 1 (index.html - List Dashboard) returns HTTP 200 & valid React entry point');

    const page2 = await request(`${FRONTEND_URL}/todo.html?id=todo-1`);
    assert(page2.status === 200 && page2.raw.includes('Item Detail View'), 'Page 2 (todo.html?id=todo-1 - Single Detail Page) returns HTTP 200 & valid React entry point');

    console.log(`\n==========================================`);
    console.log(`📊 Test Results: ${passed} PASSED, ${failed} FAILED`);
    console.log(`==========================================\n`);

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();
