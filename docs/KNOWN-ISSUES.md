# Known Issues

**Last updated:** 2026-03-09

## Active

### Google Civic API Not Enabled
**Severity:** Medium
**Impact:** `/api/civic?address=` returns "Method not found". Address-based district lookup doesn't work.
**Fix:** Enable "Google Civic Information API" in GCP Console. The API key is already configured as a Worker secret.

### No Official Photos
**Severity:** Low (cosmetic)
**Impact:** All representative cards show initials avatars instead of photos. The `photo_url` field exists in D1 but is null for all records.
**Fix:** Add photo URLs to D1, or use Google Civic API (returns `photoUrl` for elected officials when available).

### Bundle Size Warning
**Severity:** Low
**Impact:** JS bundle is 712KB (Vite warns at 500KB). Recharts (~400KB) and Framer Motion (~150KB) are the main contributors. Does not affect functionality.
**Fix:** Add `manualChunks` in vite.config.ts to code-split heavy dependencies.

### Sparse Representative Data
**Severity:** Low
**Impact:** Many representatives (especially local school board, some state officials) have minimal data — no bio, no voting records, no priorities.
**Fix:** Manual data enrichment via D1 queries.

### Scott Somers Contact Info Placeholder
**Severity:** Low
**Impact:** Some phone numbers in D1 use placeholder format (`(602) XXX-XXXX`). Visible on the Ruben Gallego record.
**Fix:** Update D1 records with real phone numbers when published.

## Resolved

### CORS Blocking All API Requests (2026-03-09)
**Cause:** `ALLOWED_ORIGIN` Worker secret was set to a value that didn't match the `pages.dev` origin. The `cors()` function returned an empty `Access-Control-Allow-Origin` header.
**Fix:** Set `ALLOWED_ORIGIN=*` via `wrangler secret put`.

### Congress API Returning All States (2026-03-09)
**Cause:** Used query parameter `?stateCode=AZ` which Congress.gov API v3 ignores.
**Fix:** Changed to path-based filter: `/v3/member/congress/119/AZ`.

### Sidebar Layout Bug — 1/9th of Page (2026-03-09, Phase 2)
**Cause:** Duplicate positioning logic in both App.tsx wrapper and Sidebar.tsx component.
**Fix:** Removed inline positioning from Sidebar.tsx, made App.tsx wrapper the single source of truth. (Superseded by WPA overhaul which removed the sidebar entirely.)
