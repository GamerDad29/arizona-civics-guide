# Architecture Decisions

## 2026-03-09 — All-Cloudflare Backend

**Decision:** Use Cloudflare D1 + Workers instead of Google Cloud Run + PostgreSQL.

**Context:** Original spec called for Supabase or Cloud Run. GCP had no MCP or CLI available in the dev environment. Cloudflare MCP was available with D1, Workers, KV, R2, and Pages tools.

**Rationale:** Single platform (Cloudflare) for hosting, API, and database. D1 is SQLite at edge — zero cold starts, no connection pooling, free tier generous. Worker deploys in seconds. Pages already hosted there.

**Trade-offs:** D1 is SQLite (no joins across databases, no stored procedures, 10MB max DB size on free tier). Sufficient for this read-heavy civic data use case.

---

## 2026-03-09 — WPA Poster Aesthetic Over Dark Sidebar

**Decision:** Full visual overhaul to 1930s WPA Travel Poster aesthetic, replacing the Phase 2 dark sidebar layout.

**Context:** User provided a design spec (`arizona-civics-spec.docx`) describing a WPA National Park poster style with bento grid homepage, multi-page routing, and earthy color palette.

**Rationale:** The spec's visual identity (paper grain textures, serif display fonts, zone-colored tiles) is distinctive and memorable. Avoids generic "AI dashboard" look.

---

## 2026-03-09 — wouter Over React Router

**Decision:** Use wouter for client-side routing instead of React Router.

**Rationale:** Lightweight (~2KB vs ~30KB), simple API, sufficient for 9 static routes + one dynamic route (`/representatives/:id`). No need for loaders, actions, or nested layouts that React Router v6+ provides.

---

## 2026-03-09 — Vite + React Over Next.js

**Decision:** Keep Vite + React SPA instead of migrating to Next.js (as spec suggested).

**Context:** Spec recommended Next.js, but Cloudflare Pages has friction with Next.js (requires `@cloudflare/next-on-pages` adapter, limited SSR support). Vite SPA deploys as static files with zero config.

**Rationale:** Simpler deployment, faster builds, no SSR complexity. All data comes from the Worker API anyway — no benefit to server-side rendering for this app.

---

## 2026-03-09 — No Static Data Files

**Decision:** Remove all `src/data/*.ts` files. All data fetched from Worker API backed by D1.

**Context:** Phase 1 and Phase 2 used hardcoded TypeScript data files for representatives, elections, bills, budget, and issues. Phase 3 (WPA overhaul) moved everything to D1.

**Rationale:** Single source of truth. Data can be updated via D1 queries without redeploying the frontend. Enables future admin UI or CMS integration.

---

## 2026-03-09 — Congress.gov Path-Based State Filter

**Decision:** Use `/v3/member/congress/119/AZ` instead of `?stateCode=AZ` query parameter.

**Context:** The query parameter approach returned ALL members across all states. The Congress.gov API v3 ignores `stateCode` as a query param for the members endpoint.

**Rationale:** Path-based filter is the correct API usage per Congress.gov docs. Returns only Arizona's 119th Congress delegation.

---

## 2026-03-09 — CORS: ALLOWED_ORIGIN = *

**Decision:** Set Worker's `ALLOWED_ORIGIN` secret to `*` (wildcard).

**Context:** The original value didn't match the actual `pages.dev` origin, causing all browser fetches to fail with CORS errors.

**Rationale:** The API is public, read-only, and has no authentication. There is no security benefit to restricting origins. Wildcard eliminates deployment-URL mismatch issues (preview deployments get random subdomains).
