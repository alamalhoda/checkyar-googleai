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
- **Live KYC & Verification Flow:** Integrated directly into routed profile `/me` (`POST /verifications/` and `GET /verifications/me/`). Moderation evaluation (`/moderation/kyc/:id`) submits decisions via `POST /moderation/kyc/:id/decision/`.
- **Live Document Uploads:** `listingsApi.uploadDocument` accepts binary `File`/`Blob` inputs and appends file bytes to `FormData` (`POST /listings/:id/documents/`).
- **Supported Admin Surfaces:** Admin capabilities focus on `/admin/stats` (compliance stats), `/admin/feature-flags` (feature flag controls), and `/admin/audit` (audit event logs). Unbacked `/admin/reports` redirects to `/admin/stats`.
- **Sayad Inquiry Status:** Sayad inquiries in the UI are clearly labeled as advisory/stub inquiries (not direct bank inquiries).
- **Client-Side Test Role Selector:** When `VITE_USE_MOCK=true`, the header UI includes a **Test Role** ("نقش تست") switcher. Note that this switcher only modifies client-side simulation role context; in Live API mode, actual permissions are governed strictly by backend-issued JWT tokens.

### GitHub Codespaces (Mock-Only Preview)

- **One-Click Mock Preview:** Opening a GitHub Codespace from this repository automatically installs Bun, writes a local `.env` with `VITE_USE_MOCK=true`, and launches the Vite dev server on port 3000.
- **Non-Production Environment:** Codespace previews run purely in client-side mock mode without connecting to a live backend or database.
- **Lifecycle & URLs:** When a Codespace stops due to inactivity, the forwarded preview URL stops serving. Creating a new Codespace generates a new URL.
- **For Live API Testing:** To test against a real backend, clone locally alongside the `doion` server with `VITE_USE_MOCK=false`.

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
