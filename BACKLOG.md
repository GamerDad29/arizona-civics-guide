# Arizona Civics Guide — Backlog

**Project:** Mesa, AZ civic intelligence app
**Stack:** Vite + React 19 + TypeScript + Tailwind v3 + Framer Motion + Recharts + wouter
**Backend:** Cloudflare Worker + D1
**Live:** https://arizona-civics-guide.pages.dev
**API:** https://arizona-civics-api.gamerdad29.workers.dev
**Repo:** https://github.com/GamerDad29/arizona-civics-guide
**Last updated:** 2026-03-09

> Full documentation in `docs/` — STATUS, CHANGELOG, DECISIONS, NEXT-STEPS, KNOWN-ISSUES.
> Agent instructions in `CLAUDE.md`.

---

## P0 — Blocking

- [ ] **Enable Google Civic API** — API key is configured as a Worker secret, but the API itself isn't enabled in GCP Console. Go to https://console.cloud.google.com/apis/library/civicinfo.googleapis.com and click Enable.
- [ ] **Connect GitHub auto-deploy** — CF Dashboard → Pages → arizona-civics-guide → Settings → Git → connect repo, branch `main`, build `npm run build`, output `dist`.

---

## P1 — Data Quality

- [ ] Enrich representative bios (many are null)
- [ ] Add official photos (all currently use initials avatars)
- [ ] Add voting records for city council (source: Mesa Council minutes)
- [ ] Fill missing contact info (some reps only have email)
- [ ] Verify election dates against AZ SoS 2026 calendar
- [ ] Update race ratings from Cook / Ballotpedia
- [ ] Fix placeholder phone numbers (Gallego has `XXX-XXXX`)
- [ ] Add real AZ Legislature bills from https://www.azleg.gov/
- [ ] Add tracker URLs to all bills

---

## P2 — Features

- [ ] Code splitting (manualChunks for Recharts, Framer Motion, Lucide)
- [ ] Email template generator on Issues page
- [ ] Inline district finder using Google Civic API (once enabled)
- [ ] Loading skeletons instead of "Loading..." text
- [ ] Error states with retry buttons

---

## P3 — Polish

- [ ] Dark mode toggle
- [ ] PWA manifest for "Add to Home Screen"
- [ ] Mobile touch target audit (44px minimum)
- [ ] Performance audit (Lighthouse)
