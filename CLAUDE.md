# Arizona Civics Guide

## What This Is
A civic intelligence app for Mesa, Arizona residents. Track representatives, elections, legislation, budget, and local issues across Local, State, and Federal levels.

**Live:** https://arizona-civics-guide-web.pages.dev
**API:** https://arizona-civics-api.gamerdad29.workers.dev
**Repo:** https://github.com/GamerDad29/arizona-civics-guide

## Stack

### Frontend
- **Framework:** Vite + React 19 + TypeScript
- **Styling:** Tailwind CSS v3 (Arizona copper/desert design system with glassmorphism)
- **Routing:** wouter (lightweight, `<Router>`, `<Route>`, `<Switch>`, `<Link>`)
- **Animation:** Framer Motion
- **Charts:** Recharts
- **Icons:** Lucide React
- **Hosting:** Cloudflare Pages

### Backend
- **API:** Cloudflare Worker (`worker/index.ts`)
- **Database:** Cloudflare D1 (SQLite at edge)
  - Name: `arizona-civics`
  - ID: `ba2e1c43-3005-4e02-bc9c-744866f40e0c`
  - Region: WNAM
- **External APIs:** Google Civic Information API, Congress.gov API v3, OpenStates API v3, FEC OpenFEC API

## Design System — Arizona Copper & Glassmorphism

Modern dark glassmorphism with Arizona copper accents. The Copper State identity: warm metallics, desert earth, big sky.

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `copper` | `#B87333` | Primary accent, CTAs, Local zone |
| `forest` | `#2D5A3D` | State government zone |
| `sky` | `#87CEEB` | Federal government zone |
| `flame` | `#E25822` | Urgent/election alerts |
| `bg-dark` | `#0F1923` | Page background |
| `glass-bg` | `rgba(255,255,255,0.03)` | Card backgrounds (glass-card) |
| `text-primary` | `#F0F4F8` | Primary text |
| `text-muted` | `rgba(240,244,248,0.5)` | Secondary text |

### Typography
| Role | Font | Tailwind Class |
|------|------|---------------|
| Display/Headings | Playfair Display | `font-display` |
| Body | Source Sans 3 | `font-body` |
| UI/Labels | Barlow Condensed | `font-ui` |
| Mono | JetBrains Mono | `font-mono` |

### Zone System
Three-tier color coding used everywhere (badges, cards, tabs, tiles):
- **Local** = copper (`#B87333`)
- **State** = forest (`#2D5A3D`)
- **Federal** = sky (`#87CEEB`)

CSS classes: `.zone-badge-local`, `.zone-badge-state`, `.zone-badge-federal`

### Key CSS Classes
Defined in `src/index.css`:
- `.glass-card` — glassmorphism card (dark bg, subtle border, backdrop-blur)
- `.az-label` — uppercase Barlow Condensed label (copper tint)
- `.az-divider` — section divider (subtle white line)
- `.az-alert`, `.az-alert-info`, `.az-alert-warn` — alert boxes
- `.btn-primary`, `.btn-outline` — button variants
- `.input-az` — form input with dark glass background
- `.stat-pill` — inline stat display
- `.zone-badge-local`, `.zone-badge-state`, `.zone-badge-federal` — zone badges
- `.party-badge`, `.party-d`, `.party-r`, `.party-i` — party affiliation badges
- All colors applied via inline `style` props, NOT Tailwind color classes

## Architecture

