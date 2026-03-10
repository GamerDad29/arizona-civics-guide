# Arizona Civics Guide

## What This Is
A civic intelligence app for Mesa, Arizona residents. Track representatives, elections, legislation, budget, and local issues across Local, State, and Federal levels.

**Live:** https://arizona-civics-guide.pages.dev
**API:** https://arizona-civics-api.gamerdad29.workers.dev
**Repo:** https://github.com/GamerDad29/arizona-civics-guide

## Stack

### Frontend
- **Framework:** Vite + React 19 + TypeScript
- **Styling:** Tailwind CSS v3 (custom WPA poster design system)
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
- **External APIs:** Google Civic Information API, Congress.gov API v3

## Design System — WPA Poster Aesthetic

1930s National Park Travel Poster / WPA style. Paper grain textures, serif display headings, earthy tones.

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `burgundy` | `#7B1D3A` | Local government zone |
| `sage` | `#5C7A5E` | State government zone |
| `sky` / `sky-dark` | `#A8C4C8` / `#5A8A90` | Federal government zone |
| `terracotta` | `#C4623A` | Primary accent, CTAs |
| `sand` | `#EDE8D8` | Page background |
| `cream` | `#FAF8F2` | Card backgrounds |
| `ink` | `#1C1A18` | Primary text |

### Typography
| Role | Font | Tailwind Class |
|------|------|---------------|
| Display/Headings | Playfair Display | `font-display` |
| Body | Source Sans 3 | `font-body` |
| UI/Labels | Barlow Condensed | `font-ui` |
| Mono | JetBrains Mono | `font-mono` |

### Zone System
Three-tier color coding used everywhere (badges, cards, tabs, tiles):
- **Local** = burgundy (`#7B1D3A`)
- **State** = sage (`#5C7A5E`)
- **Federal** = sky (`#5A8A90`)

CSS classes: `.zone-badge-local`, `.zone-badge-state`, `.zone-badge-federal`

### Key CSS Classes
Defined in `src/index.css`:
- `.wpa-tile` — bento grid tile with paper shadow
- `.wpa-card` — content card with cream background
- `.wpa-label` — uppercase Barlow Condensed label
- `.btn-primary`, `.btn-outline`, `.btn-burgundy`, `.btn-sage` — button variants
- `.input-wpa` — form input with sand background
- `.stat-pill` — inline stat display
- `.wpa-divider` — section divider

## Architecture

```
arizona-civics-guide/
  index.html              # Entry point
  tailwind.config.js      # WPA design tokens
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
                                → Congress.gov API
```

## Conventions

- Page components are in `src/pages/`, exported as named functions
- All API types defined in `src/lib/api.ts`
- Data fetching via `useApi<T>(fetcher, deps)` hook — returns `{ data, loading, error }`
- Zone colors applied dynamically via inline `style` props (not Tailwind classes) for the three-tier system
- wouter for routing — no React Router. Use `Link`, `useLocation`, `useRoute`
- Framer Motion `motion.div` for page/card entrance animations
- No static data files — everything comes from the Worker API backed by D1
