# Architecture Overview (Cheque Yar UI)

This document serves as the Single Source of Truth (SSOT) for the **Cheque Yar (چک‌یار)** frontend architecture.

---

## 1. Purpose & Development Workflow

This repository (`alamalhoda/checkyar-googleai`) houses the active web frontend for the Cheque Yar platform. The `product` branch is the long-lived production git line, and `main` is the primary Google AI Studio intake and development branch.

### One-Way Sync Flow

Development of the UI source code occurs in **Google AI Studio**. Changes are pushed downstream to GitHub and pulled locally for integration testing against the backend.

```text
[Google AI Studio]  --push-->  GitHub (checkyar-googleai)
                                       |
                                       v  (git pull only)
                                Local Clone / Test against doion backend
```

> **CRITICAL RULE:** Do NOT commit or push UI source code changes directly from local machines or IDEs (e.g., Cursor). Local operations must strictly be limited to `git pull` and local testing.

---

## 2. Technology Stack

- **Framework:** Vue 3 (Composition API, `<script setup>`)
- **Language:** TypeScript
- **UI Component Library:** Naive UI
- **Styling:** Tailwind CSS v4
- **State Management:** Pinia
- **Routing:** Vue Router
- **Build Tool:** Vite
- **Package Manager:** **Bun** (`bun.lock` is the official lockfile; `package-lock.json` must NOT be committed)

---

## 3. Directory & Layer Structure

The codebase under `src/` follows a feature-based architecture with clean layer boundaries:

```text
src/
├── api/                     # HTTP client (Axios), interceptors, and API domain modules
│   ├── client.ts            # Axios instance configuration & interceptors
│   └── index.ts             # API modules (Auth, Listings, Matches, Notifications, Moderation, Admin)
├── features/                # Domain-specific feature modules
│   ├── admin/               # Admin panel (Stats, Feature Flags, Audit Events)
│   ├── auth/                # Authentication views & components
│   ├── landing/             # Public introduction page (LandingView, LandingHeader, LandingFooter, guard helper)
│   ├── listings/            # Cheque listing creation wizard, edit, detail, and my-listings
│   ├── marketplace/         # Public marketplace and search filters
│   ├── matches/             # Express interest, match proposals, and settlement tracking
│   ├── moderation/          # Moderation queue, review views, and KYC verification queue
│   ├── notifications/       # User notification center and preference settings
│   └── profile/             # User profile and account management
├── router/                  # Vue Router definitions and navigation guard logic
├── shared/                  # Shared/reusable UI components (AppHeader, AppSidebar, ConfirmDialog, BankBadge) and bank catalog (src/shared/banks/)
├── stores/                  # Global Pinia stores (auth store, backend simulator store)
├── types/                   # TypeScript interfaces, DTO definitions, and API response types
├── utils/                   # Helpers (Persian number formatting, date helpers, validation)
├── App.vue                  # Root application view
└── main.ts                  # Application entry point
```

---

## 4. Live vs. Mock Mode Configuration

The application runtime behavior is governed by the `VITE_USE_MOCK` environment variable:

| Mode | Environment Variables | Description |
|------|------------------------|-------------|
| **Live API** | `VITE_USE_MOCK=false`<br>`VITE_API_BASE_URL=http://localhost:8000/api/v1` | Pure Live mode. All simulator/mock UI chrome (header test role/simulator switcher, login mock banner & switch, quick-login persona cards & demo buttons) are completely hidden and unreachable. API client stays strictly on Live routes. |
| **Mock Mode** | `VITE_USE_MOCK=true` | Enables the in-memory Pinia simulator store (`useBackendSimulatorStore`), header test role/simulator controls, login mock persona cards, and runtime mock toggling. |

### Enforced Mock Environment Policy

