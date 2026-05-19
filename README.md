# Cozy Designs

Marketing and portfolio site for [Cozy Designs](https://cozydesigns.art) — Gautham J Paul's independent studio for retro-comic posters, album covers, motion artwork, and culture-led visuals.

Built on Next.js 16 (App Router) + React 19, deployed to Netlify.

## Scripts

```bash
npm run dev     # local dev server (http://localhost:3000)
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Project layout

- `src/app/` — App Router pages, route handlers, metadata, `sitemap`, `robots`, `manifest`, `opengraph-image`.
- `src/components/` — page components, preloader sequence, JSON-LD helper, nav, footer.
- `src/lib/` — SEO helpers, post/poster data sources.
- `public/` — static assets (poster artwork, preloader videos, manifest icons).
- `node_modules/next/dist/docs/` — Next 16 docs. Conventions and APIs may differ from earlier major versions; check here before relying on training-data knowledge.

## Preloader

Two-phase video sequence in `src/components/preloader-sequence.tsx`. Phase 1 is viewport-specific (phone / tablet / desktop). Phase 2 is desktop-only. The reveal is gated on actual page assets being ready, with a 14s hard fallback.

Debug overlay: append `?preloaderDebug=1` to any URL.

## Environment

Set in Netlify UI for production / preview:

| Key | Purpose |
|---|---|
| `CONTEXT` | Set by Netlify. `production` enables sitemap / robots; previews are `noindex`. |
| (admin / API secrets — see `src/app/api/`) | |

## Deploy

Netlify auto-builds from the production branch via `netlify.toml`. The `@netlify/plugin-nextjs` plugin is pinned there.

- `cozydesigns.art` is the canonical host; `www.cozydesigns.art` 301s to apex.
- `/admin`, `/api/*` are `noindex` and `no-store` via headers.
- CSP is currently `Report-Only`; switch to enforcing once violations are clean.