```
arizona-civics-guide/
  index.html              # Entry point
  tailwind.config.js      # Arizona copper design tokens
  src/
    main.tsx              # React root
    App.tsx               # wouter Router + all routes
    index.css             # WPA design system, Google Fonts
    components/
      Navbar.tsx          # Sticky top nav, mobile hamburger
      Layout.tsx          # Page wrapper (navbar + footer)
      BentoTile.tsx       # Homepage bento grid tile
    hooks/
      useApi.ts           # Generic data-fetching hook
    lib/
      api.ts              # Worker API client + TypeScript types
    pages/
      HomePage.tsx        # Hero + bento grid dashboard
      RepresentativesPage.tsx  # Three-zone tabbed rep list
      RepDetailPage.tsx   # Individual rep profile
      ElectionsPage.tsx   # Countdown + deadlines + race ratings
      DistrictsPage.tsx   # District finder + external links
      BillsPage.tsx       # Bill tracker with filters
      BudgetPage.tsx      # Pie chart + bar breakdown
      IssuesPage.tsx      # Issue selector + contact cards
      AboutPage.tsx       # How government works explainer
  public/
    favicon.svg
    _redirects            # SPA fallback for Cloudflare Pages
  worker/
    index.ts              # Cloudflare Worker API
    wrangler.json         # Worker config + D1 binding
```

## API Endpoints

All served by `worker/index.ts`:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/representatives` | GET | All reps. `?level=local\|state\|federal`, `?id=<slug>` |
| `/api/elections` | GET | Deadlines + race ratings |
| `/api/bills` | GET | Bills. `?level=`, `?status=` |
| `/api/budget` | GET | Mesa city budget segments |
| `/api/issues` | GET | Issues + contacts. `?id=<issue_id>` |
| `/api/civic` | GET | Google Civic proxy. `?address=` |
| `/api/congress` | GET | Congress.gov proxy. `?bioguideId=` for sponsored bills |
| `/api/openstates` | GET | OpenStates proxy. `?endpoint=people\|people.geo\|bills\|committees`, `?lat=&lng=`, `?jurisdiction=`, `?district=` |
| `/api/fec` | GET | FEC proxy. `?endpoint=candidates\|candidate\|contributions\|spending\|races`, `?candidate_id=`, `?name=`, `?office=H\|S` |
| `/api/search` | GET | Full-text search. `?q=` |
| `/api/health` | GET | Health check |

## D1 Database Schema

8 tables: `representatives`, `elections`, `races`, `bills`, `budget_segments`, `issues`, `issue_contacts`, `zip_cache`

Indexes: `idx_reps_level`, `idx_elections_date`, `idx_bills_level`, `idx_bills_status`

JSON fields stored as TEXT, parsed by Worker on read: `contacts`, `links`, `votes`, `background`, `priorities`, `backers`, `tags`

## Worker Secrets

Set via `wrangler secret put <NAME>` from the `worker/` directory:

| Secret | Value |
|--------|-------|
| `ALLOWED_ORIGIN` | `*` (public read-only API) |
| `GOOGLE_CIVIC_API_KEY` | Google Civic Information API key |
| `CONGRESS_API_KEY` | Congress.gov API key |
| `OPENSTATES_API_KEY` | OpenStates API key (state legislators, bills, votes) |
| `FEC_API_KEY` | FEC OpenFEC API key (campaign finance) — falls back to DEMO_KEY |

## Commands

```bash
# Frontend
npm run dev          # Local dev server
npm run build        # TypeScript check + Vite build
npm run preview      # Preview production build

# Deploy frontend
npx wrangler pages deploy dist --project-name=arizona-civics-guide

# Worker (from worker/ directory)
cd worker
npx wrangler dev     # Local Worker dev
npx wrangler deploy  # Deploy Worker
npx wrangler d1 execute arizona-civics --command="SELECT COUNT(*) FROM representatives"

# Secrets
cd worker
npx wrangler secret put GOOGLE_CIVIC_API_KEY
npx wrangler secret put CONGRESS_API_KEY
npx wrangler secret list
```

## Data Flow

```
User → Pages (static React SPA)
         → fetch() → Worker API → D1 database
                                → Google Civic API (cached in zip_cache)
                                → Congress.gov API (sponsored bills, member data)
                                → OpenStates API (state legislators, state bills, votes)
                                → FEC OpenFEC API (campaign finance, contributions)
