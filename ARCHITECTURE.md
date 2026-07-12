# Architecture

This doc explains the design decisions worth being able to speak to — not what the code does (the code shows that), but why it's shaped this way.

## The core problem: aggregating sources with wildly different reliability

This is a "Vetcove for groceries" problem: pull together data from suppliers who never agreed on a common format, weren't built to be aggregated, and vary enormously in how much you can trust them to answer at all. Concretely, of 9 services shown, 5 answer live and 4 don't expose any queryable data — those 4 get an honest link-out instead of fabricated or stale numbers.

The fix isn't "write 8 special cases in the UI." It's one contract every source implements, however it gets its data:

```ts
interface ServiceAdapter {
  meta: ServiceMeta;
  search(query: string): Promise<ServiceSearchResult>;
}
```

`ServiceSearchResult` always carries `service`, `status`, and `products` — whether the underlying implementation is a real JSON API, an HTML page a Cheerio parser tears apart, or a source with no queryable data at all that just returns a link. The UI never special-cases *how* a result was produced; `ServiceCard` only branches on `kind` ("data" vs "link-out") for the last-mile rendering, which is a presentation decision, not a data-shape one.

## Two resilience layers, not one

`search()` is contractually not allowed to throw — every adapter wraps its own fetch/parse logic in try/catch and always resolves a `ServiceSearchResult`, using `status: "error"` or `"unavailable"` to represent failure rather than an exception. `Promise.allSettled` at the aggregation layer (`aggregate.ts`) is a second, defensive layer in case an adapter has a bug anyway. One slow or broken source (in practice: bot detection, a site redesign breaking a selector, a timeout) can never take down the other 8 cards. This is the actual point of the exercise — an aggregator's core job is staying useful when suppliers individually are not.

## Data tiers were discovered, not assumed

The original brief assumed a flat curated dataset. Hands-on research (checking each site's real search behavior, not guessing from documentation) found the sources split into three genuinely different tiers:

- **Live JSON** (The Meat Guy, Halal Food Japan) — real, documented-shape APIs (Shopify's `/products.json`, WooCommerce's Store API), no auth needed.
- **Live HTML** (Tengu Natural Foods, National Azabu, Kaldi) — no JSON endpoint, but a plain unauthenticated GET request returns server-rendered HTML with real product data. Parsed with Cheerio — never a headless browser, never JS execution, never bot-detection evasion.
- **Link-out only** (iHerb, Amazon Fresh, Amazon.co.jp, Uber Eats) — no accessible search surface at all, confirmed by direct testing rather than assumption. Rather than fabricate data or silently omit these, they get a real, working link to check the source directly — the same pattern Southwest Airlines used for competitor fares it wouldn't display inline.

Two sources changed tier mid-build once real data proved the initial plan wrong, which is itself the more honest engineering story than "the plan was right the first time":

- **iHerb** was originally planned as a live-HTML source. A real browser gets results; every server-side fetch (from this app, and independently confirmed twice more later) got HTTP 403 — genuine bot detection, not a fixable bug. It was dropped from the data tier and replaced with **Tengu Natural Foods** as a live source, discovered by researching what else in the same space has a workable search surface — but iHerb itself came back later as a link-out card rather than being omitted entirely, once the same "just link to the real search" pattern was extended to it.
- **Tengu Natural Foods** looked at first like a second easy Shopify-JSON win (same platform as The Meat Guy). It wasn't: its `/products.json` feed is missing real, purchasable products (its entire "Organic Peanut Butter" line, confirmed by direct comparison) that the site's own on-site search finds. A nice-looking JSON API isn't automatically the complete or correct one — its own search endpoint was the accurate source, so that's what shipped.

Only Kaldi needed the "verify a real DOM sample before writing the parser" step the plan called for explicitly; it turned out to be quick, so no fallback was needed there.

**Amazon and Uber Eats were also confirmed, not assumed, to be off-limits.** Direct testing found: Amazon.co.jp's `robots.txt` disallows Claude's own crawlers (ClaudeBot, Claude-User, Claude-SearchBot) by name for the entire site, and its Conditions of Use explicitly prohibit "robots, spiders, scrapers, or other automated means"; Uber Eats Japan returns a hard Cloudflare Turnstile challenge (HTTP 403) on every URL pattern tried, before any real content loads. Both are a fundamentally different case from the 3 HTML-parsed sources, which don't actively block plain requests — this is the line between "a site that just happens not to expose a JSON API" and "a site that has decided to keep automated access out," and only the former is worth building a scraper for.

## Honest tradeoffs (worth naming rather than hiding)

- **In-memory cache, not distributed.** `cache.ts` is a module-level `Map` with a 15-minute TTL — fine for one local dev process, would need Redis or similar the moment this ran on more than one server instance.
- **Substring match, not fuzzy search.** Live-JSON/HTML adapters match query text against product titles directly. A misspelling or a synonym won't be found. Good enough for a capstone; a real product would want a proper search index.
- **Two-page cap on Shopify catalogs.** `/products.json` is fetched up to 2 pages (~500 products) rather than fully paginated — a deliberate scope cut, not a bug, since most of these catalogs are well under that size.
- **Scraping-adjacent but not scraping in the sense that matters.** HTML-parsing 3 sources is intentional and was a deliberate risk call, not an oversight: non-commercial, low-volume, cached use of public unauthenticated pages carries low legal risk (*hiQ Labs v. LinkedIn*, 9th Cir. 2019/2022 — accessing public, non-logged-in pages generally isn't a CFAA violation). When a site's own bot detection said no (iHerb), that was respected rather than engineered around.
