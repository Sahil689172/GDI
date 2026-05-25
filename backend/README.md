# Gotta-do-it API — Authentication

Node.js, Express, MongoDB, Mongoose, JWT, bcrypt (bcryptjs), and dotenv.

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Auth endpoints

Base: `http://localhost:5000/api`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/auth/signup` | No | Create account |
| POST | `/auth/login` | No | Sign in |
| POST | `/auth/logout` | No | Clear session cookie |
| GET | `/auth/profile` | Yes | Current user profile |

### Signup / login body

```json
{
  "name": "Alex",
  "email": "alex@example.com",
  "password": "SecurePass1"
}
```

### Auth header

`Authorization: Bearer <token>` or HttpOnly cookie `gdi_token`.

### Success response shape

```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "Alex",
      "email": "alex@example.com",
      "streak": 0,
      "createdAt": "2026-05-25T..."
    },
    "token": "eyJhbG..."
  }
}
```

## Structure

```
src/
  controllers/   authController.js
  routes/        authRoutes.js, index.js
  middleware/    auth.js, validate.js, errorHandler.js
  models/        User.js
  services/      authService.js
  validators/    authValidators.js
  utils/         jwt.js, userMapper.js, ApiError.js, ApiResponse.js
```
