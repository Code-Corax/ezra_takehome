# Client Test Suite

This directory contains the client-side test setup and test plan implementation for the Todo app.

## Stack

- Test runner: `vitest`
- DOM environment: `jsdom`
- UI testing: `@testing-library/react`
- User interactions: `@testing-library/user-event`
- DOM matchers: `@testing-library/jest-dom`
- API mocking: `msw` (`msw/node`)

## Test Setup

- Global setup file: `client/src/test/setup.ts`
  - Registers `jest-dom` matchers.
  - Starts MSW before tests.
  - Resets handlers after each test.
  - Closes MSW after all tests.
- MSW handlers:
  - `client/src/test/msw/handlers.ts`
  - `client/src/test/msw/server.ts`

## Implemented Coverage

### 1) Smoke / setup tests
- `client/src/test/smoke.test.ts`
  - Verifies test runner is configured and executing.
- `client/src/test/renderWithProviders.test.tsx`
  - Verifies shared provider wrapper renders correctly.

### 2) App integration tests
- `client/src/App.test.tsx`

Implemented behaviors:
- Initial fetch success path:
  - App renders and shows todo row from mocked `GET /todos`.
- API failure path:
  - Mocked error response triggers global error toast.
- Global toast behavior:
  - “Request failed” appears on API error.
  - Redux error state is cleared after handling.
  - Re-render does not re-toast the same cleared error (validated by `toaster.create` call count staying at one).
- App smoke coverage:
  - Core shell renders (`All Tasks`, panel structure).
- Filter behavior:
  - `Completed` shows only completed todos.
  - `Incomplete` shows only incomplete todos.
  - `All Tasks` resets to full list.

### 3) Create modal tests
- `client/src/app/components/CreateTodoModal.test.tsx`

Implemented behaviors:
- Modal opens when `isOpen` is true.
- Valid submit calls submit handler and closes.
- Invalid submit (empty title) is blocked and shows validation helper text.

### 4) Update modal tests
- `client/src/app/components/UpdateTodoModal.test.tsx`

Implemented behaviors:
- Prefills fields from `updatingTodo`.
- Toggling status updates submitted payload `isDone` (checkbox queried by accessible name `Status` in current Chakra markup).
- Save submits expected payload shape:
  - `{ title, description, priority, isDone }`

### 5) Todo row interaction tests
- `client/src/app/components/TodoLine.test.tsx`

Implemented behaviors:
- Checkbox toggle dispatches update/toggle action for target todo.
- Trash button dispatches delete action for target todo.

## Run Gate (Merge-Ready Requirement)

Before merging any client change, all of the following must pass:

```bash
npm run test --prefix client
npm run build --prefix client
```

If either command fails, the change is not merge-ready.

Note: this is currently a project convention gate. CI/branch-protection enforcement should be configured separately if required.

## Notes / Current Warnings

Current test output includes non-blocking warnings related to toast rendering timing (`act` / `flushSync` warnings).  
These do not currently fail the suite, but can be addressed in a future cleanup pass.

### Test Boundaries and Scope

- No snapshot tests in this suite.
- No style/CSS assertion tests except critical visibility behavior.
- Prefer mocking only network boundaries (MSW); avoid mocking Redux internals unless a component-isolation test specifically requires it.

## Scripts

From `client/package.json`:
- `npm run test --prefix client`
- `npm run test:watch --prefix client`
- `npm run build --prefix client`
