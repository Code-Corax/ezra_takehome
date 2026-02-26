# Server API Test Suite

This test project covers integration-level behavior for the server API in `server/api`.

## Scope

The suite validates:

- HTTP contract behavior (status codes + response payloads)
- Persistence behavior (database state after requests)
- Error mapping behavior (`ProblemDetails` responses)
- CORS behavior for configured origins
- Root endpoint behavior
- Test isolation (no data leakage between tests)

## Stack

- Test framework: `xUnit`
- Assertions: `FluentAssertions`
- Test host: `Microsoft.AspNetCore.Mvc.Testing` (`WebApplicationFactory<Program>`)
- Test database: `Microsoft.EntityFrameworkCore.Sqlite`
- Coverage collector: `coverlet.collector`

## Project Structure

### Test infrastructure

- `ApiWebApplicationFactory.cs`
  - Custom `WebApplicationFactory<Program>` for integration tests.
  - Overrides DI to use test DB context.
- `IntegrationTestBase.cs`
  - Common base for integration tests.
  - Shared client/database setup helpers.
- `TestDbHelper.cs`
  - Database lifecycle helpers (init, reset/cleanup).
- `TestData.cs`
  - Shared seed/test model helpers.

### Implemented test suites

- `TodosPostTests.cs`
  - `POST /todos` contract behavior (status/body/defaults/id/date).
- `TodoGetTests.cs`
  - `GET /todos` retrieval behavior and result correctness.
- `TodosPatchTests.cs`
  - `PATCH /todos/{id}` behavior, including update/no-op paths.
- `TodosPutTests.cs`
  - `PUT /todos/{id}` full-update behavior and validation handling.
- `TodosDeleteTests.cs`
  - `DELETE /todos/{id}` deletion behavior and contract expectations.
- `ProblemDetailsTests.cs`
  - Error response schema/mapping (`404`, `500`) via `ProblemDetails`.
- `RootEndpointTests.cs`
  - Root endpoint (`GET /`) behavior.
- `CorsTests.cs`
  - CORS preflight behavior for allowed origins.
- `StateIsolationTests.cs`
  - Confirms tests are isolated and do not leak DB state.

## What each integration test should assert

For each endpoint-focused test, assertions should include:

- HTTP response correctness (status code + payload shape/values)
- Database state correctness after request execution

## Run Tests

From repo root:

```bash
dotnet test server/api.Tests/api.Tests.csproj
```

Or from `server` directory:

```bash
dotnet test api.Tests/api.Tests.csproj
```

## CI

Server tests run automatically in GitHub Actions via:

- `.github/workflows/server-tests.yml`

Workflow responsibilities:

- restore
- build
- run tests
- upload `.trx` test result artifacts

## Notes / Current Boundaries

- Stale/update conflict behavior is currently out of scope.
- Deterministic server-side `500` mapping support is in place for test coverage.
- This suite prioritizes endpoint contract correctness and persistence verification over unit-level internals.
