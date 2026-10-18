# CupToGram

English-first cooking measurement conversion website built with Astro and deployed to Cloudflare Pages.

## Current scope

- 34 ingredient records: 12 initial live pages and 22 draft records
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

## Cloudflare Pages

- Connect this GitHub repository: `hosi4242/cup-to-gram`
- Production branch: `main`
- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`
- Node version: `22`
- Keep AdSense disabled until the site owner configures the approved publisher ID and consent requirements.

Set `PUBLIC_SITE_URL` to the intended canonical production URL before launch. Update the site URL in `public/robots.txt` and `public/_headers` if the production URL changes.

## Important launch checklist

- All initial ingredient weights are provisional (`verified: false`) and require source verification before launch.
- Review and expand the guide drafts with reliable references; they are initial editorial outlines, not finished long-form articles.
- Replace the placeholder contact email with an address controlled by the site owner.
- Generate and commit `package-lock.json` after installing the pinned dependencies.
- Run `npm run verify` and review the generated 72 conversion pages before connecting a custom domain or enabling ads.
