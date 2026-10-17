# RESTful Task Manager API

A beginner-friendly backend project built with Node.js and Express.js for the Yuva Intern Junior Node.js Developer Week 1 task. It supports CRUD operations, input validation, request logging, JSON error responses, and file-based JSON storage.

## Features

- Create, list, view, update, and delete tasks
- Task fields: `id`, `title`, `description`, `dueDate`, `status`, `createdAt`, `updatedAt`
- Status values: `pending`, `in-progress`, `completed`
- Optional status filter on the task list
- Request logging middleware
- Centralized error handling and 404 responses
- Validation for required title, date, and status
- Data saved in `data/tasks.json` (no database installation needed)

## Requirements

- Node.js 18 or later recommended
- npm
- Postman (for manual API testing)

## Installation and run

1. Extract the project folder.
2. Open a terminal in the project directory.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the API:

   ```bash
   npm start
   ```

5. The API will run at `http://localhost:3000`.

For development with automatic restart:

```bash
npm install
npm run dev
```

## API endpoints

Base URL: `http://localhost:3000`

| Method | Endpoint | Description | Success response |
|---|---|---|---|
| GET | `/` | API health/info | 200 |
| GET | `/api/tasks` | List all tasks | 200 |
| GET | `/api/tasks?status=pending` | Filter tasks by status | 200 |
| GET | `/api/tasks/:id` | Get one task | 200 |
| POST | `/api/tasks` | Create a task | 201 |
| PUT | `/api/tasks/:id` | Update a task | 200 |
| DELETE | `/api/tasks/:id` | Delete a task | 200 |

### Create task example

Send a `POST` request to `/api/tasks` with `Content-Type: application/json`:

```json
{
  "title": "Complete internship task",
  "description": "Build and test the Task Manager API",
  "dueDate": "2026-12-31",
  "status": "pending"
}
```

### Update task example

Send a `PUT` request to `/api/tasks/1`:

```json
{
  "status": "in-progress",
  "description": "Testing endpoints in Postman"
}
```

The update route accepts partial updates even though it uses `PUT`, for convenience in this training project.

## Response and error handling

Successful responses use JSON. Invalid input returns `400 Bad Request`; a missing task or route returns `404 Not Found`. Unexpected server errors return a JSON error message with status `500`. Requests are logged to the server console with timestamp, method, path, status code, and duration.

## Postman testing

Import `docs/Task-Manager-API.postman_collection.json` into Postman. Run the requests in order: health check, create task, list tasks, get task by ID, update task, filter tasks, delete task, and verify a missing task returns 404. The collection stores the created task ID in a collection variable automatically.

## Project structure

```text
task-manager-api/
├── data/
│   └── tasks.json
├── docs/
│   └── Task-Manager-API.postman_collection.json
├── src/
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── requestLogger.js
│   ├── routes/
│   │   └── tasks.js
│   ├── app.js
│   └── server.js
├── .gitignore
├── package.json
└── README.md
```

## Limitations

This learning project uses a local JSON file rather than a production database. It is appropriate for a small practice assignment but is not designed for concurrent writes or production-scale use. Authentication and automated test suites are not included in this Week 1 version.

## GitHub submission

Create a new public GitHub repository, for example `restful-task-manager-api`. Upload all project files except `node_modules`. Then copy the repository URL into your internship submission form. Do not upload secrets or credentials.
