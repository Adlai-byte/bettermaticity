// The City's awarded civil works (data/awarded-civil-works.json), from its quarterly Full
// Disclosure "Bid Results on Civil Works". A winning bid is not the final contract cost or
// actual spending.
import works from '@data/awarded-civil-works.json';
import paths from '@/lib/barangayPaths.json';

const nameByPsgc = new Map(paths.shapes.map((s) => [s.psgc, s.name]));

export interface AwardedWork {
  id: string;
  reference: string;
  name: string;
  location: string;
  barangays: string[];
  /** Barangay names for `barangays`, in the same order. */
  barangayNames: string[];
  abc: number | null;
  winningBidder: string;
  bidderAddress: string | null;
  bidAmount: number | null;
  /** The winning bid exactly as printed, when it can't be read as a number. */
  bidAmountAsPrinted?: string;
  biddingDate: string;
  period: string;
  portalId: number;
  sourceUrl: string;
  checkedOn: string;
}

export const awardedWorks: AwardedWork[] = works.works.map((w) => ({
  ...w,
  barangayNames: w.barangays.map((code) => nameByPsgc.get(code) ?? code),
}));

export const awardedReports = works.reports;
export const awardedCheckedOn = works.checkedOn;
