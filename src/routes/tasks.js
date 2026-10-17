const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DATA_FILE = path.join(__dirname, '../../data/tasks.json');

function readTasks() {
  try {
    const content = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(content || '[]');
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

function writeTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2) + '\n');
}

function validateTaskInput(body, isUpdate = false) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Request body must be a JSON object';
  }

  if (!isUpdate || body.title !== undefined) {
    if (typeof body.title !== 'string' || !body.title.trim()) {
      return 'Title is required and must be a non-empty string';
    }
  }

  if (body.description !== undefined && typeof body.description !== 'string') {
    return 'Description must be a string';
  }

  if (body.dueDate !== undefined && body.dueDate !== null && body.dueDate !== '') {
    if (typeof body.dueDate !== 'string' || Number.isNaN(Date.parse(body.dueDate))) {
      return 'dueDate must be a valid date string, such as 2026-12-31';
    }
  }

  if (body.status !== undefined &&
      !['pending', 'in-progress', 'completed'].includes(body.status)) {
    return 'Status must be pending, in-progress, or completed';
  }

  return null;
}

function nextId(tasks) {
  return tasks.reduce((max, task) => Math.max(max, Number(task.id) || 0), 0) + 1;
}

// GET /api/tasks - list all tasks, optionally filter by status.
router.get('/', (req, res, next) => {
  try {
    let tasks = readTasks();
    if (req.query.status) {
      if (!['pending', 'in-progress', 'completed'].includes(req.query.status)) {
        return res.status(400).json({ error: { message: 'Invalid status filter' } });
      }
      tasks = tasks.filter(task => task.status === req.query.status);
    }
    res.json({ count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
});

// GET /api/tasks/:id - retrieve one task.
router.get('/:id', (req, res, next) => {
  try {
    const task = readTasks().find(item => item.id === Number(req.params.id));
    if (!task) {
      return res.status(404).json({ error: { message: 'Task not found' } });
    }
    res.json({ data: task });
  } catch (error) {
    next(error);
  }
});

// POST /api/tasks - create a task.
router.post('/', (req, res, next) => {
  try {
    const validationError = validateTaskInput(req.body);
    if (validationError) {
      return res.status(400).json({ error: { message: validationError } });
    }

    const tasks = readTasks();
    const now = new Date().toISOString();
    const task = {
      id: nextId(tasks),
      title: req.body.title.trim(),
      description: (req.body.description || '').trim(),
      dueDate: req.body.dueDate || null,
      status: req.body.status || 'pending',
      createdAt: now,
      updatedAt: now
    };

    tasks.push(task);
    writeTasks(tasks);
    res.status(201).json({ message: 'Task created successfully', data: task });
  } catch (error) {
    next(error);
  }
});

// PUT /api/tasks/:id - update one or more editable task fields.
router.put('/:id', (req, res, next) => {
  try {
    const validationError = validateTaskInput(req.body, true);
    if (validationError) {
      return res.status(400).json({ error: { message: validationError } });
    }

    const tasks = readTasks();
    const index = tasks.findIndex(item => item.id === Number(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: { message: 'Task not found' } });
    }

    const current = tasks[index];
    const updated = {
      ...current,
      ...(req.body.title !== undefined ? { title: req.body.title.trim() } : {}),
      ...(req.body.description !== undefined ? { description: req.body.description.trim() } : {}),
      ...(req.body.dueDate !== undefined ? { dueDate: req.body.dueDate || null } : {}),
      ...(req.body.status !== undefined ? { status: req.body.status } : {}),
      updatedAt: new Date().toISOString()
    };

    tasks[index] = updated;
    writeTasks(tasks);
    res.json({ message: 'Task updated successfully', data: updated });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/tasks/:id - delete one task.
router.delete('/:id', (req, res, next) => {
  try {
    const tasks = readTasks();
    const index = tasks.findIndex(item => item.id === Number(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: { message: 'Task not found' } });
    }

    const [deleted] = tasks.splice(index, 1);
    writeTasks(tasks);
    res.json({ message: 'Task deleted successfully', data: deleted });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
