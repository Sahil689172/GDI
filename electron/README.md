# Electron foundation

This folder contains the desktop wrapper for **Gotta-do-it**.

## Dev

- `npm run desktop:dev` — Vite + Electron (no API; good for UI-only desktop testing).
- `npm run desktop:all` — API + Vite + Electron (full stack; sync/auth work).
- `npm run desktop` — waits for `http://localhost:3000`, then opens Electron.
- `npm run desktop:api` — waits for Vite **and** `GET /api/health`, then opens Electron.

## Build

- `npm run desktop:build` builds the web app then packages via `electron-builder` into `release/`.

## Icons

Replace the placeholder `electron/assets/icon.png` with a real 512×512 (or larger) PNG.
For Windows shipping quality, you’ll likely also want a `.ico` later — this is a foundation.

## Windows note (symlinks)

If packaging fails with “Cannot create symbolic link… privilege is not held”, enable **Windows Developer Mode**
or run the build in an elevated shell. This is a common Windows restriction when toolchains unpack files that use symlinks.

