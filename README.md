# Japan Ingredient Finder

Search an imported/foreign grocery ingredient or brand and see which Japan-based import/delivery services carry it, with real prices and stock status where available.

Built for international students and staff in Tokyo who need to find foreign ingredients — a recurring pain point made worse by Wolt's full exit from the Japanese market (March 2026).

## Running it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 and search an ingredient (e.g. "peanut butter", "curry", "halal chicken", "matcha").

## Running the tests

```bash
npm run test        # run once
npm run test:watch  # watch mode
```

## What it does

Type a query into the search bar. The app queries up to 9 Japan import/grocery services in parallel and shows what each one has, grouped by service:

| Service | What you'll see |
|---|---|
| Kaldi Coffee Farm | Real products, prices, stock — pulled live from their storefront |
| Halal Food Japan | Real products, prices, stock — pulled live from their storefront |
| Tengu Natural Foods | Real products, prices, stock — pulled live from their storefront |
| National Azabu | Real products, prices, stock — pulled live from their storefront |
| The Meat Guy | Real products, prices, stock — pulled live from their storefront |
| iHerb | A link to check their own search directly (blocks automated requests with bot detection) |
| Amazon Fresh | A link to check their own search directly (Tokyo/Kanagawa/Chiba/parts of Saitama only; blocks automated requests) |
| Amazon.co.jp | A link to check their own search directly (blocks automated requests) |
| Uber Eats | A link to their Japan homepage (no direct query link is possible — availability is area/store-dependent; blocks automated requests) |

The first 5 are queried live on every search. The last 4 don't have an accessible, unblocked search surface — Amazon and Uber Eats actively block automated requests (confirmed via direct testing: Amazon's robots.txt disallows Claude's own crawlers by name, and their Conditions of Use explicitly prohibit robots/scrapers; Uber Eats returns a hard Cloudflare challenge), and iHerb returns HTTP 403 to every non-browser request. Rather than evade those blocks or show stale/fabricated data, those 4 link straight to the real search on that service.

## If something breaks

These are live requests to real third-party websites, not a fixed dataset — if a service redesigns their site, that one card may start showing "Temporarily unavailable" instead of crashing the whole search. That's expected behavior, not a bug: every other card still works normally. See `ARCHITECTURE.md` for why it's built this way.

If a specific service starts failing consistently, the fix is almost always in `src/lib/services/adapters/<service>.ts` or its paired `parsers/<service>.parser.ts` — the site probably changed its HTML/URL structure and the selectors need updating.

## For next year's team

- No accounts, API keys, or database needed — just `npm install && npm run dev`.
- If you want to add a new service, look at `src/lib/services/adapters/` for an example that matches its platform (Shopify, WooCommerce, or a custom site needing HTML parsing) and register it in `src/lib/services/registry.ts`.
