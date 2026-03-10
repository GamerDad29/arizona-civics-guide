# Changelog

## 2026-03-09 — WPA Visual Overhaul (Phase 3)

### Added
- Complete WPA 1930s Travel Poster design system (colors, typography, textures)
- 9-page multi-route architecture via wouter
- Bento grid homepage with zone-colored tiles and hover overlays
- Sticky navbar with mobile hamburger menu
- Cloudflare Worker API with 9 endpoints (`worker/index.ts`)
- Cloudflare D1 database with 8 tables, seeded with Mesa/AZ civic data
- `src/lib/api.ts` — typed API client for all Worker endpoints
- `src/hooks/useApi.ts` — generic data-fetching hook
- `src/components/BentoTile.tsx` — homepage tile component
- `src/components/Navbar.tsx` — top navigation bar
- `src/components/Layout.tsx` — page wrapper with footer
- `public/_redirects` — SPA routing fallback for Cloudflare Pages
- Google Civic API proxy with D1 caching (24h TTL)
- Congress.gov API proxy (119th Congress, AZ delegation)
- Full-text search endpoint across reps, bills, and issues

### Removed
- All old Phase 2 files: `src/views/`, `src/sections/`, `src/services/`, `src/data/`, `src/types/`
- Old components: Sidebar, Nav, OfficialCard, OfficialProfile, AddressInput, PartyBadge, SectionCard, StatusChip, VoteBadge
- `src/hooks/useCivicData.ts` (replaced by `useApi` + Worker proxy)
- All hardcoded data files (replaced by D1 database)

### Fixed
- CORS: Set `ALLOWED_ORIGIN=*` — browser fetches were blocked because the secret didn't match the Pages origin
- Congress API: Changed from query param `?stateCode=AZ` to path `/v3/member/congress/119/AZ` (API ignores query param)
- Unused imports causing TypeScript build failures (`FileText` in BillsPage, `Calendar` in RepDetailPage)

---

## 2026-03-09 — Cloudflare Worker + D1 Backend

### Added
- `worker/index.ts` — full API server
- `worker/wrangler.json` — Worker config with D1 binding
- D1 database `arizona-civics` with schema and seed data
- Worker secrets: `ALLOWED_ORIGIN`, `GOOGLE_CIVIC_API_KEY`, `CONGRESS_API_KEY`

---

## 2026-03-09 — Phase 2: Dark Sidebar Layout (superseded)

### Added
- Sidebar + panel architecture with dark theme
- Per-level views (Local, State, Federal)
- Official profile pages with voting records
- Bills, Budget, Elections, Issues, District Finder sections

### Fixed
- Sidebar layout bug: duplicate positioning between App.tsx and Sidebar.tsx

---

## 2026-02-10 — Phase 1: Initial Setup

### Added
- Vite + React + TypeScript project scaffold
- Basic Tailwind CSS config
- Initial data files with Mesa, AZ civic data
