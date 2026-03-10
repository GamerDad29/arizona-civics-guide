# Next Steps

**Last updated:** 2026-03-09

## P0 — Blocking / High Impact

### Enable Google Civic Information API
The `/api/civic` endpoint returns "Method not found" because the API isn't enabled in GCP.
1. Go to https://console.cloud.google.com/apis/library/civicinfo.googleapis.com
2. Click "Enable"
3. The existing API key (`AIzaSyDBtjKNUjshkyLgKa2lX8vmyrPN0nsNq3E`) should work immediately
4. Test: visit `https://arizona-civics-api.gamerdad29.workers.dev/api/civic?address=123+W+Main+St+Mesa+AZ`

### Connect GitHub Auto-Deploy
Currently deploying via `npx wrangler pages deploy dist`. Set up CI/CD:
1. Cloudflare Dashboard → Pages → arizona-civics-guide → Settings → Builds & deployments
2. Connect to `GamerDad29/arizona-civics-guide`, branch `main`
3. Build command: `npm run build`
4. Output directory: `dist`
5. After this, every `git push` auto-deploys

---

## P1 — Data Quality

### Enrich Representative Data
Many reps have sparse data (no bio, no priorities, no votes). Prioritize:
- [ ] Add bios for all state officials (Governor, AG, SoS, Sheriff already have some)
- [ ] Add voting records for city council members (source: Mesa Council meeting minutes)
- [ ] Add photo URLs (currently all use initials avatars)
- [ ] Fill in missing contact info (some reps only have email)

### Update Election Data
- [ ] Verify all dates against AZ Secretary of State 2026 calendar
- [ ] Update race ratings from Cook Political Report / Ballotpedia
- [ ] Add 2026 primary election deadlines

### Expand Bill Data
- [ ] Add real AZ 2025-26 session bills from https://www.azleg.gov/
- [ ] Add tracker URLs to all bills
- [ ] Add Mesa city ordinances from council agendas

---

## P2 — Features

### Code Splitting
Bundle is 712KB. Split heavy dependencies:
```js
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        recharts: ['recharts'],
        motion: ['framer-motion'],
        icons: ['lucide-react'],
      }
    }
  }
}
```

### Email Template Generator
On the Issues page, add a "Draft Email" button that generates a pre-filled email body based on the selected issue and official. User picks a stance, gets a mailto link with subject and body.

### District Finder Enhancement
Currently the Districts page links to external tools. If Google Civic API is enabled, use it to show the user's actual district assignments inline.

### Admin / Data Management
Consider a simple admin interface or Cloudflare dashboard workflow for updating D1 data without SQL. Options:
- Cloudflare D1 Console (already available in dashboard)
- Simple password-protected admin page
- GitHub Actions workflow that runs SQL migrations on push

---

## P3 — Polish

- [ ] Official photos (when available from Google Civic API or manual upload)
- [ ] Dark mode toggle (design tokens already support it via CSS custom properties)
- [ ] Mobile refinements — verify all touch targets are 44px+
- [ ] Loading skeletons instead of "Loading..." text
- [ ] Error states with retry buttons
- [ ] PWA manifest for "Add to Home Screen"
