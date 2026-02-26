# Server (API)

ASP.NET Core API for the Todo application.

## Overview

This server provides REST-style endpoints for managing todos and is the source of truth for persisted todo state.

Implemented capabilities include:

- Get all todos
- Create todo
- Update todo
- Toggle/update completion state
- Delete todo
- CORS configuration for client access
- ProblemDetails-based error responses
- Integration test suite with isolated test database

## Tech Stack

- .NET 10
- ASP.NET Core
- Entity Framework Core
- SQLite (test provider in integration tests)
- xUnit + FluentAssertions (server test suite)

## Project Structure

- `server/api`
  - API entrypoint, controllers, middleware, service layer
- `server/efscaffold`
  - EF entities / DB context scaffolding artifacts
- `server/api.Tests`
  - Integration tests for API behavior and DB state

## API Endpoints (current expected routes)

- `GET /`
- `GET /todos`
- `POST /todos`
- `PUT /todos/{id}`
- `PATCH /todos/{id}`
- `DELETE /todos/{id}`

## Run Locally

From repo root:

```bash
dotnet run --project server/api/api.csproj
```

Or from `server/`:

```bash
dotnet run --project api/api.csproj
```

Default local API URL is defined by ASP.NET launch settings/environment.

## Test Suite

Run from repo root:

```bash
dotnet test server/api.Tests/api.Tests.csproj
```

Or from `server/`:

```bash
dotnet test api.Tests/api.Tests.csproj
```

Detailed test suite documentation:

- `server/api.Tests/README.md`

## CI

Server tests run in GitHub Actions via:

- `.github/workflows/server-tests.yml`

Current workflow behavior:

- restore server solution
- build in Release
- run integration tests
- upload `.trx` results artifact

## Error Handling / Boundaries

- API uses ProblemDetails-style error mapping.
- Missing resource and validation/error mapping behavior is covered by integration tests.
- Stale/update conflict behavior is currently out of scope.

## Notes

- This README is server-focused; see `client/README.md` for frontend setup.
- A root-level README is recommended for end-to-end project onboarding across client + server.
