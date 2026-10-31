import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { isMigratedRoute } from '@/lib/migratedRoutes';
import { SOURCE_STATUSES, allDatasets } from './sourceRegistry';

const DATA_DIR = join(__dirname, '../../../data');

// Every feed in data/ is either described by a registry entry or deliberately left
// off the site. A new feed fails this test until it is added to one of the two.
const FEED_TO_DATASET: Record<string, string> = {
  'emergency-hotlines.json': 'hotlines',
  'officials.json': 'officials',
  'ordinances.json': 'legislation',
  'resolutions.json': 'legislation',
  'fiscal_transparency.json': 'city-finances',
  'dpwh-projects.json': 'procurement',
  'local-procurement.json': 'procurement',
  'rising-projects.json': 'projects',
  'services.json': 'services',
  'service-references.json': 'services',
  'tourism.json': 'tourism',
  'full-disclosure.json': 'full-disclosure',
  'official-documents.json': 'documents',
  'official-links.json': 'official-links',
  'city-offices.json': 'offices',
  'awarded-civil-works.json': 'awarded-civil-works',
};
const NOT_ON_SITE = new Set([
  'changelog.json', // the site's own release notes, not public data
  'news.json', // listed under "not published" while it is empty
  'competitive-index.json', // template values, deliberately unused
  'demographics.json', // template values, deliberately unused
]);

describe('source registry', () => {
  it('covers every data feed', () => {
    const feeds = readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'));
    const ids = new Set(allDatasets.map((d) => d.id));
    for (const feed of feeds) {
      if (NOT_ON_SITE.has(feed)) continue;
      expect(FEED_TO_DATASET[feed], `${feed} has no registry entry`).toBeDefined();
      expect(ids.has(FEED_TO_DATASET[feed]), feed).toBe(true);
    }
  });

  it('keeps each entry honest about its status', () => {
    const ids = allDatasets.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const d of allDatasets) {
      expect(SOURCE_STATUSES, d.id).toContain(d.status);
      expect(isMigratedRoute(d.page.to.split('#')[0]), d.id).toBe(true);
      if (d.status === 'verified' || d.status === 'sourced') {
        expect(d.sources.length, `${d.id} needs a source link`).toBeGreaterThan(0);
        expect(d.checkedOn, `${d.id} needs a check date`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
      if (d.status !== 'verified') expect(d.downloads, `${d.id} offers downloads`).toBeUndefined();
      if (d.status === 'draft') expect(d.confirmWith, d.id).toBeTruthy();
      for (const dl of d.downloads ?? [])
        expect(existsSync(join(DATA_DIR, dl.href.replace(/^\/data\//, ''))), dl.href).toBe(true);
    }
  });
});
