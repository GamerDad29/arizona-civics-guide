# Arizona Civics Guide — Backlog

**Project:** Mesa, AZ civic intelligence app
**Stack:** Vite + React 18 + TypeScript + Tailwind CSS v3 + Framer Motion + Recharts + Wouter
**Live:** https://arizona-civics-guide.pages.dev
**Repo:** https://github.com/GamerDad29/arizona-civics-guide
**Last updated:** 2026-03-09

---

## P0 — Bugs (break the experience)

### Layout / Rendering
- [ ] **Main panel left-margin offset on desktop** — sidebar is `fixed lg:static` but on desktop the main panel may still sit flush-left without the 240px sidebar visible depending on Tailwind's `lg` breakpoint resolution. Verify on 1024px+ screen.
- [ ] **Sidebar not visible on first load (desktop)** — the `translate-x-0` class via Tailwind may not override if the `lg:` breakpoint isn't resolving correctly in the deployed build. Smoke test live URL on desktop.
- [ ] **`OfficialProfile` `onBack` always navigates to `'local'`** — should return the user to whichever view they came from (`local`, `state`, or `federal`). Track `previousView` in App state and pass it to `OfficialProfile`.

### Code Bugs
- [ ] **Double-nested `level-badge` span in `ElectionsView`** — `races2026` race ratings wrap `level-badge` inside another `level-badge` span (`ElectionsView.tsx:88-90`). The outer span has a literal string `"level-{r.type}"` instead of a dynamic class. Remove outer span, keep inner.
- [ ] **`buildStaticOfficials` unused import in `LocalView.tsx`** — still imported, used only for school board lookup. If school board officials aren't in the static officials list under expected IDs, the board section renders empty. Verify IDs: `tavolacci`, `thomason`, `ketchmark`, `perry`, `williams` exist in `src/data/officials.ts`.

---

## P1 — High Priority Features

### API Integration (no live data without this)
- [ ] **Add `.env.local` with API key placeholders** — create `.env.local.example`:
  ```
  VITE_GOOGLE_CIVIC_API_KEY=your_key_here
  VITE_CONGRESS_API_KEY=your_key_here
  ```
- [ ] **Set Cloudflare Pages environment variables** — in CF dashboard → arizona-civics-guide → Settings → Environment variables, add `VITE_GOOGLE_CIVIC_API_KEY` and `VITE_CONGRESS_API_KEY` for Production. Without these the app runs entirely on static data.
- [ ] **Get Google Civic Information API key** — https://console.cloud.google.com → Enable "Google Civic Information API" → Create credentials → API Key.
- [ ] **Get Congress.gov API key** — https://api.congress.gov/sign-up/ (free, instant).
- [ ] **Test `submitAddress()` flow end-to-end** — enter a Mesa, AZ address → verify `useCivicData` hook merges Google Civic API response with static data → confirm officials appear in sidebar mini-rows with photos.

### CI/CD
- [ ] **Connect GitHub to Cloudflare Pages** — currently deployments are manual (`wrangler pages deploy`). In CF dashboard → arizona-civics-guide → Settings → Git integration → connect `GamerDad29/arizona-civics-guide`, branch `main`, build command `npm run build`, output dir `dist`. After this every push auto-deploys.

---

## P2 — Polish & UX

### Navigation
- [ ] **Track previous view for back navigation** — add `previousView: NavView` to App state. Set it before navigating to `'official-profile'`. Pass to `OfficialProfile` and use in `onBack`. This prevents always returning to Local.
- [ ] **Active view highlight in sidebar for official-profile** — when viewing a profile, the sidebar should keep the originating section (Local/State/Federal) highlighted, not go dark.

### Mobile
- [ ] **Mobile smoke test** — verify hamburger button works, overlay closes sidebar, content scrolls properly, touch targets are ≥44px. Test at 375px (iPhone SE) and 390px (iPhone 15).
- [ ] **Sidebar backdrop blur on mobile** — the overlay div uses `bg-black/60`. Could add `backdrop-blur-sm` for a more polished feel.