- **Compile-Time Gate:** Mock/simulator features and runtime toggle capabilities exist **ONLY** when `VITE_USE_MOCK=true`.
- **Live Mode Guarantee:** When `VITE_USE_MOCK=false` (or not set to `'true'`), `getMockMode()` strictly returns `false` and `setMockMode(true)` is a no-op (ignoring leftover `localStorage` keys). The UI renders clean Live-only forms and headers.
- **Natural vs Legal User Contract (`user_type`):**
  - Registration requires `user_type` (`"natural" | "legal"`). For legal users, `name` (company name) is mandatory.
  - User type is read-only after registration and cannot be modified.
  - Verification objects (`Verification`) contain read-only `user_type: "natural" | "legal"` provided by the API and mock simulator.
  - KYC validation rules:
    - **Natural (`natural`):** `full_name` required, `national_id` exactly 10 digits required, `company_name` must be omitted/empty.
    - **Legal (`legal`):** `company_name` required, `national_id` exactly 11 digits required (company national ID), `full_name` required (legal representative / authorized signatory).
- **Mock Simulator Seed Users & KYC Queue:**
  - Seed users and profiles explicitly include both Natural and Legal entities: `holderkyc1` (natural pending KYC), `holderkyclegal1` (legal pending KYC), `holderlegal1` (approved legal issuer), alongside existing `holder1`, `investor1`, `moderator1`, `admin1`.
  - `seedVerifications` in `useBackendSimulatorStore` contains a pending pair: one pending natural (10-digit ID, empty company name) and one pending legal (11-digit ID, company name set, representative name).
  - KYC Queue UI (`/moderation/kyc`) displays explicit `user_type` badges (شخص حقیقی / شخصیت حقوقی) and formats details accordingly.
- **Live KYC & Verification Flow:** Integrated directly into routed profile `/me` (`POST /verifications/` and `GET /verifications/me/`). Moderation evaluation (`/moderation/kyc/:id`) submits decisions via `POST /moderation/kyc/:id/decision/`.
- **Live Document Uploads:** `listingsApi.uploadDocument` accepts binary `File`/`Blob` inputs and appends file bytes to `FormData` (`POST /listings/:id/documents/`).
- **Supported Admin Surfaces:** Admin capabilities focus on `/admin/stats` (compliance stats), `/admin/feature-flags` (feature flag controls), and `/admin/audit` (audit event logs). Unbacked `/admin/reports` redirects to `/admin/stats`.
- **Feature Flag Gating (`show_risk_tier`):** Public display of listing `risk_tier` badges and search filters across marketplace cards, listing detail pages, and widgets is conditionally gated behind the `show_risk_tier` feature flag via `useFeatureFlags` composable. In the mock simulator (`useBackendSimulatorStore`), missing seed flags (including `show_risk_tier`) are merged from seed definitions into stale `localStorage` and persisted without resetting user data. Toggling or updating a flag triggers `useFeatureFlags().fetchFlags(true)` so the cache refreshes immediately across all views without requiring a page reload. Moderators always have access to `risk_tier` controls regardless of the flag state.
- **Moderation Decision Contract:** Approving a listing (`POST /api/v1/moderation/{id}/decision/`) allows moderators to set an optional `risk_tier` (`'low' | 'medium' | 'high'`). Rejections omit `risk_tier`.
- **Authenticated Shell & Responsive Sidebar Navigation (`AppHeader`, `AppSidebar`):**
  - **Desktop Navigation (≥ 768px / `md`):** The sidebar (`AppSidebar.vue`, `data-testid="app-sidebar"`) supports two distinct states: **expanded** (`w-64`, displaying brand metadata, full navigation labels with categorized group headers, and user role footer) and **compact icon rail** (`w-[72px]`, displaying centered brand mark «چک», Naive UI `NMenu` in `collapsed` mode with icon tooltips, and a single-letter role mark `چ`/`س`/`ن`/`م` with full role name in `title` tooltip).
  - **Menu Option Flattening (`flattenMenuGroups`):** In collapsed icon-rail mode, menu options are passed through the pure immutable utility `src/shared/utils/menuOptions.ts` (`flattenMenuGroups`) to unwrap `type: 'group'` containers into a flat list of child items. This prevents Naive UI from rendering wrapped multi-line group titles in the 72px rail while preserving the full grouped navigation in expanded desktop and mobile drawer modes.
  - **Header Toggle Control (`AppHeader.vue`, `data-testid="app-sidebar-toggle"`):** A universal menu action button that dispatches responsively based on viewport width:
    - Desktop (`≥ md`): Toggles `isSidebarCollapsed` with dynamic Persian `aria-label` (*"گسترش منو"* / *"جمع کردن منو"*).
    - Mobile (`< md`): Toggles `isMobileMenuOpen` drawer with `aria-label` (*"باز کردن منو"* / *"بستن منو"*).
  - **State Persistence & Decoupling (`useUiStore`):** The collapsed sidebar state is managed via Pinia `useUiStore` and persisted across sessions in `localStorage` under `chequeyar_sidebar_collapsed` (defaulting to `false` / expanded). The mobile drawer state `isMobileMenuOpen` is strictly decoupled from the desktop collapsed flag.
  - **Resize Safety Guard:** On crossing into the desktop viewport threshold (`≥ 768px`), `AppSidebar` automatically invokes `closeMobileMenu()`, preventing lingering backdrop masks or stuck drawer overlays.