```

## Conventions

- Page components are in `src/pages/`, exported as named functions
- All API types defined in `src/lib/api.ts`
- Data fetching via `useApi<T>(fetcher, deps)` hook — returns `{ data, loading, error }`
- Zone colors applied dynamically via inline `style` props (not Tailwind classes) for the three-tier system
- wouter for routing — no React Router. Use `Link`, `useLocation`, `useRoute`
- Framer Motion `motion.div` for page/card entrance animations
- No static data files — everything comes from the Worker API backed by D1
- NO em dashes anywhere in copy — use plain language
- Copy should be colloquial, meet people where they are — not bureaucratic
- Rep photos: federal reps use unitedstates.github.io 450x550 images, local reps use mesaaz.gov
- RepDetailPage: tall photo left (sticky), content right (single scroll, no tabs)
- Bills are expandable cards — click to see status, summary, link to Congress.gov
- Zone colors: Local=#B87333 (copper), State=#2D5A3D (forest), Federal=#87CEEB (sky)
- Glass cards with `glass-card` class, dark background (#0F1923), light text (#F0F4F8)

## Gotchas & Learnings

- `wrangler d1 execute --remote --command` accepts ONE SQL statement at a time, no semicolons
- Escape single quotes in D1 SQL with double single quotes (`''`)
- Congress.gov API returns amendments (not bills) for senators who recently transitioned from House (e.g. Gallego G000574). Scrape Senate website instead
- Congress.gov `_200.jpg` member photos are 200px and pixelate. Use `unitedstates.github.io/images/congress/450x550/{bioguide}.jpg`
- D1 JSON fields (`contacts`, `votes`, `background`, etc.) stored as TEXT. Worker parses via `parseJsonFields()` on read
- No Python on this Windows machine. Use `node -e` for inline data processing
- Mesa council: 3 seats elected every 2 years, 4-year terms. School board: 5 at-large, staggered 4-year terms
- FEC `DEMO_KEY` works but has low rate limits. Fallback built into Worker code
- Rep data goes stale. School board was fully wrong (old members), sheriff changed. Always verify against Ballotpedia before trusting DB
- `gridAutoRows: '1fr'` + `h-full flex flex-col` pattern ensures equal-height cards in grids
- RepDetailPage back button should preserve the zone tab the user came from (pass `?from=level` in URL)
- D1 JSON with dollar signs: `$4.4M` stored as `\\.4M` breaks `JSON.parse()`. Always verify votes/JSON fields parse correctly after INSERT
- `unitedstates.github.io` photos don't exist for new 2024-class members. Use `{name}.house.gov` hero images or Wikimedia API fallback
- Congress.gov and AZ state sites (azsos.gov) block curl/fetch with 403. Use Wikipedia API (`w/api.php?action=query&prop=pageimages`) for photos
- `?level=` vs `?tab=` query param: RepresentativesPage reads `tab` from useSearch, HomePage links must match
- Tailwind custom colors (e.g. `hover:text-copper`) won't work unless defined in tailwind.config. Use inline styles for zone colors instead
- Playfair Display is the display font (serif), NOT Inter. Font import in index.css must match tailwind.config fontFamily
- When `parseJsonFields()` silently fails, the field stays as a string. RepDetailPage must handle `typeof votes === 'string'` gracefully
- Andy Biggs is running for Governor 2026, NOT re-running for House. Data goes stale fast on candidates

## Session Backlog & Progress

### Session 1 (2026-03-18)
1. ✅ Full design system overhaul: WPA poster → Arizona copper/glassmorphism
2. ✅ All 16 files rewritten (tailwind.config, index.css, index.html, all pages, all components)
3. ✅ RepDetailPage redesigned: tall photo left, scrollable content right, expandable bill cards
4. ✅ Added OpenStates + FEC API proxies to Worker, deployed

### Session 2 (2026-03-19)
1. ✅ 13-item polish pass: font fix (Playfair Display), em dash removal, aria labels, Framer Motion on all pages, footer hover fix, election day calc, dead code removal
2. ✅ Enriched all 27+ reps via Ballotpedia + Mesa.gov + official sites (bios, backgrounds, priorities, contacts, social media)
3. ✅ Pulled sponsored bills from Congress.gov for all 11 federal reps
4. ✅ Fixed Somers broken page (bad JSON escape in votes field)
5. ✅ Fixed all photo URLs: state reps (Hobbs/Fontes/Mayes via official sites + Wikimedia), federal freshmen (Hamadeh/Grijalva/Ansari via house.gov)
6. ✅ Replaced Russ Skinner with Jerry Sheridan in D1 (Skinner lost 2024 primary)
7. ✅ Fixed term_start/term_end/elected for all reps (was causing 0% term progress)
8. ✅ Fixed Gallego sponsored bills (API was returning amendments, scraped Senate site)
9. ✅ Database now has 34 reps (12 local, 4 state, 11 federal + 7 new federal)
10. ✅ AboutPage copy made colloquial, disclaimer rewritten
11. ✅ Homepage Federal Delegation link fixed (?tab= instead of ?level=)
12. ✅ Geolocation city detection on homepage (OpenStreetMap Nominatim reverse geocode)

### In Progress / Needs User Action
- 🔑 OpenStates API key needed — user registers at https://open.pluralpolicy.com/accounts/profile/
- 🔑 FEC API key (optional) — register at https://api.data.gov/signup/ for higher rate limits
- 📧 ProPublica premium datasets — user emailing for access
- 👤 VoteSmart API — user handling registration

### Core Product Vision (from user, sessions 2-3)

**THIS IS NOT A MESA-ONLY SITE. This is Arizona Civics Guide, statewide.**

The site should let ANYONE in Arizona (including a 17-year-old about to vote) enter their address or allow geolocation and get a fully personalized civic dashboard:
1. **Auto-personalize everything** — address/geolocation determines city, county, legislative district, congressional district. Every page adapts.
2. **"Mesa City Council" box becomes "Phoenix City Council"** (or Chandler, Scottsdale, Tempe, Gilbert, Glendale, Peoria, Surprise, Flagstaff, Tucson, etc.) based on where the user IS.
3. **Budget page** — not just Mesa. Must support any AZ city's budget. City budgets are a whole exercise.
4. **Bills page** — only 3 bills currently, that's nowhere near enough. Need comprehensive active legislation at all levels.
5. **What has this person DONE?** (factual record, not campaign promises)
6. **Who's challenging them?** (incumbent vs challenger side-by-side)
7. **What does the challenger want to do differently?** (fact-based policy comparison)
8. **WHO IS PAYING FOR THEM?** (campaign finance: PACs, small donors, corporate money — follow the money)
9. **Copy must be colloquial**, no jargon, no info dumps. Meet people where they are.
10. **Non-partisan. Facts only.** Let the user decide.

**Homepage address box is broken** — entering an address just links to azleg.gov instead of personalizing the page. The page needs to morph: bento boxes fill in with YOUR reps, YOUR city council, YOUR budget, YOUR upcoming elections.

**Design still looks "very AI made"** — user has provided B-roll links (Pexels, Storyblocks Arizona footage) and design inspiration links but NOTHING has been implemented. Bento boxes need to feel less template-y. Do deep research on unique UI/UX approaches. Use the design reference links below.

**Cities to support (Phoenix metro + outlying):**
- Phoenix metro: Mesa, Phoenix, Chandler, Scottsdale, Glendale, Tempe, Gilbert, Peoria, Surprise, Avondale, Goodyear, Buckeye, Queen Creek, Apache Junction, Fountain Hills, Paradise Valley, Cave Creek, Carefree, Maricopa
- Outlying: Tucson, Flagstaff, Prescott, Payson, Show Low, Sedona, Wickenburg, Sierra Vista, Yuma, Lake Havasu City, Kingman, Bullhead City, Casa Grande, Florence, Coolidge

### Next Up (Backlog, re-prioritized session 3)
1. **ARCHITECTURE: Statewide personalization engine** — address/geolocation → city/county/LD/CD detection → all pages adapt
2. **Homepage: address box actually personalizes the page** — bento boxes morph to show YOUR reps, YOUR city, YOUR elections
3. **Homepage: B-roll video backgrounds + unique UI** — stop looking AI-made. Use Pexels/Storyblocks AZ footage. Deep research on distinctive approaches.
4. **Multi-city support** — rep data, budgets, and issues for all major AZ cities (not just Mesa)
5. **Bills page: comprehensive active legislation** — way more than 3 bills. Pull from Congress.gov + OpenStates for state bills
6. **RepDetailPage: Full voting record** — not just sponsored bills. How did they vote on OTHER bills? Pull roll call votes from Congress.gov (federal) and OpenStates (state). Show vote position (Yea/Nay/Abstain) on key legislation.
7. **RepDetailPage: News coverage section** — pull from mainstream sources with journalistic integrity (AP News, Reuters, local outlets like AZ Central/Arizona Republic for local reps). Show citations, quotes, what's going on. Link out so the reader can learn more. NO opinion blogs, NO partisan media.
8. **Campaign finance on rep pages** — FEC data showing donors, PACs, small-dollar %, corporate money. Follow the money. This is a priority feature.
9. **RepDetailPage: "Peek under the hood"** — an opt-in expandable section at the bottom of each rep page. This is where the noisier, more subjective stuff lives: social media activity (Twitter/X, Bluesky, Truth Social), posting frequency, tone. The idea is: news coverage and voting record are facts that belong on the page by default. Social media is performative and optional, so the user chooses to look. A clear "Peek Under the Hood" toggle/accordion that reveals social media summary, maybe PAC connections, endorsements, etc.
11. **RepDetailPage: Incumbent vs Challenger** — scrape Ballotpedia for declared opponents, show side-by-side
12. **RepDetailPage: "What have they done?"** — factual accomplishments/record section per rep
13. **Expandable bill summaries** — 2-sentence "what this bill IS" (not where it stands), with opposition context on click
10. **Take Action page** — needs to be dynamic per user location, not static
11. **Contact Your Reps** — dynamic based on geolocation, not hardcoded Mesa contacts
12. Add LD12 state legislators (blocked on OpenStates key)
13. Sheridan photo (no public domain source found yet)
14. School board member term data (all 5 have null term_start/elected)
15. **Light mode / dark mode toggle** — currently dark-only. Need a warm desert-sand light theme with copper accents
16. Code-split bundle (currently ~738KB)
17. Deploy frontend to Cloudflare Pages

### Design Reference Links (from user)
- AI UX Patterns: https://www.aiuxplayground.com/patterns
- Widgets: https://widgetsmith.app/
- Animation: https://jitter.video/ and SVGator
- Design Gallery: https://www.designarena.ai/gallery
- Loading animations: https://loadmo.re/
- Pattern backgrounds: https://github.com/megh-bari/pattern-craft
- Google Mixboard: https://mixboard.google.com/projects
- shadcn/ui: https://ui.shadcn.com/
- B-roll: https://www.storyblocks.com/all-video/search/Arizona, https://www.pexels.com/search/videos/Arizona/
- Design trends: https://www.figma.com/resource-library/web-design-trends/
- Web design: https://www.wearetg.com/blog/web-design-trends/
- UX 2026: https://bluetext.com/blog/how-top-website-design-firms-are-enhancing-user-experience-in-2026/

### API Endpoints (Current)
| Endpoint | Source | Status |
|----------|--------|--------|
| `/api/representatives` | D1 | ✅ 27 reps |
| `/api/elections` | D1 | ✅ |
| `/api/bills` | D1 | ✅ |
| `/api/budget` | D1 | ✅ |
| `/api/issues` | D1 | ✅ |
| `/api/civic` | Google Civic API | ✅ |
| `/api/congress` | Congress.gov API | ✅ |
| `/api/openstates` | OpenStates API | 🔑 Needs key |
| `/api/fec` | FEC OpenFEC API | ✅ (DEMO_KEY) |
| `/api/search` | D1 full-text | ✅ |
| `/api/health` | Health check | ✅ |

### Database Stats
- **representatives**: 27 rows (12 local, 4 state, 11 federal)
- **elections**: deadlines + race ratings
- **bills**: tracked bills with level/status filters
- **budget_segments**: Mesa city budget breakdown
- **issues**: civic issues with contact cards
- **zip_cache**: Google Civic API response cache