### Views
- [ ] **`OfficialProfile` — empty states** — if an official has no votes, no legislation, and no contact info, the tabs show nothing. Add empty state UI per tab: "No voting records available", etc.
- [ ] **`BillsView` — expand tag list** — currently limited to ~9 tag color mappings. Any unmapped tag falls back to gray. Audit `src/data/bills.ts` tags and add entries to `TAG_COLORS` for any missing ones.
- [ ] **`ElectionsView` — past deadlines** — deadlines with `daysUntil() === 0` show no countdown but still appear. Consider visually dimming them or moving them to a "Past" section rather than mixing with upcoming.
- [ ] **`BudgetView` — mobile chart** — Recharts `PieChart` at 100% width in a small container can feel cramped. Test the `h-64` pie chart on mobile; may need to reduce `outerRadius` or change to a bar-only view on small screens.

### Design
- [ ] **`party-stripe` top bar on official cards** — currently renders as a colored top gradient. Verify it's visible and consistent across all card variants (featured, normal, mini).
- [ ] **Term progress bar animation** — confirm Framer Motion `initial={{ width: '0%' }} animate={{ width: progress + '%' }}` plays on profile open. If it's not animating, it may need a `key` prop change.
- [ ] **`text-2xs` utility** — confirm `fontSize: '0.65rem'` is defined in `tailwind.config.js` under `extend.fontSize`. If missing, all `text-2xs` classes silently do nothing.

---

## P3 — Features / Enhancements

### Missing Views
- [ ] **District Finder view** — was in Phase 1 (`DistrictFinderSection`). Not yet rebuilt in Phase 2. Should allow entering an address to find AZ legislative district + school board district. Use `https://www.azleg.gov/find-my-legislator/` as external link or embed the lookup.
- [ ] **Issues view — email template generator** — `IssuesView` currently shows contact info and a mailto link. Could add a text template generator: user picks an issue, picks a stance, gets a pre-filled email body they can copy.

### Data
- [ ] **Expand `src/data/bills.ts`** — currently has a small number of bills. Add real AZ 2025-26 session bills: HB 2001 (housing), SB 1020 (water), etc. Source: https://www.azleg.gov/
- [ ] **Add `trackerUrl` to all bills** — some bills have `trackerUrl: undefined`. Add real AZ Legislature tracker links where possible: `https://www.azleg.gov/legtext/57leg/1R/bills/HB2001P.htm`
- [ ] **Update election deadlines** — confirm all dates in `src/data/elections.ts` against the official AZ Secretary of State calendar: https://azsos.gov/elections/2026-election-calendar
- [ ] **Update race ratings** — `src/data/elections.ts` `races2026` ratings are placeholder. Update with Ballotpedia / Cook Political Report ratings as 2026 approaches.

### Infrastructure
- [ ] **Code splitting** — JS bundle is 726KB (warn threshold is 500KB). Add `build.rollupOptions.output.manualChunks` to `vite.config.ts` to split Recharts, Framer Motion, and Lucide into separate chunks.
- [ ] **Add `vite.config.ts` SPA fallback** — Cloudflare Pages handles 404 → `index.html` automatically for Pages projects, but confirm `_redirects` or `_routes.json` isn't needed if client-side routing is ever added.

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-09 | Phase 2 redesign: sidebar + panel architecture | User explicitly requested focused, per-level reading experience over single-page scroll |
| 2026-03-09 | Navigation order: Local → State → Federal | Most locally-impactful first; matches user's daily life relevance |
| 2026-03-09 | Dark theme: `#080c14` base + `#c97b30` copper | Modern, high-contrast, policy/intelligence aesthetic |
| 2026-03-09 | No URL routing (plain `currentView` state) | Simplicity; no need for deep-linking at this stage |
| 2026-03-09 | Static data fallback when no API keys | App fully functional without credentials; API enriches but doesn't gate content |
| 2026-03-09 | Cloudflare Pages via Wrangler CLI | Consistent with Mythos Vault/Architect deployment pattern |
| 2026-03-09 | Sidebar positioning owned entirely by App.tsx wrapper | Sidebar.tsx had duplicate transform/position logic causing layout breakage; single source of truth |

---

## Known Data Gaps

- **Photos:** All officials use initials fallback (no photos in static data). Google Civic API will supply photos once API key is configured and an address is entered.
- **Vote records:** `src/data/officials.ts` has placeholder or empty `votes[]` for most officials. Real voting records require VoteSmart API or manual data entry.
- **District assignments:** City council district membership (which district a user is in) is only deterministic after Google Civic API lookup. Static data defaults `isUserDistrict: true` for Scott Somers (D6) since that's the target neighborhood.
- **School board terms:** Term start/end years for school board members may be approximate. Verify against MPS board minutes.
