import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync(new URL('../src/data/ingredients.json', import.meta.url), 'utf8'));
const errors = [];
const slugs = new Set();

for (const item of data) {
  if (slugs.has(item.slug)) errors.push('Duplicate slug: ' + item.slug);
  slugs.add(item.slug);

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(item.slug)) errors.push('Invalid slug: ' + item.slug);
  if (!item.name || !item.category || !Number.isFinite(item.gPerCup) || item.gPerCup < 10 || item.gPerCup > 400) {
    errors.push('Invalid required data: ' + item.slug);
  }
  if (!Array.isArray(item.faq) || item.faq.length < 2) errors.push('FAQ missing: ' + item.slug);
  if (!item.note || item.note.length < 80) errors.push('Note too short: ' + item.slug);
  if (!Array.isArray(item.related) || item.related.length < 3) errors.push('Related items missing: ' + item.slug);

  if (item.status === 'live') {
    if (item.verified !== true) errors.push('Live ingredient is not verified: ' + item.slug);
    if (!item.sourceName || !item.sourceUrl || !/^https:\/\//.test(item.sourceUrl) || !item.sourceChecked) {
      errors.push('Live ingredient is missing a valid source or review date: ' + item.slug);
    }
  }
}

for (const item of data) {
  for (const slug of item.related) {
    if (!slugs.has(slug)) errors.push('Unknown related ' + slug + ' on ' + item.slug);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Ingredient data validated: ' + data.length + ' ingredients; ' + data.filter(item => item.status === 'live').length + ' live.');
