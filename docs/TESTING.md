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
- `src/features/auth/userTypeKyc.test.ts`: Tests `user_type` ("natural" | "legal") registration rules, conditional KYC validation logic (10-digit national ID for natural vs 11-digit national ID + company name for legal), and `getKycQueue()` returning both natural and legal pending verifications with `user_type`.
- `src/utils/persianUtils.test.ts`: Persian digit parsing, national ID validation, currency/number formatting, and date utilities.
- `src/stores/auth.permissions.test.ts`: Role and permission checks within the authentication store.
- `src/stores/auth.mockSignout.test.ts`: Mock sign-out marker transitions (fresh seed, reload persistence after logout without auto-reseed, login clearance, and live mode immunity).
- `src/features/landing/guard.test.ts`: Pure landing redirect logic (`getLandingRedirect`) across enabled, disabled, absent, and error flag states for `/`, `/landing`, and other routes.
- `src/features/landing/landingConstants.test.ts`: Verifies zero-width non-joiner (U+200C / ZWNJ) character integrity and Persian typography for document title and meta description.
- `src/features/landing/content/landingContent.test.ts`: Validates Single Source of Truth (SSOT) integrity for regulatory locked strings (§2.5 four boundary statements and closing sentence, §2.6 product status string, §2.8 all 6 FAQ questions and locked answers, pricing disclaimer, and ZWNJ formatting).
- `src/features/landing/forms/iranianMobile.test.ts`: Pure validator testing Iranian mobile number formats with English and Persian digits.
- `src/features/landing/forms/leadCaptureValidator.test.ts`: Pure validator testing lead capture form fields (name, mobile, role, note limits).
- `src/features/landing/forms/contactValidator.test.ts`: Pure validator testing contact form fields (name, email format, message limits).
- `src/features/landing/utils/landingListingUtils.test.ts`: Navigation routing helper returning `/login` for guests and `/listings/:id` for authenticated users.
- `src/features/listings/composables/useSmartPricing.test.ts`: Discount rate and smart pricing calculation logic.
- `src/shared/composables/useFeatureFlags.test.ts`: Feature flag loading, stale localStorage merging for `show_risk_tier` and `show_landing_page` (defaulting to enabled in simulator seed) without resetting user data, dynamic evaluation across toggle updates, and fail-closed error handling.
- `src/features/moderation/moderationRiskTier.test.ts`: Moderation approval logic with `risk_tier` assignment.
- `src/api/client.test.ts`: Mock environment gating checks.
- `src/api/liveFixes.test.ts`: Live API handling checks for verification state & document uploads.
- `src/utils/offlineAssets.test.ts`: Offline asset guard asserting index.html has no Google Fonts CDN links and src/ has no external placeholder image URLs.
- `src/utils/themeOverrides.test.ts`: Naive UI theme resolution and token overrides for all supported themes.
- `src/stores/useUiStore.test.ts`: Validates UI store defaults, `isSidebarCollapsed` toggle and explicit setter with `chequeyar_sidebar_collapsed` localStorage persistence, and decoupling from mobile drawer state.
- `src/shared/utils/breakpoints.test.ts`: Pure helper testing breakpoint constants and desktop `md` (`768px`) evaluation.
- `src/shared/utils/menuOptions.test.ts`: Pure helper testing menu option group flattening, unnesting children, non-group item preservation, array immutability, and fixture matching for compact sidebar rail.
- `src/shared/banks/lookup.test.ts`: Validates 14 local catalog bank definitions, stable ascending Persian sorting, exact code lookup with trimming, display name and alias exact lookup (without fuzzy/substring matches), and theme brand color resolution.
- `src/shared/banks/useBanksCatalog.test.ts`: Validates reactive bank catalog composable (`useBanksCatalog`), synchronous initial load of `LOCAL_BANKS`, and remote `GET /api/v1/banks/` fetch with error fallback.
- `src/shared/components/BankBadge.test.ts`: Validates BankBadge component rendering across catalog logo, initial character on theme brand color surface, unknown fallback state with neutral building icon, accessible label without name, and compact size styling.
- `src/shared/components/BankSelect.test.ts`: Validates BankSelect component rendering with catalog banks, `allow-all` option toggling, and event emission (`update:value` and `update:modelValue`) with catalog bank codes.
- `src/api/banks.test.ts`: Validates `banksApi.list` live and mock routing, and `listingsApi.createListing`/`updateListing` transformation ensuring `bank` code is passed and `bank_name` is stripped from outgoing payloads.
- `src/stores/useBackendSimulatorStore.banks.test.ts`: Validates simulator store bank catalog seeding, listing hydration with `BankSummary`, bank code enforcement on create/update, and marketplace filter precedence (`filters.bank` over `filters.bank_name`).
- `src/features/reports/utils/chartTheming.test.ts`: ApexCharts dynamic palette, tooltip, and theme adaptation testing.

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

