# Client (Frontend)

React + TypeScript frontend for the Todo application.

## Overview

This client provides:

- Todo list display
- Filtering (`All Tasks`, `Completed`, `Incomplete`, `High Priority`)
- Create todo modal
- Update todo modal (including `isDone`)
- Toggle completion
- Delete todo
- Global error toast handling for API failures

## Tech Stack

- React 19
- TypeScript
- Vite
- Redux Toolkit + React Redux
- Chakra UI (components/toast primitives)
- styled-components (theme usage)
- Axios (API client)

## Scripts

Run from repo root with prefix:

```bash
npm run dev --prefix client
npm run build --prefix client
npm run test --prefix client
npm run test:watch --prefix client
npm run lint --prefix client
```

Or from inside `client/`:

```bash
npm run dev
npm run build
npm run test
npm run test:watch
npm run lint
```

## Environment

Client API base URL is read from:

- `VITE_API_BASE_URL`

Fallback (if unset): `http://localhost:5107`

Create `client/.env` (or `.env.local`) if needed:

```env
VITE_API_BASE_URL=http://localhost:5107
```

## Running Locally

1. Start server API first (from `server/`).
2. Start client dev server:

```bash
npm run dev --prefix client
```

Default Vite URL is typically:

- `http://localhost:5173`

## API Integration Notes

The client expects these server endpoints:

- `GET /todos`
- `POST /todos`
- `PUT /todos/{id}`
- `PATCH /todos/{id}`
- `DELETE /todos/{id}`

## Testing

Client test suite uses:

- Vitest
- jsdom
- Testing Library
- MSW

Detailed test suite documentation:

- `client/src/test/README.md`

### Run Gate (local convention)

Before merge, run:

```bash
npm run test --prefix client
npm run build --prefix client
```

## Notes

- This project started from a Vite scaffold and has been customized for the take-home scope.
- Some non-blocking test/runtime warnings may be listed in the project README under Future Work.