- **Public Chrome & Landing Module (`src/features/landing/`):**
  - Routes tagged with `meta: { publicChrome: true }` (such as `/landing`) render in a standalone public layout without the internal `AppSidebar` or `AppHeader`.
  - The landing page forces the `dark` brand theme styling (`data-theme="dark"` and `darkTheme` + `getThemeOverrides('dark')` for Naive UI) without altering the user's saved theme preference in `localStorage`.
  - Content Single Source of Truth (SSOT) is maintained in `src/features/landing/content/landingContent.ts` with strict ZWNJ (`\u200c`) character discipline and centralized visual metadata (`landingContent.visual`) for section eyebrows and captions.
  - Reusable layout and presentation primitives under `src/features/landing/components/`:
    - `LandingSectionShell.vue`: Provides unified vertical rhythm, container constraints, eyebrow pills, section titles/subtitles, background variants (`default`, `muted`, `elevated`), and integrated background decor support via `LandingDecorLayer` (supporting pattern, overlay, intensity, positions, and vector overlays).
    - `LandingDecorLayer.vue`: Renders controlled geometric patterns (dots, grid, stripes using neutral slate tinting, and elliptical emerald mesh gradients) and inline SVG vectors with strict opacity constraints (<=0.35), stacked pattern overlays (`overlay`), and `pointer-events-none aria-hidden="true"`.
    - `LandingSurfaceCard.vue`: Standardized card surface token supporting glass aesthetics (`landing-glass-card` via `color-mix`), RTL-friendly pseudo-element gradient borders (`landing-gradient-border`), highlight borders, full-width top accent bars (`accentTop`), and elevation hover states.
    - `LandingIconBadge.vue`: Uniform icon/number badge primitive for steps, lists, and status indicators.
    - `LandingTrustStrip.vue` (`#landing-trust-strip`): Scannable trust strip mounted between Hero and Problem/Solution with high-contrast text (`--theme-text-primary`), highlighting 4 regulatory pillars (no fund handling, no custody, no collection guarantee, advisory rate) with quick jump to `#responsibility-boundary`.
    - `LandingHeroListingsPreview.vue`: Live data preview within Hero powered by `useLandingLatestListings` displaying real published listings with masked issuer names (`maskDisplayName`), externalized hero strings in `landingContent.hero`, and instant scroll to `#live-listings`.
    - `landingDecor.css` & `landingVectors.ts`: Centralized CSS variables/utilities for glass surfaces (`landing-glass-card`), neutral pattern backgrounds, RTL gradient borders (`landing-gradient-border`, `landing-gradient-border-hover`), and reusable SVG vector path geometries.
  - Section components under `src/features/landing/sections/` compose the 12 sections:
    - **Hero Section (`HeroSection.vue`, `#hero`):** Two-column responsive layout with 48×48 brand mark («چک»), RTL accent bar, pilot badge, and the real listings live preview (`LandingHeroListingsPreview.vue`).
    - **Structured Content Sections:** `ProblemSolutionSection.vue` (`#problem-and-solution`) with static transition flow vectors, `HowItWorksSection.vue` (`#how-it-works`) with responsive horizontal timeline (`lg+`) / vertical mobile spine and step 6 direct settlement emphasis, `AudiencesSection.vue` (`#audiences`), `LiveListingsSection.vue` (`#live-listings`), `ResponsibilityBoundarySection.vue` (`#responsibility-boundary`), `ProductStatusSection.vue` (`#product-status`), `PricingSection.vue` (`#pricing`), `FaqSection.vue` (`#faq`), `ContactSection.vue` (`#contact-us`), `LeadCaptureSection.vue` (`#lead-capture-form`), and `InvestingSection.vue` (`#investing-in-cheque-yar`).
    - **Live Listings Section (`#live-listings`):** Consumes `useLandingLatestListings()` (backed by `marketplaceApi.getLatestListings()`) to display up to 4 published listings. Renders 4 states (loading skeleton, cards grid, empty state with guest/auth CTA, error state with retry button). Listing cards display toman amounts, Jalali dates, bank names, remaining days to due date, status chips (`LISTING_STATUS_LABELS`), masked issuer names (`maskDisplayName`), and conditional risk tier badges (`show_risk_tier` feature flag). Guest activations navigate directly to `/login` without authenticated detail requests; authenticated users navigate to `/listings/:id`.
    - **Interactive Forms (`#contact-us`, `#lead-capture-form`):** Pure UI components featuring client-side validation (`validateContactForm`, `validateLeadForm`, and `isValidIranianMobile`). Valid submissions display success feedback via `message.success` and reset the form state with zero network requests (`axios`, `api.post`, or `fetch`).
  - Anchor links (`#how-it-works`, `#live-listings`, `#faq`, `#contact-us`) and responsive header action buttons support both guests (`landing-nav-login`, `landing-nav-register`, `landing-nav-login-mobile`, `landing-nav-register-mobile`) and authenticated users (`landing-nav-marketplace`, `landing-nav-marketplace-mobile`).
