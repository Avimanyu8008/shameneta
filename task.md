# ShameNeta Task Tracker

## Status: SCRAPING IN PROGRESS
- Scraper running background, ~5-6 min total
- Real Lok Sabha 2024 winners (543 MPs) being scraped from myneta.info
- 300ms delay per constituency → ~5 min

## Completed
- [x] App created, schema pushed, Hono API running on :5173
- [x] Wrote /api/scraper.ts — parses constituency list pages + candidate detail pages
- [x] Updated seed.ts — empty-check guard, uses scraper
- [x] Added /api/admin/scrape POST endpoint (force=true to re-scrape)
- [x] Added /api/admin/status GET endpoint

## In Progress
- [ ] Scraping: constituency 15+/543 in progress (check logs)

## Remaining after scrape
- [ ] Verify 543 politicians in DB
- [ ] Check leaderboard shows real data
- [ ] Check party stats computed correctly
- [ ] Potentially improve IPC section regex (section 186A, etc.)
