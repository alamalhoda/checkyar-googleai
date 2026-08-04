# Testing Guide (Cheque Yar UI)

This document describes the testing strategy, commands, and test conventions for the **Cheque Yar** web frontend.

---

## 1. Unit Testing (Vitest)

Unit tests are used for validating standalone business logic, formatting utilities, pricing calculations, and store permission helpers.

### Commands

```bash
# Run all unit tests once
bun run test

# Run unit tests in watch mode
bun run test:watch
```

### Covered Areas

Current unit test suites in `src/` include:
- `src/utils/persianUtils.test.ts`: Persian digit parsing, national ID validation, currency/number formatting, and date utilities.
- `src/stores/auth.permissions.test.ts`: Role and permission checks within the authentication store.
- `src/features/listings/composables/useSmartPricing.test.ts`: Discount rate and smart pricing calculation logic.

---

## 2. Type Checking & Code Quality

Linting and static type checking are performed via TypeScript's compiler in non-emitting mode:

```bash
# Run TypeScript type check
bun run lint
```

This executes `tsc --noEmit` as defined in `package.json`.

---

## 3. Manual Live Testing

To test the frontend against a running backend (`doion` Django server):

1. Set `.env` to connect to local live API:
   ```env
   VITE_USE_MOCK=false
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```
2. Start the development server:
   ```bash
   bun run dev
   ```
3. Test using seed demo accounts on your local backend (e.g., `holder1`, `investor1`, `moderator1`).

### Mock/Simulator vs. Live Testing

> **Important:** The in-app Mock/Simulator mode (`VITE_USE_MOCK=true`) is designed strictly for UI demonstrations and isolated frontend development in Google AI Studio. It is **not** a substitute for integration testing against the live backend API contract.

---

## 4. End-to-End (E2E) Browser Testing

End-to-End testing (Playwright smoke & critical path suites) is owned and maintained in the **`doion` monorepo** under the `e2e/` directory.

- **E2E Test Suites:** Live in `alamalhoda/doion` (`e2e/` directory).
- **Runbook:** Refer to [E2E_LOCAL_RUNBOOK.md](https://github.com/alamalhoda/doion/blob/develop/docs/development/E2E_LOCAL_RUNBOOK.md) in the `doion` repo (`docs/development/E2E_LOCAL_RUNBOOK.md`) for instructions on launching E2E tests against local stack containers.
- **Frontend Status & E2E Overview:** See [FRONTEND_DEVELOPMENT_STATUS.md](https://github.com/alamalhoda/doion/blob/develop/docs/development/FRONTEND_DEVELOPMENT_STATUS.md) in `doion` for overall status and testing overview.
- **Do NOT** copy or duplicate Playwright test suites or configs into this frontend repo.

---

## 5. `data-testid` Selector Guidelines

To support stable E2E testing from Playwright without breaking on design/layout changes, adhere to the following conventions:

- Use **kebab-case** for all `data-testid` values (e.g., `express-interest-page`, `match-accept-btn`, `notifications-pagination`).
- **Naive UI (`NInput`) Native Selector Pattern:** Naive UI places attributes on wrapper `<div>` elements by default. For input components, pass `data-testid` via `:input-props`:
  ```html
  <NInput
    v-model:value="message"
    :input-props="{ 'data-testid': 'express-interest-message' }"
  />
  ```
- **Shared Dialogs (`ConfirmDialog`):** Use the optional `confirmTestId` / `cancelTestId` props so callers can assign contextual test IDs:
  ```html
  <ConfirmDialog
    :show="showConfirm"
    confirm-test-id="match-accept-confirm"
    @confirm="handleAccept"
  />
  ```

---

## 6. Development & Test Workflow

When introducing feature modifications or UI logic changes:
1. Update or add corresponding unit tests (`*.test.ts`) in this repository.
2. Run `bun run lint` and `bun run test` to ensure clean compilation and passing unit tests.
3. If new E2E selectors or user flow changes are required, notify/update the Playwright test suites in the `doion` monorepo.

---

## 7. CI (GitHub Actions)

Continuous Integration is configured via [.github/workflows/ci.yml](../.github/workflows/ci.yml). On every push and pull request to the `main` branch, GitHub Actions executes:
- `bun run lint` (TypeScript compilation & type checking)
- `bun run test` (Vitest unit tests)
- `bun run build` (Production build validation)

> Note: End-to-End Playwright tests remain owned and executed within the `doion` monorepo (`e2e/` directory).

