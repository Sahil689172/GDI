# MongoDB Atlas setup — Gotta-do-it

Step-by-step guide to move from local MongoDB (`127.0.0.1`) to **MongoDB Atlas** (cloud).

---

## 1. Create a MongoDB Atlas account

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up (Google/GitHub or email)
3. Create an **organization** and **project** (defaults are fine)

---

## 2. Create a cluster

1. In Atlas, click **Build a Database**
2. Choose **M0 FREE** (Shared) for development
3. Pick a **cloud provider & region** close to you (e.g. AWS `us-east-1`)
4. Cluster name: e.g. `GottaDoIt` → **Create**
5. Wait until status is **Active** (green)

---

## 3. Configure database user (username + password)

1. During setup (or later: **Security → Database Access → Add New Database User**)
2. **Authentication**: Password
3. Username: e.g. `gdi_app`
4. Password: generate a **strong password** and save it (you need it for the URI)
5. **Database User Privileges**: `Read and write to any database` (or restrict to `gotta-do-it`)
6. Click **Add User**

> Store the password in a password manager. You cannot view it again in Atlas.

---

## 4. Configure network access (IP whitelist)

Atlas blocks all connections until your IP is allowed.

1. **Security → Network Access → Add IP Address**
2. For **local development**:
   - Click **Add Current IP Address**, or
   - Use `0.0.0.0/0` (**Allow access from anywhere**) — convenient for dev only; **avoid in production**
3. For **production**: add only your server’s static IP(s)
4. Confirm → wait ~1 minute for rules to apply

---

## 5. Generate the connection string (URI)

1. **Database → Connect** on your cluster
2. Choose **Drivers**
3. Driver: **Node.js**, version 5.5 or later
4. Copy the connection string, e.g.:

```text
mongodb+srv://gdi_app:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

5. Replace `<password>` with your database user password (URL-encode special characters: `@` → `%40`, `#` → `%23`, etc.)
6. Add your **database name** before the query string:

```text
mongodb+srv://gdi_app:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/gotta-do-it?retryWrites=true&w=majority
```

| Part | Meaning |
|------|---------|
| `mongodb+srv://` | Atlas SRV connection |
| `gdi_app` | Database user |
| `cluster0.xxxxx.mongodb.net` | Cluster host |
| `gotta-do-it` | Database name (collections live here) |
| `retryWrites=true&w=majority` | Recommended Atlas options |

---

## 6. Move the backend to Atlas

1. Open `backend/.env` (create from example if missing):

```bash
cd backend
cp .env.example .env
```

2. Comment out local URI and set Atlas URI:

```env
NODE_ENV=development
PORT=5000

# Local (disable when using Atlas)
# MONGODB_URI=mongodb://127.0.0.1:27017/gotta-do-it

# Atlas
MONGODB_URI=mongodb+srv://gdi_app:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/gotta-do-it?retryWrites=true&w=majority

JWT_SECRET=your-long-random-secret
CLIENT_URL=http://localhost:3000
```

3. **Never commit** `.env` to git (already in `.gitignore`)

---

## 7. Verify connection

```bash
cd backend
npm run db:verify
```

Expected output:

```text
✅ Connection successful
   Host: cluster0-shard-00-00.xxxxx.mongodb.net
   Database: gotta-do-it
   users: N document(s)
   workspaces: N document(s)
   tasks: N document(s)
```

Start the API:

```bash
npm run dev
```

Look for:

```text
[mongodb] Connecting to mongodb+srv://gdi_app:****@cluster0....mongodb.net/gotta-do-it (development)
[mongodb] Connected → host: ..., database: gotta-do-it
```

Health check:

```bash
curl http://127.0.0.1:5000/api/health
```

Response should include `"database": { "status": "ok", "isAtlas": true }`.

---

## 8. Verify data in Atlas UI

### Browse collections

1. Atlas → **Database → Browse Collections**
2. Select database **`gotta-do-it`**
3. You should see collections after using the app:
   - **`users`** — signup/login accounts
   - **`workspaces`** — per-user workspaces
   - **`tasks`** — tasks linked to workspaces

### Confirm documents

1. Click a collection → **Documents** tab
2. After **signup**: `users` has `name`, `email`, `streak`, `createdAt`
3. After **creating a workspace**: `workspaces` has `user`, `name`, `order`, `collapsed`
4. After **adding a task**: `tasks` has `user`, `workspace`, `title`, `completed`, `priority`, `order`

### Test via API (saves to Atlas)

```bash
# Signup
curl -X POST http://127.0.0.1:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Atlas Test","email":"atlas@test.com","password":"SecurePass1"}'

# Use token from response, then create workspace + task
```

Refresh Atlas **Documents** — new rows should appear within seconds.

### Atlas Data Explorer filters

- `users`: filter `{ "email": "atlas@test.com" }`
- `workspaces`: filter by your user ObjectId
- `tasks`: filter `{ "completed": false }`

---

## 9. Production checklist

| Item | Action |
|------|--------|
| `NODE_ENV` | Set to `production` |
| `MONGODB_URI` | Atlas URI only (no `127.0.0.1`) |
| `JWT_SECRET` | Long random string (32+ chars) |
| Network Access | Server IP only (not `0.0.0.0/0`) |
| Database user | Least privilege on `gotta-do-it` |
| Backups | Enable Atlas backups on paid tiers |
| Secrets | Use host env vars / secret manager, not files in repo |

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `MongoServerSelectionError` | IP whitelist, cluster paused, wrong URI |
| `Authentication failed` | Wrong user/password; URL-encode password in URI |
| `querySrv ENOTFOUND` | Typo in cluster hostname; use Atlas copy-paste URI |
| Empty collections | Normal until first API write; run signup/tasks |
| Still connects to local | Check `backend/.env` is loaded; restart server |

---

## Project files (reference)

| File | Role |
|------|------|
| `backend/.env` | Your real `MONGODB_URI` (gitignored) |
| `backend/.env.example` | Template with Atlas format |
| `backend/src/config/env.js` | Loads URI via dotenv |
| `backend/src/config/db.js` | Mongoose connect + error handling |
| `backend/scripts/verifyAtlasConnection.js` | `npm run db:verify` |
