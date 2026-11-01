#!/usr/bin/env node
// Cebuano translation coverage report.
//
// Usage (from anywhere):
//   node scripts/i18n-report.mjs              human-readable report
//   node scripts/i18n-report.mjs --json       machine-readable report
//   node scripts/i18n-report.mjs --keys 3     missing keys for area 3
//   node scripts/i18n-report.mjs --keys gov   missing keys with prefix "gov-"
//
// Reads web/src/locales/en.json and ceb.json. Keys are flat kebab-case; the
// first "-" segment is the prefix. Always exits 0: this is a report, not a gate.

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const loadJson = (p) => JSON.parse(readFileSync(resolve(root, p), 'utf8'));

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const flagValue = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const en = loadJson(flagValue('--en') ?? 'web/src/locales/en.json');
const ceb = loadJson(flagValue('--ceb') ?? 'web/src/locales/ceb.json');

// Areas follow the order in "Workstream A: Cebuano & content", task 3.
// Single-word keys (ok, cancel, menu, ...) count as site chrome.
// Anything unmapped falls into area 6 and is listed under "Unmapped prefixes".
const AREAS = [
  {
    id: 1,
    name: 'Site chrome',
    prefixes: [
      'nav',
      'footer',
      'header',
      'dropdown',
      'label',
      'section',
      'pager',
      'social',
      'common',
      'btn',
    ],
  },
  {
    id: 2,
    name: 'Services & guides',
    prefixes: [
      'services',
      'svc',
      'cat',
      'life',
      'service',
      'cert',
      'biz',
      'tax',
      'health',
      'agri',
      'edu',
      'env',
      'safety',
      'infra',
      'report',
    ],
  },
  {
    id: 3,
    name: 'Government, offices, contact, links, legislation',
    prefixes: [
      'gov',
      'officials',
      'mswdo',
      'contact',
      'links',
      'leg',
      'ord',
      'reso',
      'hotline',
      'offices',
    ],
  },
  {
    id: 4,
    name: 'Transparency',
    prefixes: [
      'transparency',
      'trans',
      'finance',
      'budget',
      'projects',
      'fdp',
      'docs',
      'sources',
      'method',
    ],
  },
  {
    id: 5,
    name: 'About, FAQ, search, site index',
    prefixes: ['about', 'faq', 'search', 'sitemap', 'changelog', 'news'],
  },
  {
    id: 6,
    name: 'Visit Mati, statistics, Home, other',
    prefixes: [
      'visit',
      'attraction',
      'stats',
      'home',
      'weather',
      'tricycle',
      'notfound',
      'offline',
      'rising',
    ],
  },
  {
    id: 7,
    name: 'Privacy, terms, accessibility',
    prefixes: ['privacy', 'terms', 'a11y', 'access'],
  },
];
const OTHER_AREA = 6;
const CHROME_AREA = 1;

// Proper names and tokens that are legitimately identical in both languages.
const SAME_OK = new Set([
  'CSWDO',
  'PESO',
  'BPLS',
  'PhilGEPS',
  'ABC',
  'BESF',
  'BetterMati',
  'Mati',
  'OK',
  'FAQ',
  'PDF',
  'Email',
  'Facebook',
]);

const prefixToArea = new Map(AREAS.flatMap((a) => a.prefixes.map((p) => [p, a.id])));
const unmapped = new Set();

const prefixOf = (key) => key.split('-')[0];
function areaOf(key) {
  if (!key.includes('-')) return CHROME_AREA;
  const p = prefixOf(key);
  if (prefixToArea.has(p)) return prefixToArea.get(p);
  unmapped.add(p);
  return OTHER_AREA;
}

const VAR_RE = /\{\{\s*([\w.]+)[^}]*\}\}/g;
const varsOf = (s) => new Set([...String(s).matchAll(VAR_RE)].map((m) => m[1]));
// Plain whitespace token count (same method as the Workstream A doc figures).
const countWords = (s) => String(s).split(/\s+/).filter(Boolean).length;
const isBlank = (v) => v === undefined || v === null || String(v).trim() === '';
const hasLetters = (s) => /\p{L}/u.test(String(s));

const missing = [];
const identical = [];
const varMismatch = [];
const pluralGaps = [];
const orphans = Object.keys(ceb).filter((k) => !(k in en));

for (const [key, enVal] of Object.entries(en)) {
  const cebVal = ceb[key];
  if (isBlank(cebVal)) {
    missing.push({
      key,
      en: enVal,
      words: countWords(enVal),
      area: areaOf(key),
      prefix: prefixOf(key),
    });
    continue;
  }
  if (cebVal === enVal && hasLetters(enVal) && !SAME_OK.has(String(enVal).trim())) {
    identical.push({ key, value: enVal });
  }
  const a = varsOf(enVal);
  const b = varsOf(cebVal);
  const lost = [...a].filter((v) => !b.has(v));
  const extra = [...b].filter((v) => !a.has(v));
  if (lost.length || extra.length) varMismatch.push({ key, missing: lost, extra });
}

