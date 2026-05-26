# Gotta-do-it API

Node.js, Express, MongoDB, Mongoose, JWT, and dotenv.

## Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set MONGODB_URI (Atlas) and JWT_SECRET
npm run db:verify   # test database connection
npm run dev
```

From project root: `npm run dev:api` or `npm run dev:all`

**MongoDB Atlas:** full setup guide → [`docs/MONGODB_ATLAS.md`](docs/MONGODB_ATLAS.md)

All routes below (except health/auth signup/login) require `Authorization: Bearer <token>`.

---

## Auth

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/auth/signup` | Create account |
| POST | `/auth/login` | Sign in |
| POST | `/auth/logout` | Clear cookie |
| GET | `/auth/profile` | Current user |

---

## Workspaces

Nested structure: each workspace includes its `tasks[]` sorted by `order`.

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/workspaces` | List workspaces + nested tasks |
| POST | `/workspaces` | Create workspace |
| PUT | `/workspaces/:id` | Update name / collapsed / order |
| DELETE | `/workspaces/:id` | Delete workspace + all its tasks |
| PUT | `/workspaces/reorder` | Persist drag order |

**Create body**
```json
{ "name": "Academic Goals", "collapsed": false }
```

**Reorder body**
```json
{ "orderedIds": ["workspaceId1", "workspaceId2"] }
```

---

## Tasks

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/tasks` | List tasks (filter/search) |
| POST | `/tasks` | Create task |
| PUT | `/tasks/:id` | Update / complete / move |
| DELETE | `/tasks/:id` | Delete task |
| PUT | `/tasks/reorder` | Persist drag order in workspace |

**Query params (GET)**  
`workspaceId`, `completed` (`true`|`false`), `priority` (`low`|`normal`|`high`), `search`, `sort` (`order`|`priority`|`newest`|`completed`)

**Create body**
```json
{
  "workspaceId": "...",
  "title": "Complete assignment",
  "priority": "high",
  "completed": false
}
```

**Update body** (any combination)
```json
{
  "title": "Updated title",
  "completed": true,
  "priority": "normal",
  "order": 2,
  "workspaceId": "..."
}
```

**Reorder body**
```json
{
  "workspaceId": "...",
  "orderedIds": ["taskId1", "taskId2", "taskId3"]
}
```

---

## Response shape

```json
{
  "success": true,
  "message": "Tasks retrieved",
  "data": { "tasks": [] },
  "meta": { "count": 0 }
}
```

---

## Structure

```
src/
  models/        User, Workspace, Task
  services/      auth, workspace, task
  controllers/
  routes/
  validators/
  middleware/    auth, validate, errorHandler
  utils/         mappers, ownership, ApiError, ApiResponse
```
