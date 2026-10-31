// The public source registry behind /transparency/sources: one entry per dataset the site shows,
// with who stands behind it, what it covers, when it was checked and how far it can be
// trusted. Counts, dates and links are read from the same data modules the pages use,
// so the registry cannot drift from what is published. Entry text is English, like the
// data feeds themselves.
import ordinancesFeed from '@data/ordinances.json';
import { officials, ordinances, resolutions } from '@/lib/govData';
import { cityOfficeCount, cityOfficesCheckedOn, cityOfficesSource } from '@/lib/govDirectory';
import { officialLinks, officialLinksCheckedOn } from '@/lib/officialLinks';
import { allHotlines, hotlineProvenance } from '@/lib/hotlines';
import {
  barangayCount,
  historicalData,
  povertyStats,
  statisticsCheckedOn,
  statisticsSources,
  totalPopulation,
} from '@/lib/statsData';
import { currentYear, fiscalSource, fiscalYears, specialFunds } from '@/lib/budgetData';
import { procurementCheckedOn, procurementNotices } from '@/lib/infrastructureData';
import { projectsCheckedOn, risingProjects } from '@/lib/risingProjects';
import awardedWorks from '@data/awarded-civil-works.json';
import { services } from '@/lib/services';
import { serviceGuides, serviceReferences, serviceReviewDate } from '@/lib/serviceReferences';
import { attractions } from '@/lib/tourismData';
import {
  documentsCheckedOn,
  fdpCheckedOn,
  fdpPortal,
  fdpRecords,
  officialDocuments,
  recordYear,
} from '@/lib/transparencyData';

/**
 * - verified: transcribed from an official primary source and checked against it.
 * - sourced: copied from an official source, but not yet confirmed by the City.
 * - partial: a selection, or based on secondary reporting; a starting point only.
 * - draft: placeholder content awaiting official data.
 */
export type SourceStatus = 'verified' | 'sourced' | 'partial' | 'draft';

export const SOURCE_STATUSES: SourceStatus[] = ['verified', 'sourced', 'partial', 'draft'];

export interface RegistryLink {
  label: string;
  url: string;
}

export interface Dataset {
  id: string;
  title: string;
  count: number;
  unit: string;
  summary: string;
  coverage: string;
  publisher: string;
  period: string;
  /** ISO date of the last check against the source; null when never checked. */
  checkedOn: string | null;
  status: SourceStatus;
  /** Where the data appears on BetterMati.org. */
  page: { to: string; label: string };
  sources: RegistryLink[];
  /** Raw files under /data/ readers may download (verified datasets only). */
  downloads?: { label: string; href: string }[];
  /** The office that can confirm or supply the missing pieces. */
  confirmWith?: string;
}

export interface DatasetGroup {
  id: string;
  title: string;
  summary: string;
  datasets: Dataset[];
}

const unique = (links: RegistryLink[]) =>
  links.filter((l, i) => links.findIndex((m) => m.url === l.url) === i);

const officialsCount =
  (officials.mayor ? 1 : 0) + (officials.vice_mayor ? 1 : 0) + (officials.councilors?.length ?? 0);
const legislation = [...ordinances, ...resolutions];
const legislationYears = legislation.map((r) => r.year).sort();
const noticeDates = procurementNotices
  .map((n) => n.publishedOn)
  .filter((d): d is string => Boolean(d))
  .sort();
const guideCount = Object.keys(serviceGuides).length;
const referenceCount = Object.keys(serviceReferences).length;
const fdpYears = fdpRecords
  .map((r) => recordYear(r.period))
  .filter((y): y is number => y !== null)
  .sort();

