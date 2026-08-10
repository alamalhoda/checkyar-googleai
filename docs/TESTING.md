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
- `src/features/auth/userTypeKyc.test.ts`: Tests `user_type` ("natural" | "legal") registration rules and conditional KYC validation logic (10-digit national ID for natural vs 11-digit national ID + company name for legal).
- `src/utils/persianUtils.test.ts`: Persian digit parsing, national ID validation, currency/number formatting, and date utilities.
- `src/stores/auth.permissions.test.ts`: Role and permission checks within the authentication store.
- `src/features/listings/composables/useSmartPricing.test.ts`: Discount rate and smart pricing calculation logic.
- `src/shared/composables/useFeatureFlags.test.ts`: Feature flag loading and `show_risk_tier` flag evaluation.
- `src/features/moderation/moderationRiskTier.test.ts`: Moderation approval logic with `risk_tier` assignment.
- `src/api/client.test.ts`: Mock environment gating checks.
- `src/api/liveFixes.test.ts`: Live API handling checks for verification state & document uploads.
- `src/utils/offlineAssets.test.ts`: Offline asset guard asserting index.html has no Google Fonts CDN links and src/ has no external placeholder image URLs.

---

## 2. Type Checking & Code Quality

Linting and static type checking are performed via TypeScript's compiler in non-emitting mode:

```bash
# Run TypeScript type check
bun run lint
```

This executes `tsc --noEmit` as defined in `package.json`.

---

## 3. Live API Integration & Feature Testing

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

### Phase A Live Surfaces & API Endpoints

- **Live KYC on Profile (`/me`):** Submits KYC verifications via `POST /verifications/` and fetches current verification status via `GET /verifications/me/`.
- **KYC & Moderation Review:** Moderation queue items and KYC verification reviews (`/moderation/kyc/:id`) evaluate submissions and submit decisions via `POST /moderation/kyc/:id/decision/`.
- **Real `FormData` Uploads:** Document uploads (`listingsApi.uploadDocument`) convert binary `File` / `Blob` payloads into `FormData` (`POST /listings/:id/documents/`).
- **Supported Admin Surfaces:** Admin functionality is focused on `/admin/stats` (compliance metrics), `/admin/feature-flags` (feature flags), and `/admin/audit` (audit logs). Route `/admin/reports` redirects to `/admin/stats`.

### Mock/Simulator vs. Live Testing

> **Important:** The in-app Mock/Simulator mode (`VITE_USE_MOCK=true`) and GitHub Codespaces mock preview are designed strictly for UI demonstrations, visual inspection, and isolated frontend development. They are **not** a substitute for automated unit tests (`bun run test`) or integration testing against the live backend API contract and Playwright test suites in `doion`.

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

## 7. CI (GitHub Actions) & Mock Environment Policy

Continuous Integration is configured via [.github/workflows/ci.yml](../.github/workflows/ci.yml). On every push and pull request to the `main` branch, GitHub Actions executes:
- `bun run lint` (TypeScript compilation & type checking)
- `bun run test` (Vitest unit tests running in `happy-dom` environment; `localStorage` access in `src/api/client.ts` is safely guarded)
- `bun run build` (Production build validation)

### Mock Mode Environment Policy in Testing
- **Env Gated:** Mock/simulator UI chrome and runtime toggles are active ONLY when `VITE_USE_MOCK=true`.
- **Live-Only UI:** When `VITE_USE_MOCK=false`, simulator header controls, login mock banners, switches (`data-testid="mock-mode-switch"`), persona quick login panels, and quick-fill helper buttons are hidden.
- Unit tests in `src/api/client.test.ts` verify that `getMockMode()` strictly returns `false` and `setMockMode(true)` is a no-op when `VITE_USE_MOCK=false`.

> Note: End-to-End Playwright tests remain owned and executed within the `doion` monorepo (`e2e/` directory).