- **Fail-Closed Landing Gate (`show_landing_page`):**
  - Gated by the `show_landing_page` feature flag via an asynchronous per-route navigation guard (`beforeEnter`) on `/` and `/landing` that invokes the pure helper `getLandingRedirect(flagEnabled, targetPath)`.
  - When enabled (`true`), `/` redirects to `/landing`, while authenticated and guest users can freely access `/landing`.
  - When disabled (`false`), absent from flags, or when the flags request fails (fail-closed), `/` and `/landing` both redirect cleanly to `/marketplace` (which subsequently routes guests to `/login`), with zero redirect loops.
- **Mock Sign-Out Marker (`chequeyar_mock_signed_out`):**
  - In mock mode (`VITE_USE_MOCK=true`), an explicit `logout()` records `chequeyar_mock_signed_out = 'true'` in `localStorage`.
  - Subsequent page reloads respect this marker and skip the automatic demo seed user (`holder1`), enabling realistic testing of guest interactions and landing navigation in mock mode.
  - A successful `login()` or `register()` clears the marker. Live mode (`VITE_USE_MOCK=false`) ignores the marker and never auto-seeds users.
- **Sayad Inquiry Status:** Sayad inquiries in the UI are clearly labeled as advisory/stub inquiries (not direct bank inquiries).
- **Client-Side Test Role Selector:** When `VITE_USE_MOCK=true`, the header UI includes a **Test Role** ("نقش تست") switcher. Note that this switcher only modifies client-side simulation role context; in Live API mode, actual permissions are governed strictly by backend-issued JWT tokens.

### GitHub Codespaces (Mock-Only Preview)

- **One-Click Mock Preview:** Opening a GitHub Codespace from this repository automatically installs Bun, writes a local `.env` with `VITE_USE_MOCK=true`, and launches the Vite dev server on port 3000.
- **Non-Production Environment:** Codespace previews run purely in client-side mock mode without connecting to a live backend or database.
- **Lifecycle & URLs:** When a Codespace stops due to inactivity, the forwarded preview URL stops serving. Creating a new Codespace generates a new URL.
- **For Live API Testing:** To test against a real backend, clone locally alongside the `doion` server with `VITE_USE_MOCK=false`.

