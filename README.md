# Todo Application (Full Stack)

This repository contains a full-stack Todo application with:

- `client/` — React + TypeScript frontend
- `server/` — ASP.NET Core API backend
- `server/api.Tests/` — backend integration test suite

## Architecture Overview

### Client (`client/`)
The frontend renders todo data and user workflows:

- View todos
- Filter todos (`All Tasks`, `Completed`, `Incomplete`, `High Priority`)
- Create todo (modal)
- Update todo (modal)
- Toggle completion
- Delete todo
- Display global API error toasts

Client state is managed with Redux Toolkit.  
Client tests are implemented with Vitest + Testing Library + MSW.

### Server (`server/`)
The backend exposes REST-style endpoints and persists todo state:

- `GET /`
- `GET /todos`
- `POST /todos`
- `PUT /todos/{id}`
- `PATCH /todos/{id}`
- `DELETE /todos/{id}`

Server includes middleware-based error mapping and integration tests using `WebApplicationFactory` + SQLite test DB.

## How Client and Server Interoperate

1. The client sends HTTP requests to the server API using Axios.
2. Base URL is configured by `VITE_API_BASE_URL` (fallback to local API URL).
3. Server returns todo DTOs and HTTP status codes.
4. Redux thunks in the client consume those responses and update UI state.
5. On API failures, client triggers global toast error handling and clears Redux error state.

## Repository Layout

- `client/README.md` — client-specific run/build/test docs
- `client/src/test/README.md` — client test-suite scope and boundaries
- `server/README.md` — server-specific run/test docs
- `server/api.Tests/README.md` — backend test-suite details

## Quick Start (Local)

## Prerequisites

- Node.js + npm
- .NET SDK (matching project target framework)

## 1) Run server

From repo root:

```bash
dotnet run --project server/api/api.csproj
```

## 2) Run client

From repo root:

```bash
npm run dev --prefix client
```

Client usually runs at:

- `http://localhost:5173`

If needed, set API base URL in `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5107
```

## Testing

## Client tests

```bash
npm run test --prefix client
npm run build --prefix client
```

## Server tests

```bash
dotnet test server/api.Tests/api.Tests.csproj
```

## CI

- Server CI workflow is implemented at:
  - `.github/workflows/server-tests.yml`
- Client run gate is currently documented as local convention; CI enforcement is tracked as future work.

## Future Work

### Client-Side Work
1. Implement client-side sorting and searching for todos.
2. Define and apply a single UX policy for modal inline errors vs global toasts (partially implemented; both patterns currently exist).
3. Implement runtime light/dark theme switching and pass selected theme state into `ThemeProvider`.
4. Optimize client bundle output to address current large-chunk warning (>500kB).
5. Implement granular per-operation API lifecycle state for create/update/toggle/delete flows (`pending/loading/succeeded/failed`) (partially implemented; shared status/error currently exists).
6. Implement standardized column sizing and potentially resizing of columns.

### Server-Side Work
1. Implement JWT/session authentication for protected API access.
2. Standardize API error message text per endpoint/action for clearer, more specific toasts (partially implemented; complete by defining and applying a consistent message contract across all API error paths).
3. Introduce a dedicated `NotFound` exception type instead of using `ValidationException` for missing resources.
4. Implement stale/update conflict behavior.

### Testing Work
1. Add corresponding server-side integration test coverage for stale/update conflict behavior.
2. Enforce the client run gate through CI and branch protection (currently documented as local convention only).

## Notes

- This root README is the cross-cutting project entrypoint.
- See subsystem READMEs for implementation detail:
  - `client/README.md`
  - `server/README.md`
  - `client/src/test/README.md`
  - `server/api.Tests/README.md`
