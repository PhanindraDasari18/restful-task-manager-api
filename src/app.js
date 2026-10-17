const express = require('express');
const taskRoutes = require('./routes/tasks');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Parse JSON request bodies and log incoming requests.
app.use(express.json());
app.use(requestLogger);

app.get('/', (req, res) => {
  res.json({
    message: 'Task Manager API is running',
    endpoints: '/api/tasks',
    documentation: 'See README.md for endpoint details'
  });
});

app.use('/api/tasks', taskRoutes);

// Return a consistent JSON response for unknown routes.
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Keep error handling after routes.
app.use(errorHandler);

module.exports = app;