### Hosted Mock Demo (Chabokan Static)

- **Hosted Mock Demo:** Deployed as a Chabokan Static PaaS service (`chequeyar-front-demo`) at [https://chequeyar-front-demo.chbkn.dev/](https://chequeyar-front-demo.chbkn.dev/).
- **Automated Workflow:** Built in GitHub Actions via `.github/workflows/cd-demo.yml` with `VITE_USE_MOCK=true` (compile-time gate).
- **CI Live Verification & E2E Dispatch:** In addition to mock demo builds, CI on `main` and `product` (`.github/workflows/ci.yml`) compiles a non-mock production bundle against `https://chequeyar-back.chbkn.dev/api/v1` (`VITE_USE_MOCK=false`) and builds the production Docker container image on every push and pull request. Upon successful CI on push to `main`, `.github/workflows/dispatch-doion-e2e.yml` notifies `alamalhoda/doion` to run Playwright E2E against that verified UI commit SHA.
- **Production SPA Service (`chequeyar-front`):** The live production SPA service (`chequeyar-front`) is updated only by owner-triggered CD (`cd-product.yml`) from `product`, not from raw `main`.
- **Web Server Configuration:** Configured via root `nginx.conf` with document root at `/usr/share/nginx/html/dist` (the compiled SPA bundle) and `try_files $uri $uri/ /index.html` for Vue Router HTML5 history mode support.
- **Environment & State:** No live backend or database connection is used. Simulator state is persisted per-browser in `localStorage`, not in a shared server database.
- **Scope:** This demo environment is strictly for UI inspection and stakeholder demonstrations. It is **NOT** production and **NOT** Live staging. Codespaces mock preview remains available as a secondary local/cloud preview.

### Production Docker Image & Compose Packaging

- **Multi-Stage Container (`Dockerfile`):**
  - **Stage 1 (Builder):** Uses `oven/bun:1-alpine`, copies `bun.lock` and `package.json`, runs `bun install --frozen-lockfile`, accepts build args `VITE_USE_MOCK` (default `false`) and `VITE_API_BASE_URL` (default `https://chequeyar-back.chbkn.dev/api/v1`), and compiles the production bundle via `bun run build`.
  - **Stage 2 (Runner):** Uses lightweight `nginx:alpine`, copies `nginx.conf` to `/etc/nginx/conf.d/default.conf`, copies `/app/dist` to `/usr/share/nginx/html/dist`, and serves traffic on port 80 with SPA fallback routing.
- **Local Smoke Testing (`docker-compose.yml`):**
  - Provides a local containerized service targeting `http://localhost:8000/api/v1` with port 8080 mapped to container port 80.
  - Daily developer iteration remains host-based (`bun run dev`). Docker packaging serves for staging verification, containerized deployments, and CI smoke testing.

---

## 5. Architectural Boundaries

- **Backend & API Contract:** The backend architecture, database schema, and Django REST Framework endpoints are maintained in the [alamalhoda/doion](https://github.com/alamalhoda/doion) monorepo.
- **Contract Reference:** The official API specification is defined in [MASTER_API_CONTRACT.md](https://github.com/alamalhoda/doion/blob/develop/docs/development/MASTER_API_CONTRACT.md) within the `doion` repository (`docs/development/MASTER_API_CONTRACT.md`).
- **Frontend Development Status:** See [FRONTEND_DEVELOPMENT_STATUS.md](https://github.com/alamalhoda/doion/blob/develop/docs/development/FRONTEND_DEVELOPMENT_STATUS.md) for current integration progress.
- Do NOT replicate or modify backend contracts within this UI repository.

---

## 6. Package Management

- **Bun** is the designated package manager.
- Always use `bun install` for installing dependencies.
- `bun.lock` is tracked in Git. `package-lock.json` is explicitly ignored in `.gitignore` and must never be committed.

---

## 7. Offline / No CDN Runtime Assets

To ensure full compatibility with Iranian hosting under national internet restrictions (intranet):
- **Font Assets:** Vazirmatn font files (weights 300, 400, 500, 600, 700, 800) are vendored directly under `public/fonts/vazirmatn/` and tracked in Git. `@font-face` rules with `font-display: swap` are loaded locally via CSS. All external Google Fonts (`fonts.googleapis.com` / `fonts.gstatic.com`) links have been removed.
- **Icon Assets:** Icons are provided by `@vicons/ionicons5` and `@vicons/utils` as Vue SVG components bundled directly by Vite into same-origin JavaScript chunks. No external icon webfont CDNs are used.
- **Local Fallback Images:** Demo cheque previews and document placehold/fallback images are served locally from `public/images/placeholders/` (`/images/placeholders/*.svg`). External placeholder services (`placehold.co`, `via.placeholder.com`, `unsplash.com`) are strictly avoided at runtime.
- **API Reference:** All backend APIs are served by the `doion` Django server (`http://localhost:8000/api/v1`).

---

## 8. Dynamic Theming Architecture

The application supports six distinct themes: `dark` (default), `light`, `warm`, `navy`, `violet`, and `emerald`.

### Single Source of Truth (SSOT)
- **CSS Theme Tokens:** Defined in `src/index.css` under `:root` and `[data-theme="..."]` attributes. Semantic CSS variables provide cohesive styling across light, dark, and specialized palettes:
  - Background & Surface: `--theme-bg`, `--theme-surface`, `--theme-surface-muted`, `--theme-input`
  - Borders: `--theme-border`, `--theme-border-subtle`
  - Typography: `--theme-text-primary`, `--theme-text-on-surface`, `--theme-text-secondary`, `--theme-text-muted`
  - Brand & Accents: `--theme-primary`, `--theme-primary-hover`, `--theme-primary-pressed`, `--theme-primary-soft`, `--theme-selection-bg`, `--theme-selection-text`
  - Radii & Controls: `--radius-control` (8px), `--radius-card` (16px)
  - Scrollbars: `--theme-scrollbar-track`, `--theme-scrollbar-thumb`, `--theme-scrollbar-thumb-hover`
- **Naive UI vs CSS Variables Relationship:**
  - Naive UI components rely directly on hex values provided by `src/utils/themeOverrides.ts` (injected via `<NConfigProvider :theme="naiveTheme" :theme-overrides="naiveThemeOverrides">` in `src/App.vue`).
  - Custom Vue templates, inline styles (such as `NDrawerContent`), and Tailwind utilities consume the CSS custom properties defined in `src/index.css`.
  - Both sources must remain synchronized across all 6 palettes.
- **Tailwind v4 Integration:** Tailwind utility classes map semantic colors to CSS variables (`--color-slate-900: var(--theme-bg)`, `--color-slate-800: var(--theme-surface)`, etc.).
- **Discrete API Adaptation:** For notifications, dialogs, and messages initialized outside Vue render trees, `src/utils/discreteApi.ts` provides a reactive wrapper that resolves current theme overrides on demand.
- **ApexCharts Theming:** Managed via `src/features/reports/utils/chartTheming.ts` (`getApexChartThemeConfig`), ensuring chart palettes, grid borders, tooltips, and labels adjust responsively according to the active theme.

---

## 9. Bank Catalog, API Facade & Simulator Integration

- **Local Bank Catalog (`src/shared/banks/`):** Acts as the frontend Single Source of Truth (SSOT) for 14 standardized Iranian banks (`LOCAL_BANKS` in `src/shared/banks/catalog.ts`), matching backend codes and providing lookup helpers (`findBankByCode`, `findBankByNameOrAlias`, `toBankSummary`, `getBankBrandColor` in `src/shared/banks/lookup.ts`).
- **Reactive Catalog Composable (`useBanksCatalog` in `src/shared/banks/useBanksCatalog.ts`):** Returns `{ banks, loading, error, fetchBanks }` to fetch the bank list asynchronously from `GET /api/v1/banks/` while defaulting to `LOCAL_BANKS` as an instantaneous synchronous fallback.
- **API Facade & Payloads (`src/api/`):**
  - `banksApi.list()` calls `GET /api/v1/banks/` (or `store.listBanks()` in mock mode).
  - `listingsApi.createListing` and `listingsApi.updateListing` accept `bank` (code string) and strip `bank_name` from outgoing HTTP payloads.
  - Listing DTOs (`ChequeListing`, `MarketplaceListing`, `ListingSummary`, `ModerationQueueItem`) include `bank: BankSummary | null` alongside legacy `bank_name`.
- **Backend Simulator Hydration (`src/stores/useBackendSimulatorStore.ts`):**
  - Intercepts `/banks` in `client.ts` to return mock bank list.
  - Auto-hydrates any listings or matches lacking a `bank` field on `init()` via `findBankByNameOrAlias`.
  - Enforces valid bank code verification upon `createListing` and `updateListing`.
  - Filters marketplace listings with precedence for `filters.bank` (exact code) over `filters.bank_name` (partial name/alias).
- **Reusable Bank Badge (`src/shared/components/BankBadge.vue`):** Visual badge supporting catalog banks (logo image or initial letter over theme-aware brand color surface), compact/default sizes, dark/light themes, and unknown bank fallbacks with initial and building icon.
- **Reusable Bank Select (`src/shared/components/BankSelect.vue`):** Standard selection component backed by `useBanksCatalog` that resolves to catalog codes (e.g. `mellat`), supports an optional `allow-all` filter option (rendering Persian text «همه بانک‌ها» with `BusinessOutline` building icon and no catalog brand color), and carries standard `data-testid` attributes (`bank-select`, `listing-form-bank`, `marketplace-bank-filter`, `account-payout-bank`).
- **Listing Form Strict Validation (`useListingForm.ts`):** `isValidStep1` and `publishListing` enforce that the selected bank matches a valid catalog code or known alias via `findBankByCode` / `findBankByNameOrAlias`. Unmatched inputs display Persian feedback and abort without calling `listingsApi.createListing`.
- **Wired Surfaces:**
  - **Marketplace & Filters:** `MarketplaceView.vue` and `ListingCard.vue` render `BankBadge` and filter via `filters.bank` with `BankSelect` (`data-testid="marketplace-bank-filter"`). `loadListings` sends `bank` code only and explicitly removes `bank_name` from outgoing requests.
  - **Listing Lifecycle:** `ListingCreateWizard.vue`, `ListingEdit.vue`, `ListingDetailView.vue`, `MyListingsView.vue`, and `SmartPricingCalculator.vue` use `BankSelect` (`data-testid="listing-form-bank"`) for bank selection and `BankBadge` for display.
  - **Matches & Settlements:** `ExpressInterestView.vue`, `TradeDetails.vue`, and `MyMatchesView.vue` render `BankBadge` for listing and match bank summaries.
  - **Moderation:** `ModerationQueueView.vue`, `ModerationQueue.vue`, and `ModerationReview.vue` (both simple and advanced inspection modes) render `BankBadge`.
  - **Reports & Public Landing:** `GlobalFiltersPanel.vue` (reports filter), `UserReportsDashboard.vue` (due dates table), `LandingListingCard.vue` (landing live listings), and `LandingHeroListingsPreview.vue` (landing hero preview cards) render `BankBadge` and utilize `BankSelect`.
  - **My Account Payout Bank:** `MyAccountView.vue` features a dedicated payout bank card («تنظیمات حساب بانکی و واریز») with `BankSelect` (`data-testid="account-payout-bank"`, `allow-all=false`) and an optional IBAN field. In **Mock Mode**, the selection is persisted in the simulator store via `getPayoutBankCode(userId)` / `setPayoutBankCode(userId, code)` and saved in `chequeyar_simulator_v1` (with `pasargad` seeded for user 1). In **Live Mode**, the selection remains strictly component/session-local and does NOT PATCH the Django `/users/me/` profile endpoint.