export const sourceGroups: DatasetGroup[] = [
  {
    id: 'government',
    title: 'Government and legislation',
    summary: 'Officials, City offices, legislation and the numbers people call.',
    datasets: [
      {
        id: 'hotlines',
        title: 'Emergency hotlines',
        count: allHotlines.length + 1,
        unit: 'hotlines',
        summary:
          'Emergency and medical numbers shown in the top bar, on the Contact page and on the offline page, plus the national 911.',
        coverage:
          'Copied digit for digit from the CDRRMO’s published hotline graphic. No City official has approved the list yet, and the numbers have not been test-called.',
        publisher: hotlineProvenance.source,
        period: 'As published by the CDRRMO',
        checkedOn: hotlineProvenance.verifiedOn,
        status: 'sourced',
        page: { to: '/contact#hotlines', label: 'Contact: hotline directory' },
        sources: [{ label: hotlineProvenance.sourceTitle, url: hotlineProvenance.sourceUrl }],
        confirmWith: 'CDRRMO',
      },
      {
        id: 'officials',
        title: 'Elected officials',
        count: officialsCount,
        unit: 'officials',
        summary:
          'Names and positions of the Mayor, Vice Mayor and City Councilors for the 2025–2028 term.',
        coverage:
          'Full names copied from the City Government’s own website, in the order it lists the councilors, and cited through Internet Archive copies because the live site currently loads unrelated outside content. The City does not publish photos or office contacts for officials there, so none are shown.',
        publisher: 'City Government of Mati',
        period: '2025–2028 term (8th Sangguniang Panlungsod)',
        checkedOn: officials._checkedOn ?? null,
        status: 'verified',
        page: { to: '/government/officials', label: 'Elected officials' },
        sources: (officials._sources ?? []).map((s) => ({ label: s.title, url: s.url })),
        downloads: [{ label: 'officials.json', href: '/data/officials.json' }],
        confirmWith: "City Mayor's Office (photos and contacts)",
      },
      {
        id: 'legislation',
        title: 'Ordinances and resolutions',
        count: legislation.length,
        unit: 'records',
        summary: 'Measures of the Sangguniang Panlungsod of Mati that the site can point to.',
        coverage: `${ordinances.length} ordinance${ordinances.length === 1 ? '' : 's'} and ${resolutions.length} resolution${resolutions.length === 1 ? '' : 's'} found in news reports. This is not a register: signed texts, exact titles and session dates are not yet verified.`,
        publisher: 'Philippine News Agency (secondary reporting)',
        period: `${legislationYears[0]}–${legislationYears[legislationYears.length - 1]}`,
        checkedOn: ordinancesFeed._checkedOn,
        status: 'partial',
        page: { to: '/legislative', label: 'Legislative documents' },
        sources: unique(legislation.map((r) => ({ label: r.sourceTitle, url: r.sourceUrl }))),
        confirmWith: 'Sangguniang Panlungsod Secretariat',
      },
      {
        id: 'offices',
        title: 'City offices',
        count: cityOfficeCount,
        unit: 'offices',
        summary:
          'The City’s departments and offices as the City groups them, with links to the related service pages.',
        coverage:
          'Names and groups copied from the City’s Departments and Offices page (cited through an Internet Archive copy; the live page matched when checked). The City publishes no heads, phone numbers or emails for them; only the CDRRMO’s number is shown, from its own hotline list.',
        publisher: 'City Government of Mati',
        period: 'As listed on the City website',
        checkedOn: cityOfficesCheckedOn,
        status: 'sourced',
        page: { to: '/government/offices', label: 'City offices' },
        sources: [{ label: cityOfficesSource.title, url: cityOfficesSource.url }],
        confirmWith: 'City Human Resource Management and Development Office (heads and contacts)',
      },
      {
        id: 'official-links',
        title: 'Official links',
        count: officialLinks.length,
        unit: 'links',
        summary:
          'The City’s websites, online services and social media, and national portals that cover Mati.',
        coverage:
          'Only links that opened when checked. City social media is listed only when the City’s own website links to it.',
        publisher: 'City Government of Mati; national agencies',
        period: 'Current destinations',
        checkedOn: officialLinksCheckedOn,
        status: 'verified',
        page: { to: '/government/links', label: 'Official links' },
        sources: officialLinks.map((l) => ({ label: l.name, url: l.url })),
        downloads: [{ label: 'official-links.json', href: '/data/official-links.json' }],
      },
      {
        id: 'city-hall-contacts',
        title: 'City Hall contact channels',
        count: 3,
        unit: 'channels',
        summary: 'The email, mobile and landline shown on the Contact page.',
        coverage:
          'Carried over from the template the site was built on. They are not the City’s confirmed channels; the Contact page says so beside them.',
        publisher: 'Not yet sourced',
        period: '—',
        checkedOn: null,
        status: 'draft',
        page: { to: '/contact', label: 'Contact' },
        sources: [],
        confirmWith: 'City Information Office',
      },
    ],
  },
  {
    id: 'community',
    title: 'Population and community',
    summary: 'Official census counts and poverty estimates for the city and its barangays.',
    datasets: [
      {
        id: 'barangays',
        title: 'Barangays and population',
        count: barangayCount,
        unit: 'barangays',
        summary: `Names, PSGC codes and 2024 populations of every barangay, totalling ${totalPopulation.toLocaleString('en-PH')} residents.`,
        coverage:
          'Counts are the 2024 census (POPCEN). Barangay land areas are left out because the boundary data available overstates them. The project map draws barangay boundaries from faeldon/philippines-json-maps (PSGC 2023); they are approximate.',
        publisher: 'Philippine Statistics Authority',
        period: '2024 POPCEN',
        checkedOn: statisticsCheckedOn,
        status: 'verified',
        page: { to: '/government/barangays', label: 'Barangays' },
        sources: [{ label: statisticsSources.psgc.title, url: statisticsSources.psgc.url }],
      },
      {
        id: 'population-history',
        title: 'Population over time',
        count: historicalData.years.length,
        unit: 'census counts',
        summary: `City population at each census from ${historicalData.years[0]} to ${historicalData.years[historicalData.years.length - 1]}, with land area for density.`,
        coverage:
          'Census counts only; there are no estimates between censuses. Density uses the PSA’s 2013 land area for the city.',
        publisher: 'Philippine Statistics Authority',
        period: `${historicalData.years[0]}–${historicalData.years[historicalData.years.length - 1]}`,
        checkedOn: statisticsCheckedOn,
        status: 'verified',
        page: { to: '/statistics', label: 'City statistics' },
        sources: [
          statisticsSources.history,
          statisticsSources.census2007,
          statisticsSources.area,
        ].map((s) => ({ label: s.title, url: s.url })),
      },
      {
        id: 'poverty',
        title: 'Poverty estimates',
        count: povertyStats.length,
        unit: 'estimates',
        summary: `Poverty incidence among the population for ${povertyStats.map((p) => p.year).join(', ')}, with confidence ranges.`,
        coverage:
          'Small-area estimates. The 2023 values were read from an archived copy of the PSA workbook because the direct download was unavailable.',
        publisher: 'Philippine Statistics Authority',
        period: `${povertyStats[0].year}–${povertyStats[povertyStats.length - 1].year}`,
        checkedOn: statisticsCheckedOn,
        status: 'verified',
        page: { to: '/statistics', label: 'City statistics' },
        sources: [statisticsSources.poverty, statisticsSources.povertyArchive].map((s) => ({
          label: s.title,
          url: s.url,
        })),
      },
    ],
  },
  {
    id: 'finance',
    title: 'Finance and projects',
    summary: 'City receipts and spending, major projects and procurement notices.',
    datasets: [
      {
        id: 'city-finances',
        title: 'City finances',
        count: fiscalYears.length,
        unit: 'fiscal years, plus outlook',
        summary: `City receipts and expenditures for FY${fiscalYears[0].year}–FY${fiscalYears[fiscalYears.length - 1].year}, ${currentYear.period} against the 2026 budget, the 20% Development Fund and the disaster fund, and the 2026–2027 outlook.`,
        coverage:
          'Transcribed from DBM tables and BLGF workbooks, which compile the City Treasurer’s own submissions, and from the City’s own Full Disclosure postings. FY2025 was checked against both DBM and BLGF. None is a COA audit.',
        publisher: `${fiscalSource.publisher}; Bureau of Local Government Finance; City Government of Mati`,
        period: `FY${fiscalYears[0].year}–FY${fiscalYears[fiscalYears.length - 1].year}; ${currentYear.period}; outlook to 2027`,
        checkedOn: [...fiscalYears.map((y) => y.source.checkedOn), currentYear.source.checkedOn]
          .sort()
          .at(-1)!,
        status: 'verified',
        page: { to: '/transparency/finance', label: 'City finances' },
        sources: [
          { label: currentYear.source.title, url: currentYear.source.url },
          { label: currentYear.budget.source.title, url: currentYear.budget.source.url },
          {
            label: specialFunds.developmentFund.source.title,
            url: specialFunds.developmentFund.source.url,
          },
          { label: specialFunds.ldrrmf.source.title, url: specialFunds.ldrrmf.source.url },
          ...[...fiscalYears].reverse().map((y) => ({ label: y.source.title, url: y.source.url })),
        ],
        downloads: [{ label: 'fiscal_transparency.json', href: '/data/fiscal_transparency.json' }],
      },
      {
        id: 'awarded-civil-works',
        title: 'Awarded civil works',
        count: awardedWorks.works.length,
        unit: 'works',
        summary:
          'Civil works the City’s Bids and Awards Committee reported as bid out, with location, budget ceiling, winning bidder, winning bid and date. They feed the project map.',
        coverage: `Transcribed row by row from the City’s quarterly “Bid Results on Civil Works” Full Disclosure postings, ${awardedWorks.reports.filter((r) => r.status === 'read').length} of ${awardedWorks.reports.length} quarters (the rest return a server error on the portal). A barangay is assigned only where the form’s own Location column names it. Winning bids are not final contract costs or actual spending.`,
        publisher: 'City Government of Mati (Bids and Awards Committee), via the DILG FDP Portal',
        period: `${awardedWorks.reports[0].period} – ${awardedWorks.reports[awardedWorks.reports.length - 1].period}`,
        checkedOn: awardedWorks.checkedOn,
        status: 'sourced',
        page: { to: '/transparency/projects#awarded-works', label: 'Awarded civil works' },
        sources: awardedWorks.reports
          .filter((r) => r.status === 'read')
          .map((r) => ({
            label: `Bid Results on Civil Works, ${r.period}`,
            url: `https://fdpp.dilg.gov.ph/fdpp/report/document-download?id=${r.portalId}`,
          })),
        confirmWith: 'BAC Secretariat (missing quarters, contract costs)',
      },
      {
        id: 'procurement',
        title: 'Procurement notices',
        count: procurementNotices.length,
        unit: 'notices',
        summary:
          'The City of Mati’s procurement notices on PhilGEPS, plus earlier City and DPWH records.',
        coverage:
          'Every notice the City had listed on PhilGEPS on the check date, plus three earlier records; not a complete history. The approved budget for the contract (ABC) is a bidding ceiling, not an amount awarded or paid.',
        publisher: [...new Set(procurementNotices.map((n) => n.sourceName))].join('; '),
        period: noticeDates.length
          ? `${noticeDates[0]} to ${noticeDates[noticeDates.length - 1]}`
          : '—',
        checkedOn: procurementCheckedOn,
        status: 'verified',
        page: { to: '/transparency/projects', label: 'Projects and procurement' },
        sources: unique(procurementNotices.map((n) => ({ label: n.name, url: n.sourceUrl }))),
        downloads: [
          { label: 'local-procurement.json', href: '/data/local-procurement.json' },
          { label: 'dpwh-projects.json', href: '/data/dpwh-projects.json' },
        ],
      },
      {
        id: 'projects',
        title: 'Major projects',
        count: risingProjects.length,
        unit: 'projects',
        summary: 'National and city projects in Mati, with their funding status.',
        coverage:
          'Two projects rest on national budget documents (the 2026 appropriation for Mati Airport and a 2027 proposal for the Matiao–Magsaysay coastal road), two on PhilGEPS notices, and three on Philippine News Agency reports. A budget proposal is not funding until Congress passes it.',
        publisher: 'DBM (GAA and NEP), PhilGEPS and Philippine News Agency',
        period: 'Funding status as reported',
        checkedOn: projectsCheckedOn,
        status: 'partial',
        page: { to: '/transparency/projects', label: 'Projects and procurement' },
        sources: unique(risingProjects.flatMap((p) => p.sources)),
      },
      {
        id: 'full-disclosure',
        title: 'Full Disclosure reports',
        count: fdpRecords.length,
        unit: 'reports',
        summary: `Budget, fund-utilization, procurement and cash-flow reports the City posted, ${fdpYears[0]}–${fdpYears[fdpYears.length - 1]}.`,
        coverage:
          'The City’s postings on the DILG Full Disclosure portal (posted 2024–2026), as the portal lists them, each download link tried; some files return a server error on the portal and are marked. Older reports are archived copies of files the City once posted on its website (reports from 2012–2014), each opened and checked. Years in between are missing.',
        publisher:
          'City Government of Mati, via the DILG Full Disclosure Policy Portal and the Internet Archive',
        period: `${fdpYears[0]}–${fdpYears[fdpYears.length - 1]}`,
        checkedOn: fdpCheckedOn,
        status: 'sourced',
        page: { to: '/transparency/full-disclosure', label: 'Full Disclosure reports' },
        sources: [{ label: fdpPortal.name, url: fdpPortal.url }],
        confirmWith: 'City Budget Office (current postings)',
      },
      {
        id: 'documents',
        title: 'Official documents',
        count: officialDocuments.length,
        unit: 'documents',
        summary:
          'The City Charter, ordinances and application forms that could be found and opened.',
        coverage:
          'Mostly archived copies from the City’s old website, which may be out of date. The 2025 Citizen’s Charter no longer opens and is listed as unavailable.',
        publisher: 'Congress, the Sangguniang Panlungsod and City offices',
        period: 'Various, 1993–2025',
        checkedOn: documentsCheckedOn,
        status: 'partial',
        page: { to: '/transparency/documents', label: 'Official documents' },
        sources: officialDocuments
          .filter((d) => d.status !== 'unavailable')
          .map((d) => ({ label: d.title, url: d.url })),
        confirmWith: 'City Information Office',
      },
    ],
  },
  {
    id: 'services',
    title: 'City services',
    summary: 'What each service involves and where to start.',
    datasets: [
      {
        id: 'services',
        title: 'Services and service guides',
        count: services.length,
        unit: `services, ${guideCount} guides`,
        summary: `Service listings and ${guideCount} service guides, each pointing to where to start and to ${referenceCount} official references.`,
        coverage:
          'Requirements, steps, fees and processing times are not yet confirmed with City offices, so the pages say “Confirm with office” instead.',
        publisher: 'City Charter (RA 9408), PSA, DSWD and other national references',
        period: 'Guidance as reviewed',
        checkedOn: serviceReviewDate,
        status: 'partial',
        page: { to: '/services', label: 'Services' },
        sources: Object.values(serviceReferences).map((r) => ({ label: r.title, url: r.url })),
        confirmWith: 'Each City office (see Services)',
      },
    ],
  },
  {
    id: 'visit',
    title: 'Visit Mati',
    summary: 'Places to visit and trip-planning notes.',
    datasets: [
      {
        id: 'tourism',
        title: 'Attractions and trip planning',
        count: attractions.length,
        unit: 'places',
        summary: 'Attractions, festivals and practical notes on the Visit Mati pages.',
        coverage:
          'Placeholder content. Directions, fees, permits, opening hours and photos still need the City Tourism Office’s information.',
        publisher: 'Not yet sourced',
        period: '—',
        checkedOn: null,
        status: 'draft',
        page: { to: '/visit-mati', label: 'Visit Mati' },
        sources: [],
        confirmWith: 'City Tourism Office',
      },
    ],
  },
];

export const allDatasets: Dataset[] = sourceGroups.flatMap((g) => g.datasets);

/** Things the site deliberately does not publish yet, and why. */
export const notPublished: { title: string; reason: string }[] = [
  {
    title: 'News updates',
    reason:
      'The News page is empty until official posts can be synced from the City’s Facebook page, or added by hand from an official source.',
  },
  {
    title: 'Competitiveness index (CMCI) scores',
    reason:
      'Left out until Mati’s own figures are confirmed; the Statistics page links to the DTI profile instead.',
  },
  {
    title: 'Office and officials’ contact details',
    reason:
      'Phone numbers, emails and office hours carried over from the template are hidden until the City confirms them.',
  },
  {
    title: 'Barangay officials and contacts',
    reason: 'Not yet available from an official source.',
  },
];

export function latestCheck(datasets: Dataset[] = allDatasets): string | null {
  const dates = datasets.map((d) => d.checkedOn).filter((d): d is string => Boolean(d));
  return dates.length ? dates.sort()[dates.length - 1] : null;
}