for (const key of Object.keys(en)) {
  const m = key.match(/^(.*)_(one|other)$/);
  if (!m) continue;
  const twin = `${m[1]}_${m[2] === 'one' ? 'other' : 'one'}`;
  if (!(twin in en)) continue;
  if (!isBlank(ceb[key]) && isBlank(ceb[twin])) pluralGaps.push({ key: twin, translatedTwin: key });
}

const totalKeys = Object.keys(en).length;
const totalWords = missing.reduce((s, m) => s + m.words, 0);

const areaRows = AREAS.map((a) => {
  const keys = Object.keys(en).filter((k) => areaOf(k) === a.id);
  const miss = missing.filter((m) => m.area === a.id);
  return {
    id: a.id,
    name: a.name,
    total: keys.length,
    missing: miss.length,
    words: miss.reduce((s, m) => s + m.words, 0),
    done: keys.length ? Math.round(((keys.length - miss.length) / keys.length) * 100) : 100,
  };
});

const prefixRows = Object.values(
  missing.reduce((acc, m) => {
    const p = m.key.includes('-') ? m.prefix : '(single-word)';
    acc[p] ??= { prefix: p, area: m.area, missing: 0, words: 0 };
    acc[p].missing += 1;
    acc[p].words += m.words;
    return acc;
  }, {})
).sort((x, y) => y.missing - x.missing);

// --keys <area#|prefix>
const keysArg = flagValue('--keys');
if (keysArg !== undefined) {
  const byArea = /^\d+$/.test(keysArg);
  const list = missing.filter((m) =>
    byArea ? m.area === Number(keysArg) : m.prefix === keysArg.replace(/-$/, '')
  );
  if (flag('--json')) {
    console.log(JSON.stringify(list, null, 2));
  } else {
    for (const m of list) console.log(`${m.key}\t${m.en}`);
    console.error(
      `\n${list.length} missing strings, ${list.reduce((s, m) => s + m.words, 0)} words`
    );
  }
  process.exit(0);
}

if (flag('--json')) {
  console.log(
    JSON.stringify(
      {
        totals: {
          enKeys: totalKeys,
          cebKeys: Object.keys(ceb).length,
          translated: totalKeys - missing.length,
          missing: missing.length,
          missingWords: totalWords,
        },
        areas: areaRows,
        prefixes: prefixRows,
        unmappedPrefixes: [...unmapped].sort(),
        warnings: { identical, variableMismatch: varMismatch, pluralGaps, orphans },
      },
      null,
      2
    )
  );
  process.exit(0);
}

const pad = (s, n) => String(s).padEnd(n);
const lpad = (s, n) => String(s).padStart(n);
const out = [];
out.push('Cebuano translation coverage', '');
out.push(
  `${pad('#', 3)}${pad('Area', 50)}${lpad('Missing', 8)}${lpad('Words', 8)}${lpad('Done', 7)}`
);
for (const r of areaRows) {
  out.push(
    `${pad(r.id, 3)}${pad(r.name, 50)}${lpad(r.missing, 8)}${lpad(r.words, 8)}${lpad(r.done + '%', 7)}`
  );
}
out.push('', 'Top prefixes (missing):');
for (const r of prefixRows.slice(0, 20)) {
  out.push(
    `  ${pad(r.prefix, 16)}area ${r.area}${lpad(r.missing, 6)} strings${lpad(r.words, 7)} words`
  );
}
if (prefixRows.length > 20) out.push(`  ... ${prefixRows.length - 20} more (use --json)`);
if (unmapped.size)
  out.push(
    '',
    `Unmapped prefixes (counted in area ${OTHER_AREA}): ${[...unmapped].sort().join(', ')}`
  );

const section = (title, items, fmt) => {
  out.push('', `${title}: ${items.length}`);
  for (const it of items.slice(0, 25)) out.push(`  ${fmt(it)}`);
  if (items.length > 25) out.push(`  ... ${items.length - 25} more (use --json)`);
};
section('Identical to English (likely untranslated)', identical, (i) => `${i.key}  "${i.value}"`);
section(
  'Variable mismatch',
  varMismatch,
  (v) => `${v.key}  missing: ${v.missing.join(', ') || '-'}  extra: ${v.extra.join(', ') || '-'}`
);
section(
  'Plural gaps (one form translated, other missing)',
  pluralGaps,
  (p) => `${p.key}  (has ${p.translatedTwin})`
);
section('Orphans (in ceb.json, not in en.json)', orphans, (k) => k);

out.push(
  '',
  `Total: ${totalKeys - missing.length} of ${totalKeys} translated. ${missing.length} missing strings, ${totalWords} words.`
);
console.log(out.join('\n'));
