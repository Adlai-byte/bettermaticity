import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
// @ts-expect-error -- a plain .mjs build script, typed loosely on purpose
import { buildBarangayPaths } from '../../scripts/build-barangay-paths.mjs';
import works from '@data/awarded-civil-works.json';
import { procurementNotices } from './infrastructureData';
import {
  attributedCount,
  barangayFromLocation,
  barangayShapes,
  citywideCount,
  densityBin,
  mapRecords,
  mapViewBox,
  recordsByBarangay,
  totalCount,
} from './projectMap';

const MATI_DIST = join(__dirname, '../../../data/mati/dist');
const CSV = readFileSync(join(MATI_DIST, 'mati_barangays.csv'), 'utf8');
const csvCodes = CSV.trim()
  .split('\n')
  .slice(1)
  .map((line) => line.split(',')[0]);

describe('project map geometry', () => {
  it('draws all 26 barangays, keyed by the PSGC codes of the reference dataset', () => {
    expect(barangayShapes).toHaveLength(26);
    expect(barangayShapes.map((s) => s.psgc).sort()).toEqual([...csvCodes].sort());
    for (const s of barangayShapes) expect(s.d, s.name).toMatch(/^M[\d.,L]+Z/);
  });

  it('matches the boundary file it was generated from', () => {
    const geojson = JSON.parse(readFileSync(join(MATI_DIST, 'mati_barangays.geojson'), 'utf8'));
    const fresh = buildBarangayPaths(geojson);
    expect(fresh.viewBox).toBe(mapViewBox);
    expect(fresh.shapes).toEqual(barangayShapes);
  });
});

describe('project map records', () => {
  it('attributes records only to barangays that exist, and adds up', () => {
    const codes = new Set(barangayShapes.map((s) => s.psgc));
    for (const r of mapRecords) for (const b of r.barangays) expect(codes.has(b), r.id).toBe(true);
    expect(attributedCount + citywideCount).toBe(totalCount);
    expect(new Set(mapRecords.map((r) => r.id)).size).toBe(totalCount);
    const shaded = [...recordsByBarangay.values()].reduce((n, rs) => n + rs.length, 0);
    expect(shaded).toBeGreaterThanOrEqual(attributedCount);
  });

  it('counts a project listed both as a notice and as an awarded work once', () => {
    expect(mapRecords.some((r) => r.id === 'notice:11374254')).toBe(false);
    expect(
      mapRecords.filter((r) => /Potable Water Supply System at Barangay Badas/.test(r.title ?? ''))
    ).toHaveLength(1);
  });

  it('leaves goods and services purchases off the map', () => {
    const goods = procurementNotices.filter((n) => n.classification !== 'Civil Works');
    expect(goods.length).toBeGreaterThan(0);
    for (const n of goods)
      expect(mapRecords.some((r) => r.id === `notice:${n.reference}`)).toBe(false);
  });

  it('reads a barangay only from an exact "Barangay …" location', () => {
    expect(barangayFromLocation('Sitio Tagawisan, Barangay Badas, City of Mati')).toEqual([
      '1102509001',
    ]);
    expect(barangayFromLocation('City of Mati, Davao Oriental')).toEqual([]);
    expect(barangayFromLocation('Barangay Atlantis, City of Mati')).toEqual([]);
  });

  it('bins counts as none, 1, 2–3, 4–7 and 8 or more', () => {
    expect([0, 1, 2, 3, 4, 7, 8, 30].map(densityBin)).toEqual([0, 1, 2, 2, 3, 3, 4, 4]);
  });
});

describe('awarded civil works', () => {
  it('keeps each work sourced, dated and within its budget ceiling', () => {
    expect(new Set(works.works.map((w) => w.id)).size).toBe(works.works.length);
    for (const w of works.works) {
      expect(new URL(w.sourceUrl).hostname, w.id).toBe('fdpp.dilg.gov.ph');
      expect(w.sourceUrl, w.id).toContain(`id=${w.portalId}`);
      expect(w.biddingDate, w.id).toMatch(/^20\d{2}-\d{2}-\d{2}$/);
      expect(w.abc, w.id).toBeGreaterThan(0);
      if (w.bidAmount === null) expect('bidAmountAsPrinted' in w, w.id).toBe(true);
      else expect(w.bidAmount, w.id).toBeLessThanOrEqual(w.abc!);
    }
    const read = new Set(works.reports.filter((r) => r.status === 'read').map((r) => r.portalId));
    for (const w of works.works) expect(read.has(w.portalId), w.id).toBe(true);
  });
});
