# Gotta-do-it API

Node.js + Express + MongoDB backend with JWT authentication.

## Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set JWT_SECRET and MONGODB_URI
npm run dev
```

From the project root:

```bash
npm run dev:api
```

## Environment

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default `5000`) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing tokens |
| `JWT_EXPIRES_IN` | Token lifetime (default `7d`) |
| `CLIENT_URL` | Allowed CORS origin(s), comma-separated |

## API

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | No | Health check |
| POST | `/auth/register` | No | Create account |
| POST | `/auth/login` | No | Sign in |
| POST | `/auth/logout` | No | Clear auth cookie |
| GET | `/auth/me` | Yes | Current user |
| GET | `/users/profile` | Yes | Protected profile |

### Auth headers

Send the JWT as either:

- `Authorization: Bearer <token>`
- HttpOnly cookie `gdi_token` (set automatically on login/register)

### Register / login body

```json
{
  "name": "Alex",
  "email": "alex@example.com",
  "password": "SecurePass1"
}
```

Password rules: min 8 chars, uppercase, lowercase, and number.

## Project structure

```
src/
  config/       env, database
  controllers/  request handlers
  middleware/   auth, validation, errors
  models/       Mongoose schemas
  routes/       API routers
  services/     business logic
  utils/        helpers (JWT, errors, async)
  validators/   express-validator rules
  app.js        Express app factory
  index.js      Server entry
```
