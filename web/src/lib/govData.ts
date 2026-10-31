import officialsJson from '@data/officials.json';
import resolutionsJson from '@data/resolutions.json';
import ordinancesJson from '@data/ordinances.json';

/**
 * Build-time reference data. These JSON files are imported (not fetched), so the
 * values are baked into the prerendered HTML and are crawlable. Content is
 * legislative records distinguish government reporting from signed full texts.
 */

export interface Official {
  name: string;
  title: string;
  image?: string;
  email?: string;
  phone?: string;
  tel?: string;
  hours?: string;
}

export interface OfficialsData {
  mayor?: Official;
  vice_mayor?: Official;
  councilors?: Official[];
  _status?: string;
  _checkedOn?: string;
  _note?: string;
  _sources?: { title: string; url: string; originalUrl?: string }[];
}

export interface LegislativeRecord {
  year: number;
  summaryKey: string;
  issuingBody: string;
  officialTitle: string | null;
  sessionDate: string | null;
  fullTextUrl: string | null;
  verificationStatus: 'government-report-reference';
  sourceUrl: string;
  sourceTitle: string;
  sourcePublisher: string;
  checkedOn: string;
  historical?: boolean;
}

export interface Resolution extends LegislativeRecord {
  resolutionNo: string;
}

export interface Ordinance extends LegislativeRecord {
  ordinanceNo: string;
}

export const officials = officialsJson as OfficialsData;

export const resolutions: Resolution[] =
  (resolutionsJson as { resolutions?: Resolution[] }).resolutions ?? [];

export const ordinances: Ordinance[] =
  (ordinancesJson as { ordinances?: Ordinance[] }).ordinances ?? [];

/** True when the dataset is still flagged as placeholder/draft. */
export const officialsAreDraft = officials._status === 'draft';

/** Extract the year from a resolution/ordinance number like "246-2025-11" -> 2025. */

/** "2025-01-06" -> "January 6, 2025" (stable, locale-independent for SSG). */
export function formatSessionDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const month = months[Number(m[2]) - 1];
  return month ? `${month} ${Number(m[3])}, ${m[1]}` : iso;
}
