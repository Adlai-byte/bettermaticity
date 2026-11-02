import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { attractions, coasts, getPhoto, photos, sambuokan } from './tourismData';

// Repo root; the photos are served from assets/ as a static passthrough.
const ROOT = join(__dirname, '../../..');

/** Width and height of a lossy (VP8) or extended (VP8X) WebP file. */
function webpSize(path: string) {
  const b = readFileSync(path);
  const chunk = b.toString('ascii', 12, 16);
  if (chunk === 'VP8X') return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
  if (chunk === 'VP8 ')
    return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
  throw new Error(`${path}: unexpected WebP chunk ${chunk}`);
}

describe('Visit Mati photos', () => {
  it('ships every photo at the size it states, plus an 800 px version', () => {
    for (const p of photos) {
      expect(existsSync(join(ROOT, p.src)), p.src).toBe(true);
      expect(webpSize(join(ROOT, p.src)), p.src).toEqual({ width: p.width, height: p.height });
      expect(existsSync(join(ROOT, p.srcSmall)), p.srcSmall).toBe(true);
      expect(webpSize(join(ROOT, p.srcSmall)).width, p.srcSmall).toBe(800);
    }
  });

  it('only refers to photos that exist, and uses every photo it lists', () => {
    const ids = photos.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    // Home's three Visit Mati cards name their photos in the page source.
    const home = readFileSync(join(ROOT, 'web/src/pages/Home.tsx'), 'utf8');
    const homeIds = [...home.matchAll(/photo: '([a-z0-9-]+)'/g)].map((m) => m[1]);
    expect(homeIds.length).toBe(3);
    const used = [
      ...attractions.map((a) => a.photo),
      ...coasts.map((c) => c.photo),
      sambuokan.photo,
      ...homeIds,
    ].filter((id): id is string => Boolean(id));
    for (const id of used) expect(getPhoto(id), id).toBeTruthy();
    for (const id of ids) expect(used, id).toContain(id);
  });

  it('credits each photo to who published it, with a source to check', () => {
    for (const p of photos) {
      expect(p.alt.length, p.id).toBeGreaterThan(20);
      expect(p.by, p.id).toBeTruthy();
      expect(p.sources.length, p.id).toBeGreaterThan(0);
      for (const s of p.sources) expect(s.url, p.id).toMatch(/^https?:\/\//);

      if (p.license) {
        // Creative Commons photos link their license and their Commons page.
        expect(p.licenseUrl, p.id).toMatch(/^https:\/\/creativecommons\.org\/licenses\//);
        expect(p.sources[0].url, p.id).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
      } else {
        // Unlicensed photos must come from a Philippine government office's own site.
        expect(p.sources[0].url, p.id).toMatch(/\.gov\.ph\//);
      }
    }
  });

  it('cites the City’s compromised website only through archived copies', () => {
    for (const p of photos) {
      for (const url of [...p.sources.map((s) => s.url), p.file ?? '']) {
        if (url.includes('mati.gov.ph'))
          expect(url, p.id).toMatch(/^https:\/\/web\.archive\.org\//);
      }
    }
  });
});
