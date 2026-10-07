# Task Tracker

A small full-stack task manager. Create tasks, set a priority, move them through **To Do → In Progress → Done**, filter by status, view details, and delete them.

- **Frontend:** React 19 + Vite (`client/`)
- **Backend:** Node.js + Express 5 + Mongoose 9 (`server/`)
- **Database:** MongoDB (local or Atlas)
- **Tests:** Node's built-in test runner + Supertest

```
task-tracker/
├── client/   # React SPA (Vite)
└── server/   # REST API (Express + Mongoose)
    ├── app.js          # Express app, middleware, error handling
    ├── server.js       # DB connection + process entry point
    ├── routes/         # Route definitions
    ├── controllers/    # Request handling / validation
    ├── models/         # Mongoose schema
    └── test/           # API tests
```

---

## Setup

### Prerequisites

- Node.js 20+ (developed on Node 22) and npm
- A MongoDB instance: local (`mongod`) or a free MongoDB Atlas cluster

### 1. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables

```bash
# Backend (required)
cp server/.env.example server/.env
# then edit server/.env and set MONGODB_URI

# Frontend (optional - only needed if the API is not on http://localhost:5000)
cp client/.env.example client/.env
```

| Variable | Where | Required | Description |
|---|---|---|---|
| `MONGODB_URI` | `server/.env` | Yes | MongoDB connection string. The server exits on startup if it is missing. |
| `PORT` | `server/.env` | No | API port. Defaults to `5000`. |
| `VITE_API_URL` | `client/.env` | No | Backend base URL. Defaults to `http://localhost:5000`. |

The `.env.example` files contain placeholders only. Real `.env` files are git-ignored.

### 3. Run the app

In two terminals:

```bash
# Terminal 1 - API (http://localhost:5000)
cd server
npm run dev      # nodemon, auto-restart  (or: npm start)

# Terminal 2 - UI (http://localhost:5173)
cd client
npm run dev
```

Health check: `curl http://localhost:5000/health`

### Production build of the UI

```bash
cd client
npm run build     # outputs to client/dist
npm run preview   # serve the built bundle locally
```

---

## Test commands

```bash
# Backend API tests
cd server
npm test

# Frontend lint
cd client
npm run lint
```

The backend tests use `node --test` with Supertest against the Express app. They **do not need a database**: validation failures happen before any DB call, and the status-update test stubs `Task.findByIdAndUpdate`. Current coverage:

1. Creating a task with a title over 100 characters returns `400`.
2. Updating a task's status returns `200` with the updated task.

### Quick manual API check

```bash
# Create
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Write README","priority":"High"}'

# List (optionally filter)
curl "http://localhost:5000/tasks?status=To%20Do"

# Update status
curl -X PATCH http://localhost:5000/tasks/<id> \
  -H "Content-Type: application/json" \
  -d '{"status":"Done"}'

# Delete
curl -X DELETE http://localhost:5000/tasks/<id>
```

## API reference

| Method | Path | Body / Query | Success | Errors |
|---|---|---|---|---|
| `GET` | `/health` | - | `200` | - |
| `POST` | `/tasks` | `title` (required, ≤100 chars), `description?`, `status?`, `priority?` | `201` `{ message, task }` | `400` validation |
| `GET` | `/tasks` | `?status=To Do \| In Progress \| Done` | `200` `{ message, tasks }` (newest first) | `400` invalid status |
| `PATCH` | `/tasks/:id` | `status` (required) | `200` `{ message, task }` | `400` bad id/status, `404` not found |
| `DELETE` | `/tasks/:id` | - | `200` `{ message }` | `400` bad id, `404` not found |

**Task fields:** `title`, `description` (default `""`), `status` (`To Do` default), `priority` (`Low` / `Medium` / `High`, default `Medium`), `createdAt`.

---

## Assumptions

- Single-user, single-tenant app: all tasks are visible to anyone who can reach the API.
- A MongoDB instance is available and reachable from the server.
- Status and priority are fixed sets of values (defined in both `server/models/Task.js` and `client/src/constants.js`).
- Only a task's **status** is editable after creation; title, description and priority are set once.
- Deleting is permanent (hard delete), guarded only by a browser confirmation dialog.
- The task list is small enough to load in one request.
- The API and UI run on different origins in development, so CORS is open.

## Limitations

