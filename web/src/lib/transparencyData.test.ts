import { describe, expect, it } from 'vitest';
import {
  fdpDocumentTypes,
  fdpPortal,
  fdpRecords,
  officialDocuments,
  recordQuarter,
  recordYear,
} from './transparencyData';

// The 14 document types in the DILG Full Disclosure Policy portal's own filter.
const PORTAL_TYPES = [
  'Annual Budget Report',
  'Annual Gender and Development Accomplishment Report',
  'Annual Procurement Plan',
  'Statement of Indebtedness Payments and Balances',
  '20% of the National Tax Allotment Utilization',
  'Bid Results on Civil Works Good and Services and Consulting Services',
  'Local Disaster Risk Reduction and Management Fund Utilization',
  'Manpower Complement',
  'Statement of Receipts and Expenditures',
  'Trust Fund Utilization',
  'Quarterly Statement of Cash Flow',
  'Report of Special Education Fund Utilization',
  'Unliquidated Cash Advances',
  'Supplemental Procurement Plan',
];

const ISO = /^\d{4}-\d{2}-\d{2}$/;

describe('Full Disclosure archive', () => {
  it('describes exactly the portal’s 14 report types', () => {
    expect(fdpDocumentTypes.map((d) => d.name).sort()).toEqual([...PORTAL_TYPES].sort());
    for (const d of fdpDocumentTypes) expect(d.meaning.trim(), d.name).not.toBe('');
    expect(new URL(fdpPortal.url).hostname).toBe('fdpp.dilg.gov.ph');
  });

  it('keeps every record typed, sourced, dated and unique', () => {
    expect(fdpRecords.length).toBeGreaterThan(0);
    expect(new Set(fdpRecords.map((r) => r.url)).size).toBe(fdpRecords.length);
    for (const r of fdpRecords) {
      expect(PORTAL_TYPES, r.title).toContain(r.type);
      expect(r.checkedOn, r.title).toMatch(ISO);
      expect(r.period.trim(), r.title).not.toBe('');
      expect(r.title.trim(), r.url).not.toBe('');
      if (r.source === 'archive') {
        expect(r.url, r.title).toMatch(/^https:\/\/web\.archive\.org\/web\/\d{14}\/http/);
        expect(r.url, r.title).toContain(r.originalUrl);
        expect(r.archivedOn, r.title).toMatch(ISO);
        expect(r.pages, r.title).toBeGreaterThan(0);
      } else {
        expect(r.source).toBe('dilg-fdp-portal');
        expect(r.url).toBe(
          `https://fdpp.dilg.gov.ph/fdpp/report/document-download?id=${r.portalId}`
        );
        expect(['available', 'unavailable']).toContain(r.status);
        expect(recordYear(r.period), r.title).not.toBeNull();
        expect(r.postingPeriod.trim(), r.title).not.toBe('');
      }
    }
    const portalIds = fdpRecords.flatMap((r) =>
      r.source === 'dilg-fdp-portal' ? [r.portalId] : []
    );
    expect(new Set(portalIds).size).toBe(portalIds.length);
  });

  it('reads a year only when the period prints one', () => {
    expect(recordYear('Quarter ending March 2014')).toBe(2014);
    expect(recordYear('Not stated on the document')).toBeNull();
    expect(recordQuarter('QUARTER 3 • CY 2026')).toBe(3);
    expect(recordQuarter('CY 2026')).toBe(5);
  });
});

describe('official documents', () => {
  it('labels each document honestly and links only what opens', () => {
    expect(new Set(officialDocuments.map((d) => d.id)).size).toBe(officialDocuments.length);
    for (const d of officialDocuments) {
      expect(['current', 'archived', 'unavailable'], d.id).toContain(d.status);
      expect(d.checkedOn, d.id).toMatch(ISO);
      expect(d.note.trim(), d.id).not.toBe('');
      if (d.status === 'archived') {
        expect(d.archivedOn, d.id).toMatch(ISO);
        expect(d.url, d.id).toContain('web.archive.org');
      }
      for (const p of d.parts ?? []) expect(p.url, d.id).toContain('web.archive.org');
    }
  });
});
