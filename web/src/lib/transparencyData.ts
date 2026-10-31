// Typed access to the Full Disclosure reports and the official documents index
// (repo-root data/full-disclosure.json and data/official-documents.json). Archived records
// were opened and checked one by one; portal records are the City's postings as listed on
// the DILG Full Disclosure Policy portal, each download link tried on checkedOn.
import fdp from '@data/full-disclosure.json';
import docs from '@data/official-documents.json';

interface FdpRecordBase {
  type: string;
  title: string;
  period: string;
  issuer: string;
  url: string;
  checkedOn: string;
}

/** An Internet Archive copy of a file the City once posted on mati.gov.ph. */
export interface FdpArchivedRecord extends FdpRecordBase {
  source: 'archive';
  originalUrl: string;
  archivedOn: string;
  pages: number;
}

/** A posting on the DILG Full Disclosure Policy portal. `unavailable` means the portal's
 *  download link returned a server error when checked. */
export interface FdpPortalRecord extends FdpRecordBase {
  source: 'dilg-fdp-portal';
  portalId: number;
  postingPeriod: string;
  status: 'available' | 'unavailable';
  /** The City's own note on where it posted the printed report. */
  postedAt: string;
}

export type FdpRecord = FdpArchivedRecord | FdpPortalRecord;

export interface FdpDocumentType {
  name: string;
  meaning: string;
}

export type DocumentStatus = 'current' | 'archived' | 'unavailable';

export interface OfficialDocument {
  id: string;
  title: string;
  type: string;
  issuer: string;
  edition: string;
  status: DocumentStatus;
  url: string;
  originalUrl?: string;
  archivedOn?: string;
  pages?: number;
  parts?: { label: string; url: string; pages: number }[];
  note: string;
  checkedOn: string;
}

export const fdpPortal = fdp.portal;
export const fdpCheckedOn = fdp.checkedOn;
export const fdpDocumentTypes: FdpDocumentType[] = fdp.documentTypes;
export const fdpRecords = fdp.records as FdpRecord[];

/** The first four-digit year printed in a period, or null ("Not stated on the document"). */
export function recordYear(period: string): number | null {
  const m = period.match(/\b(19|20)\d{2}\b/);
  return m ? Number(m[0]) : null;
}

/** Sort key within a year: the quarter printed in a period (1–4), 5 for a whole year. */
export function recordQuarter(period: string): number {
  const m = period.match(/quarter\s*([1-4])|\bQ([1-4])\b/i);
  return m ? Number(m[1] ?? m[2]) : 5;
}

export const officialDocuments = docs.documents as OfficialDocument[];
export const documentsCheckedOn = docs.checkedOn;
