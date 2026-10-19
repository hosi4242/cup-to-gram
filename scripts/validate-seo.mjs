import fs from 'node:fs';
import path from 'node:path';
import ingredients from '../src/data/ingredients.json' with { type: 'json' };
import { CONVERSIONS } from '../src/lib/conversions.mjs';

const outputDir = path.resolve('dist');
const siteUrl = (process.env.PUBLIC_SITE_URL || 'https://cup-to-gram.hosi4242.workers.dev').replace(/\/$/, '');
const errors = [];
const seenTitles = new Map();
const seenDescriptions = new Map();
const expectedPages = ingredients
  .filter((ingredient) => ingredient.status === 'live')
  .flatMap((ingredient) => CONVERSIONS.map((conversion) => ({
    ingredient,
    route: '/' + ingredient.slug + '/' + conversion.slug + '/',
    file: path.join(outputDir, ingredient.slug, conversion.slug, 'index.html'),
  })));

function getMeta(html, name) {
  const tagPattern = new RegExp('<meta\\s+name="' + name + '"\\s+content="([^"]*)"\\s*/?>', 'i');
  const reversedTagPattern = new RegExp('<meta\\s+content="([^"]*)"\\s+name="' + name + '"\\s*/?>', 'i');
  const match = html.match(tagPattern) || html.match(reversedTagPattern);
  return match?.[1]?.trim() ?? '';
}

function getTitle(html) {
  return html.match(new RegExp('<title>([\\s\\S]*?)</title>', 'i'))?.[1]?.trim() ?? '';
}

function getCanonical(html) {
  return html.match(new RegExp('<link\\s+rel="canonical"\\s+href="([^"]+)"\\s*/?>', 'i'))?.[1]?.trim() ?? '';
}

if (!fs.existsSync(outputDir)) {
  console.error('SEO validation failed: dist/ does not exist. Run the production build first.');
  process.exit(1);
}

const sitemapPath = path.join(outputDir, 'sitemap-0.xml');
const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : '';
if (!sitemap) errors.push('Generated sitemap-0.xml is missing or empty.');

for (const page of expectedPages) {
  if (!fs.existsSync(page.file)) {
    errors.push('Missing generated conversion page: ' + page.route);
    continue;
  }

  const html = fs.readFileSync(page.file, 'utf8');
  const title = getTitle(html);
  const description = getMeta(html, 'description');
  const canonical = getCanonical(html);
  const expectedCanonical = new URL(page.route, siteUrl + '/').href;
  const h1 = html.match(new RegExp('<h1(?:\\s[^>]*)?>([\\s\\S]*?)</h1>', 'i'))?.[1]?.replace(new RegExp('<[^>]+>', 'g'), ' ').replace(new RegExp('\\s+', 'g'), ' ').trim() ?? '';

  if (!title) errors.push('Missing title: ' + page.route);
  if (!description) errors.push('Missing meta description: ' + page.route);
  if (description.length > 160) errors.push('Meta description exceeds 160 characters (' + description.length + '): ' + page.route);
  if (!canonical) errors.push('Missing canonical URL: ' + page.route);
  else if (canonical !== expectedCanonical) errors.push('Canonical mismatch on ' + page.route + ': expected ' + expectedCanonical + ', got ' + canonical);
  if (!h1) errors.push('Missing H1: ' + page.route);
  if (!h1.toLowerCase().includes(page.ingredient.slug.replace(/-/g, ' ')) && !h1.toLowerCase().includes(page.ingredient.name.toLowerCase())) {
    errors.push('H1 does not clearly identify ' + page.ingredient.name + ': ' + page.route);
  }
  if (!sitemap.includes('<loc>' + expectedCanonical + '</loc>')) errors.push('Conversion page missing from sitemap: ' + page.route);

  if (title) {
    if (seenTitles.has(title)) errors.push('Duplicate title on ' + page.route + ' and ' + seenTitles.get(title) + ': ' + title);
    else seenTitles.set(title, page.route);
  }
  if (description) {
    if (seenDescriptions.has(description)) errors.push('Duplicate meta description on ' + page.route + ' and ' + seenDescriptions.get(description));
    else seenDescriptions.set(description, page.route);
  }
}

if (errors.length) {
  console.error('SEO validation failed with ' + errors.length + ' issue(s):');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('SEO validation passed: ' + expectedPages.length + ' generated conversion pages have unique titles and descriptions, self-referencing canonicals, H1 headings, and sitemap entries.');
