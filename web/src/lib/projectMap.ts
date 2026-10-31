// Records behind the project map: one per distinct project, each attributed to the barangays
// its own source names. Shading counts records, not money or construction sites. Goods and
// services purchases are left out: they are not projects with a place.
import works from '@data/awarded-civil-works.json';
import reports from '@data/rising-projects.json';
import paths from '@/lib/barangayPaths.json';
import { procurementNotices } from '@/lib/infrastructureData';

export interface BarangayShape {
  psgc: string;
  name: string;
  d: string;
}

export const mapViewBox: string = paths.viewBox;
export const barangayShapes: BarangayShape[] = paths.shapes;
const psgcByName = new Map(barangayShapes.map((s) => [s.name, s.psgc]));

export type MapRecordKind = 'awarded' | 'notice' | 'project';

export interface MapRecord {
  id: string;
  kind: MapRecordKind;
  /** Printed title, or an i18n key when `titleKey` is set. */
  title?: string;
  titleKey?: string;
  year: number;
  amount: number | null;
  /** i18n key for what the amount is (winning bid, ceiling, appropriation…). */
  amountKey: string;
  barangays: string[];
  sourceLabel: string;
  sourceUrl: string;
}

/** PSGC code of the barangay named in a notice's location ("…, Barangay Badas, …"), if any. */
export function barangayFromLocation(location: string): string[] {
  const m = location.match(/\bBarangay ([^,]+)/);
  const code = m ? psgcByName.get(m[1].trim()) : undefined;
  return code ? [code] : [];
}

const awarded: MapRecord[] = works.works.map((w) => ({
  id: `awarded:${w.id}`,
  kind: 'awarded',
  title: w.name,
  year: Number(w.biddingDate.slice(0, 4)),
  amount: w.bidAmount,
  amountKey: 'map-amount-bid',
  barangays: w.barangays,
  sourceLabel: `City of Mati · Bid Results on Civil Works, ${w.period}`,
  sourceUrl: w.sourceUrl,
}));

// A notice already counted as an awarded work (sameAs) is not counted again.
const counted = new Set(works.works.flatMap((w) => ('sameAs' in w && w.sameAs ? [w.sameAs] : [])));
const notices: MapRecord[] = procurementNotices
  .filter((n) => n.classification === 'Civil Works' && !counted.has(`philgeps:${n.reference}`))
  .map((n) => ({
    id: `notice:${n.reference}`,
    kind: 'notice',
    title: n.name,
    year: Number((n.updatedOn ?? n.publishedOn).slice(0, 4)),
    amount: n.abc,
    amountKey: 'map-amount-abc',
    barangays: barangayFromLocation(n.location),
    sourceLabel: `${n.sourceName} · ${n.reference}`,
    sourceUrl: n.sourceUrl,
  }));

const projects: MapRecord[] = reports.projects.map((p) => ({
  id: `project:${p.id}`,
  kind: 'project',
  titleKey: p.titleKey,
  year: Number(p.sourceDate.slice(0, 4)),
  amount: p.amount,
  amountKey: `rising-amount-${p.amountKind}`,
  barangays: 'barangays' in p && p.barangays ? p.barangays : [],
  sourceLabel: p.sources[0].label,
  sourceUrl: p.sources[0].url,
}));

/** Newest first. */
export const mapRecords: MapRecord[] = [...awarded, ...notices, ...projects].sort(
  (a, b) => b.year - a.year
);

export const recordsByBarangay = new Map<string, MapRecord[]>(
  barangayShapes.map((s) => [s.psgc, mapRecords.filter((r) => r.barangays.includes(s.psgc))])
);
export const totalCount = mapRecords.length;
export const attributedCount = mapRecords.filter((r) => r.barangays.length > 0).length;
export const citywideCount = totalCount - attributedCount;
export const barangaysWithRecords = [...recordsByBarangay.values()].filter((r) => r.length).length;

/** Shading bins: none, 1, 2–3, 4–7, 8 or more. */
export const DENSITY_BINS = [
  { min: 0, label: '0' },
  { min: 1, label: '1' },
  { min: 2, label: '2–3' },
  { min: 4, label: '4–7' },
  { min: 8, label: '8+' },
] as const;

export function densityBin(count: number): number {
  let bin = 0;
  DENSITY_BINS.forEach((b, i) => {
    if (count >= b.min) bin = i;
  });
  return bin;
}

/** The Bid Results postings read, and those the portal could not serve. */
export const bidReports = works.reports;
export const worksCheckedOn = works.checkedOn;