### Testing Natural vs Legal KYC Queue

- **Mock Mode Testing (`VITE_USE_MOCK=true`):**
  1. Log in as `moderator1` or switch role to Moderator via the Test Role switcher.
  2. Navigate to `/moderation/kyc`.
  3. Verify that the queue displays at least one **Natural Person** (شخص حقیقی, 10-digit national ID) item and at least one **Legal Entity** (شخصیت حقوقی, company name + 11-digit national ID + legal representative name) item with explicit type badges (`data-testid="kyc-queue-user-type"`).
- **Live API Testing (`VITE_USE_MOCK=false`):**
  - When testing against a migrated and seeded backend (`doion`), live backend seed users include `holderkyc1` (natural pending KYC) and `holderkyclegal1` (legal pending KYC). See the `doion` seed documentation and [MASTER_API_CONTRACT.md](https://github.com/alamalhoda/doion/blob/develop/docs/development/MASTER_API_CONTRACT.md) for details.
  - Verification API responses return `user_type: "natural" | "legal"` read-only.

### Testing the Landing Page as a Guest in Mock Mode

To verify the public landing page experience from the perspective of an unauthenticated (guest) user:
1. In mock mode (`VITE_USE_MOCK=true`), log out via the user menu in the header. This writes `chequeyar_mock_signed_out = 'true'` to `localStorage`.
2. Reload the page or navigate to `/` or `/landing`. The mock auto-seed is skipped and you remain logged out.
3. Observe:
   - Header shows **ورود** (`landing-nav-login`, mobile: `landing-nav-login-mobile`) and **ثبت‌نام** (`landing-nav-register`, mobile: `landing-nav-register-mobile`). For authenticated users, it shows **ورود به بازارچه** (`landing-nav-marketplace`, mobile: `landing-nav-marketplace-mobile`).
   - Hero section renders the pilot badge (`landing-hero-pilot-badge`) with exact text `v1 لایه ۱ آماده پایلوت — نه در حال ساخت MVP، نه لانچ‌شده`.
   - Hero CTAs provide primary `landing-hero-primary-cta` («ثبت‌نام» -> `/register`) and secondary `landing-hero-secondary-cta` («ورود» -> `/login`) for guests, plus tertiary link «مشاهده بازارچه».
   - Responsibility Boundary section (`#responsibility-boundary`) renders all 4 locked statements as separate cards, accompanied by the closing sentence «چک‌یار واسط فناورانه است، نه نهاد مالی.».
   - Pricing section (`#pricing`) lists the 3 future revenue models with no numbers and the prominent disclaimer «در محصول فعلی کارمزدی دریافت نمی‌شود.».
   - Live listings section (`#live-listings`) displays up to 4 published listings with toman currency conversion, Jalali due dates, and remaining days. Clicking a card directs guests to `/login` with zero authenticated network requests.
   - Risk Tier Badge Gating: In default mock seed, `show_risk_tier` is disabled (no badge shown). Navigate to `/admin/feature-flags` as Admin, enable `show_risk_tier`, and reload `/landing` to observe risk badges (`data-testid="landing-listing-risk-tier"`) on listings with assigned risk tiers.
   - Interactive Forms (`#contact-us`, `#lead-capture-form`): Invalid submissions display inline field errors. Valid submissions display toast feedback and reset fields without triggering backend HTTP requests.
   - FAQ section (`#faq`) displays all 6 locked questions (`landing-faq-item-1` through `landing-faq-item-6`), which expand on click to reveal locked answers.
   - Anchor links (`#how-it-works`, `#live-listings`, `#faq`, `#contact-us`) scroll smoothly to each section.
   - Footer links trigger the «به‌زودی» placeholder notification without broken routes.
4. To return to an authenticated state, click **ورود**, log in with any demo persona, or clear `localStorage`.

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

## 7. CI (GitHub Actions), Docker Verification & Mock Environment Policy

Continuous Integration is configured via [.github/workflows/ci.yml](../.github/workflows/ci.yml). Google AI Studio continuously pushes to the default `main` intake branch. The long-lived `product` branch acts as the production git line. On every push and pull request to both `main` and `product` branches (including PRs targeting `product` from `main`), GitHub Actions executes five sequential verification steps:
1. `bun run lint` (TypeScript compilation & type checking)
2. `bun run test` (Vitest unit tests running in `happy-dom` environment; `localStorage` access in `src/api/client.ts` is safely guarded)
3. `bun run build` (Default production build validation)
4. `bun run build` with `VITE_USE_MOCK="false"` and `VITE_API_BASE_URL="https://chequeyar-back.chbkn.dev/api/v1"` (Live non-mock production build verification)
5. `docker build` with `VITE_USE_MOCK="false"` and `VITE_API_BASE_URL="https://chequeyar-back.chbkn.dev/api/v1"` (Production container packaging verification)

> Note: Deployment of the production SPA service (`chequeyar-front`) from the `product` branch is decoupled and handled in a separate step. Opening a PR from `main` to `product` exercises the identical CI verification suite.

### Docker Build & Local Compose Smoke Testing

While daily active frontend development runs on the host via `bun run dev`, the containerized production image can be tested locally:

```bash
# Build production live container image
docker build \
  --build-arg VITE_USE_MOCK="false" \
  --build-arg VITE_API_BASE_URL="http://localhost:8000/api/v1" \
  -t checkyar-frontend:local .

# Run containerized frontend on port 8080
docker run -p 8080:80 checkyar-frontend:local

# Or use docker-compose for local smoke testing
docker compose up --build
```

### E2E Integration Dispatch (`dispatch-doion-e2e.yml`)
Upon successful completion of the CI workflow on a push to `main`, [.github/workflows/dispatch-doion-e2e.yml](../.github/workflows/dispatch-doion-e2e.yml) sends a `repository_dispatch` event (`event_type: "frontend-e2e"`) to `alamalhoda/doion` with the verified UI commit SHA (`ui_sha`). The Playwright E2E test results execute and report in the `doion` Actions tab without gating or blocking frontend checks in this repository. The repository owner must configure the secret `DOION_E2E_DISPATCH_TOKEN` (a GitHub PAT with permissions to post repository dispatch events to `alamalhoda/doion`).

### Mock Mode Environment Policy in Testing
- **Env Gated:** Mock/simulator UI chrome and runtime toggles are active ONLY when `VITE_USE_MOCK=true`.
- **Live-Only UI:** When `VITE_USE_MOCK=false`, simulator header controls, login mock banners, switches (`data-testid="mock-mode-switch"`), persona quick login panels, and quick-fill helper buttons are hidden.
- Unit tests in `src/api/client.test.ts` verify that `getMockMode()` strictly returns `false` and `setMockMode(true)` is a no-op when `VITE_USE_MOCK=false`.

> Note: End-to-End Playwright tests remain owned and executed within the `doion` monorepo (`e2e/` directory).

### Continuous Deployment for Mock Demo (CD)

The hosted mock demo deployment is handled separately from CI testing. Upon push to `main`, [.github/workflows/cd-demo.yml](../.github/workflows/cd-demo.yml) executes lint and unit tests, compiles a mock SPA with `VITE_USE_MOCK=true`, and deploys it to Chabokan Static (`chequeyar-front-demo`). The standard CI workflow (`ci.yml`) continues to run default live-shape compilation checks on push and PR. E2E tests remain in the `doion` monorepo (`e2e/`).

### Continuous Deployment for Product Live SPA (`cd-product.yml`)

Deployment of the live production SPA service (`chequeyar-front`) is configured as a separate, manual owner-triggered workflow ([.github/workflows/cd-product.yml](../.github/workflows/cd-product.yml)). It is triggered via `workflow_dispatch` only (with the owner selecting the `product` branch), compiles the live bundle (`VITE_USE_MOCK=false`, `VITE_API_BASE_URL=https://chequeyar-back.chbkn.dev/api/v1`), overrides `chabok.json` on the runner workspace to target `chequeyar-front` (because Chabokan CLI prefers that file over `-s`), and deploys directly to the existing Chabokan service `chequeyar-front`. Mock demo CD (`cd-demo.yml`) remains unchanged.

---

## 8. Theming & Dynamic Styling Verification

### Verifying Multi-Theme UI Consistency
When modifying UI components or surfaces:
1. Ensure components use semantic Tailwind tokens (`bg-slate-900`, `bg-slate-800`, `text-slate-100`, `text-slate-400`, `border-slate-800`) mapped to CSS variables, rather than hardcoded colors.
2. Verify all six themes (`dark`, `light`, `warm`, `navy`, `violet`, `emerald`) via the theme selector in the application header or `/profile/settings`.
3. Check charts in `/reports` to verify dynamic palette and tooltip switching across themes.
4. Run `bun run lint` and `bun run test` to ensure zero regressions across theme utilities.

---

## 9. Bank Catalog & Payout Bank Verification

### Testing Bank Badges and Bank Selection
- **BankBadge (`BankBadge.vue`):** Verified via `src/shared/components/BankBadge.test.ts` across standard sizes, compact mode, brand colors, and unknown bank fallbacks.
- **BankSelect (`BankSelect.vue`):** Verified via `src/shared/components/BankSelect.test.ts`. Checks:
  - Option list rendering with logo or brand initial.
  - "All Banks" (`allow-all="true"`) option rendering with neutral building icon (`BusinessOutline`) and no brand color.
  - Correct propagation of `data-testid` props (`bank-select`, `marketplace-bank-filter`, `listing-form-bank`, `account-payout-bank`).
- **Marketplace Bank Filtering (`MarketplaceView.vue`):** Verified via `src/features/marketplace/MarketplaceView.test.ts`. Confirms that selecting a bank sends `bank` code only, removes `bank_name` from the request query object, and clears both fields when resetting.
- **Listing Creation Form Validation (`useListingForm.ts`):** Verified via `src/features/listings/composables/useListingForm.test.ts`. Confirms that invalid or empty bank values prevent Step 1 validity and abort `publishListing` without calling `listingsApi.createListing`.
- **My Account Payout Bank Settings (`MyAccountView.vue`):** Verified via `src/features/profile/MyAccountView.test.ts`. Confirms:
  - `BankSelect` is rendered with `data-testid="account-payout-bank"` and `allow-all="false"`.
  - In **Mock Mode**, restoring and saving the payout bank updates `useBackendSimulatorStore` (`getPayoutBankCode` / `setPayoutBankCode`) and saves to `chequeyar_simulator_v1`.
  - In **Live Mode**, saving profile details calls `usersApi.updateMe` without attaching unbacked `bank` fields to the Django REST request.



