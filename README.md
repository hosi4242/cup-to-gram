# CupToGram

English-first cooking measurement conversion website built with Astro and deployed as a Cloudflare Worker with static assets.

## Current scope

- 34 ingredient records: 12 published entries with source metadata and 22 unverified draft records
- Six conversion page types for each live ingredient (72 generated conversion pages)
- Ingredient search and cup-to-gram calculator
- Oven temperature converter and printable cheat sheet
- About, methodology, privacy, contact, and 12 guide pages
- Static output, sitemap, canonical URLs, and GitHub Actions verification

## Local development

Requires Node.js 22.

```sh
npm install
npm run dev
npm run verify
```

## Cloudflare deployment

- Current production origin: `https://cup-to-gram.hosi4242.workers.dev`
- Cloudflare account shows a Worker named `cup-to-gram` with an `ASSETS` binding.
- The latest deployment is managed through Wrangler; this is not currently listed as a Cloudflare Pages project in the connected account.
- Build command: `npm run build`
- Static output directory: `dist`
- Node version: `22`
- Keep AdSense disabled until the site owner configures the approved publisher ID and consent requirements.

Set `PUBLIC_SITE_URL` to the intended canonical production URL before changing the production origin. Update the site URL in `public/robots.txt` and `public/_headers` if the production URL changes.

## Important launch checklist

- The 12 published ingredient entries have source metadata and a recorded source-check date; keep the remaining 22 draft entries unpublished until their weights and references are checked.
- Re-check the published ingredient weights against their linked sources periodically. Source verification supports a practical estimate, not an exact universal weight.
- Review and expand the guide drafts with reliable references; they are initial editorial outlines, not finished long-form articles.
- Replace the placeholder contact email with an address controlled by the site owner.
- Ensure the lockfile is committed and current when dependencies change.
- Run `npm run verify` and review the generated 72 conversion pages before connecting a custom domain or enabling ads.
