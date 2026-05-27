# Electron foundation

This folder contains the desktop wrapper for **Gotta-do-it**.

## Dev

- `npm run desktop:dev` starts Vite and Electron (loads `http://localhost:3000`).

## Build

- `npm run desktop:build` builds the web app then packages via `electron-builder` into `release/`.

## Icons

Replace the placeholder `electron/assets/icon.png` with a real 512×512 (or larger) PNG.
For Windows shipping quality, you’ll likely also want a `.ico` later — this is a foundation.

## Windows note (symlinks)

If packaging fails with “Cannot create symbolic link… privilege is not held”, enable **Windows Developer Mode**
or run the build in an elevated shell. This is a common Windows restriction when toolchains unpack files that use symlinks.

