# brownie

A tiny brownie voting app. Next.js App Router + Vercel KV + Vercel hosting.

## Stack
- Next.js 15 (App Router, TypeScript strict)
- `@vercel/kv` for vote counts and per-IP dedup
- Images committed to `public/brownies/`

## Setup

```bash
npm install
cp .env.local.example .env.local
# fill in KV_REST_API_URL / KV_REST_API_TOKEN from the Vercel KV dashboard
npm run dev
```

Open http://localhost:3000.

## Editing brownies

Drop image files into `public/brownies/`. That's the whole workflow — the brownie list is auto-generated from filenames on every `npm run dev` / `npm run build`. Filename becomes the id; title-cased filename (with `-`/`_` as spaces) becomes the display name. `src/brownies.ts` is a generated file; don't edit it by hand.

## How voting works

- KV hash `brownie:votes` — field per brownie id, value = count (`HINCRBY`).
- KV key `brownie:voter:{ip}` — the brownie id this IP voted for; presence blocks revoting.
- Client IP comes from `x-forwarded-for` (Vercel sets this). Local dev will be `unknown` unless behind a proxy — the API rejects `unknown` to prevent a single shared vote during development. Set an `x-forwarded-for` header via your browser's devtools if you want to test locally, or deploy to a preview environment.

## Deploying

1. Push to GitHub.
2. Import the repo in Vercel.
3. Create a KV store in the Vercel dashboard and link it to the project — this injects `KV_REST_API_URL` / `KV_REST_API_TOKEN` automatically.
4. Deploy.

## Resetting votes

In the Vercel KV data browser, delete the `brownie:votes` hash and any `brownie:voter:*` keys.

## Possible extensions
- `/api/upload` route using Vercel Blob for user-submitted brownies.
- Admin page to view/reset counts.
- Rate-limit the vote endpoint with `@upstash/ratelimit`.
