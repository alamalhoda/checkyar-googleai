# Architecture Overview (Cheque Yar UI)

This document serves as the Single Source of Truth (SSOT) for the **Cheque Yar (چک‌یار)** frontend architecture.

---

## 1. Purpose & Development Workflow

This repository (`alamalhoda/checkyar-googleai`) houses the active web frontend for the Cheque Yar platform.

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
│   ├── listings/            # Cheque listing creation wizard, edit, detail, and my-listings
│   ├── marketplace/         # Public marketplace and search filters
│   ├── matches/             # Express interest, match proposals, and settlement tracking
│   ├── moderation/          # Moderation queue, review views, and KYC verification queue
│   ├── notifications/       # User notification center and preference settings
│   └── profile/             # User profile and account management
├── router/                  # Vue Router definitions and navigation guard logic
├── shared/                  # Shared/reusable UI components (AppHeader, AppSidebar, ConfirmDialog)
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
- **Web Server Configuration:** Configured via root `nginx.conf` with document root at `/app/dist` (the compiled SPA bundle) and `try_files $uri $uri/ /index.html =404` for Vue Router HTML5 history mode support.
- **Environment & State:** No live backend or database connection is used. Simulator state is persisted per-browser in `localStorage`, not in a shared server database.
- **Scope:** This demo environment is strictly for UI inspection and stakeholder demonstrations. It is **NOT** production and **NOT** Live staging. Codespaces mock preview remains available as a secondary local/cloud preview.

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
- **CSS Theme Tokens:** Defined in `src/index.css` under `:root` and `[data-theme="..."]` attributes. CSS variables (e.g., `--theme-bg`, `--theme-surface`, `--theme-card`, `--theme-text-primary`, `--theme-border`) provide cohesive styling across light, dark, and specialized palettes.
- **Tailwind v4 Integration:** Tailwind utility classes seamlessly map semantic colors to CSS variables (`--color-slate-900: var(--theme-bg)`, `--color-slate-800: var(--theme-surface)`, etc.).
- **Naive UI Dynamic Overrides:** Managed via `src/utils/themeOverrides.ts` and injected dynamically into `<NConfigProvider :theme="naiveTheme" :theme-overrides="naiveThemeOverrides">` in `src/App.vue`.
- **Discrete API Adaptation:** For notifications, dialogs, and messages initialized outside Vue render trees, `src/utils/discreteApi.ts` provides a reactive wrapper that resolves current theme overrides on demand.
- **ApexCharts Theming:** Managed via `src/features/reports/utils/chartTheming.ts` (`getApexChartThemeConfig`), ensuring chart palettes, grid borders, tooltips, and labels adjust responsively according to the active theme.