- **No authentication or authorization** (out of scope; see below).
- **No pagination or search.** `GET /tasks` returns every task.
- **Status filter runs client-side.** The API supports `?status=`, but the UI filters the already-loaded list.
- **No editing** of title, description or priority.
- **Limited test coverage:** two backend tests, no frontend tests, no integration tests against a real database.
- **CORS is wide open** (`cors()` with defaults) and there is **no rate limiting**, request-size tuning or security headers.
- **`description` has no length limit.**
- **No Docker/CI configuration;** the app runs locally only.
- No real-time sync: changes made in another browser appear only after a reload.

---

## Technical decisions

- **Separate `client/` and `server/` packages.** Keeps the API independently runnable and testable, and lets either side be deployed on its own.
- **Express app split from the server entry point** (`app.js` vs `server.js`). Tests import the app without opening a port or connecting to a database.
- **Routes → controllers → model layering.** Small, but it keeps HTTP concerns, business logic and persistence separate and easy to extend.
- **Validation in the Mongoose schema** (required title, 100-char limit, enums) plus a central error-handling middleware that turns `ValidationError`, `CastError` and malformed JSON into clear `400` responses instead of leaking stack traces.
- **Explicit input handling.** Controllers pick only known fields from the body (no mass assignment), validate ObjectIds before querying, and return `404` for missing tasks.
- **`PATCH` for status changes** instead of a full `PUT`, since status is the only mutable field and partial updates are the semantically right fit.
- **Node's built-in test runner** with Supertest: no extra test framework to install or configure.
- **Plain React state, no state library.** The UI is small enough that `useState`/`useMemo` plus a thin `fetch` wrapper (`api.js`) is simpler than Redux or React Query. Loading, empty, error, and retry states are handled in the UI.
- **Configuration via environment variables** (`dotenv` on the server, `VITE_` variables on the client) so no connection details live in source.

## Improvements with more time

1. **Authentication and per-user data** (see below).
2. **Edit tasks** (title, description, priority), plus due dates, tags and sorting.
3. **Server-side filtering, search and pagination**; make the UI use `?status=`.
4. **Broader tests:** more API cases (invalid ids, 404s, filters, delete), tests against `mongodb-memory-server`, component tests with Vitest + React Testing Library, and an end-to-end smoke test (Playwright).
5. **Input hardening:** `helmet`, rate limiting, a restrictive CORS allow-list, and a schema validator such as Zod or Joi.
6. **Optimistic UI updates** with rollback, and a soft-delete / undo for removed tasks.
7. **Tooling:** CI (lint + tests on every PR), Dockerfile / docker-compose with a local MongoDB, ESLint + Prettier for the server, TypeScript.
8. **Observability:** structured logging, request IDs, and a readiness check that verifies the DB connection.
9. **Accessibility pass:** keyboard navigation and focus management in the details modal, ARIA labels, contrast review.

---

## Authentication and access restrictions in production

Authentication and cloud deployment are intentionally out of scope for this assignment. Here is how they would be added.

**Authentication**

- Use a managed identity provider (Auth0, Clerk, Cognito, Firebase Auth, or Azure AD B2C) rather than building password handling by hand. Alternatively, email/password with `bcrypt`/`argon2` hashing.
- The React app signs the user in (OIDC / Authorization Code + PKCE) and receives a short-lived access token (JWT). It sends the token as `Authorization: Bearer <token>` on every API call; `api.js` is the single place to add this header.
- The API adds an auth middleware that verifies the token's signature, issuer, audience and expiry on every `/tasks` route (`/health` stays public). If sessions are cookie-based instead, use `HttpOnly`, `Secure`, `SameSite` cookies plus CSRF protection.

**Access restrictions (authorization)**

- Add an `owner` field (the user's ID from the token) to the `Task` schema and index it.
- Scope every query by owner: `Task.find({ owner: req.user.id })`, `findOneAndUpdate({ _id, owner })`, `findOneAndDelete({ _id, owner })`. Return `404` for another user's task so IDs cannot be probed.
- Set `owner` from the verified token on create, never from the request body.
- For teams or shared tasks, add roles (e.g. `admin`, `member`) or a membership collection and check them in middleware.

**Supporting controls**

- Restrict CORS to the production frontend origin only.
- Serve everything over HTTPS; add `helmet` security headers.
- Rate-limit the API, especially login-related routes.
- Keep secrets (DB URI, auth keys) in the platform's secret manager, and use a least-privilege MongoDB user with an IP allow-list.
- Add audit logging for create/update/delete and failed authentication attempts.